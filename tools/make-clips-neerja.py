"""Makes the voice clips with Microsoft's neural Indian English voice "Neerja" (en-IN-NeerjaNeural), one MP3 per
line of tools/clip-list.txt, plus <name>.json with the start of each word in ms (for the highlights). Then run:
    node tools/import-clips.js audio/incoming

Setup (once):  pip install edge-tts        (Python 3.8+)
Run:           python tools/make-clips-neerja.py [--rate -10%] [--voice en-IN-NeerjaNeural] [--out audio/incoming] [--jobs 4]

It uses Microsoft Edge's online read-aloud voices through the edge-tts package, so it needs the internet while it
runs (the app itself never does). Dev only; never shipped. Clips already made are skipped, so it can be re-run after
a failure or a content change; delete a clip to make it again. Before switching voices, empty the output folder so
old clips (e.g. Heera's WAVs) don't mix in: the importer prefers an MP3 over a WAV of the same name.
"""
import argparse
import asyncio
import json
import os
import sys

try:
    import edge_tts
except ImportError:
    sys.exit("This needs the edge-tts package: pip install edge-tts")

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


def read_list(path):
    """[(key, base name)] from tools/clip-list.txt (key <TAB> file.mp3), with any line endings."""
    out = []
    with open(path, encoding="utf-8") as f:
        for line in f.read().splitlines():
            if not line or line.startswith("#"):
                continue
            key, file = line.split("\t")
            out.append((key, file[:-4] if file.endswith(".mp3") else file))
    return out


async def make(key, base, args):
    """Writes <base>.mp3 and, when there is one boundary per word, <base>.json. Returns True when made."""
    mp3 = os.path.join(args.out, base + ".mp3")
    tmp = mp3 + ".part"
    times = []
    comm = edge_tts.Communicate(key, args.voice, rate=args.rate, boundary="WordBoundary")
    with open(tmp, "wb") as f:
        async for chunk in comm.stream():
            if chunk["type"] == "audio":
                f.write(chunk["data"])
            elif chunk["type"] == "WordBoundary":
                times.append(round(chunk["offset"] / 10000))  # 100 ns units -> ms
    if os.path.getsize(tmp) == 0:
        os.remove(tmp)
        raise RuntimeError("no audio")
    os.replace(tmp, mp3)
    # Keep word times only if there is one per word of the key (the importer checks again).
    js = os.path.join(args.out, base + ".json")
    if len(times) == len(key.split(" ")):
        with open(js, "w", encoding="ascii") as f:
            json.dump(times, f)
    elif os.path.exists(js):
        os.remove(js)
    return True


async def main():
    ap = argparse.ArgumentParser(description="Make the voice clips with Neerja (en-IN).")
    ap.add_argument("--voice", default="en-IN-NeerjaNeural")
    ap.add_argument("--rate", default="-5%", help="speaking speed, e.g. -10%% or +0%% (the app also has a Speed slider)")
    ap.add_argument("--out", default=os.path.join(ROOT, "audio", "incoming"))
    ap.add_argument("--jobs", type=int, default=4, help="clips made at the same time")
    ap.add_argument("--only", nargs="*", help="make just these keys (to try the voice first), e.g. --only \"that says\" come")
    args = ap.parse_args()
    os.makedirs(args.out, exist_ok=True)

    todo = [(k, b) for k, b in read_list(os.path.join(ROOT, "tools", "clip-list.txt"))
            if (not args.only or k in args.only) and not os.path.exists(os.path.join(args.out, b + ".mp3"))]
    print(f"Voice: {args.voice}, rate {args.rate}. {len(todo)} clips to make in {args.out}")
    sem = asyncio.Semaphore(max(1, args.jobs))
    failed, done = [], 0

    async def one(key, base):
        nonlocal done
        async with sem:
            for attempt in range(4):
                try:
                    await make(key, base, args)
                    done += 1
                    if done % 100 == 0:
                        print(f"{done} clips...")
                    return
                except Exception as e:  # network hiccups: wait and try again
                    if attempt == 3:
                        failed.append(f"{base} ({e})")
                    else:
                        await asyncio.sleep(2 ** (attempt + 1))

    await asyncio.gather(*(one(k, b) for k, b in todo))
    print(f"Made {done} clips.")
    if failed:
        print(f"{len(failed)} failed (run again to retry): " + ", ".join(failed[:10]))
    print("Next: node tools/import-clips.js " + os.path.relpath(args.out, ROOT).replace(os.sep, "/"))
    return 1 if failed else 0


if __name__ == "__main__":
    sys.exit(asyncio.run(main()))
