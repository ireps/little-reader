# Makes the voice clips with a Windows computer voice (Indian English "Heera" by default), one WAV per line of
# tools/clip-list.txt, plus <name>.json with the start of each word in ms. Then run:
#   node tools/import-clips.js audio/incoming     (converts the WAVs to MP3 with ffmpeg)
# Usage, in PowerShell from the repo folder:
#   powershell -ExecutionPolicy Bypass -File tools/make-clips.ps1 [-Voice "Heera"] [-Rate 0] [-Out audio/incoming]
# Install the voice under Settings > Time & language > Speech > Add voices > English (India).
# Dev only; never shipped. Uses only Windows' own System.Speech.
param(
  [string]$Voice = "Heera",
  [int]$Rate = 0,
  [string]$Out = "audio/incoming"
)
$ErrorActionPreference = "Stop"
Add-Type -AssemblyName System.Speech

$root = Split-Path -Parent $PSScriptRoot
$list = Join-Path $root "tools/clip-list.txt"
$outDir = Join-Path $root $Out
New-Item -ItemType Directory -Force -Path $outDir | Out-Null

$synth = New-Object System.Speech.Synthesis.SpeechSynthesizer
$pick = $synth.GetInstalledVoices() | Where-Object { $_.Enabled -and $_.VoiceInfo.Name -like "*$Voice*" } | Select-Object -First 1
if (-not $pick) {
  Write-Host "No installed voice matches '$Voice'. Installed voices:"
  $synth.GetInstalledVoices() | ForEach-Object { Write-Host ("  " + $_.VoiceInfo.Name + " (" + $_.VoiceInfo.Culture + ")") }
  exit 1
}
$synth.SelectVoice($pick.VoiceInfo.Name)
$synth.Rate = $Rate
Write-Host ("Voice: " + $pick.VoiceInfo.Name)

# Word start times, from SpeakProgress events while each clip is written.
$script:times = New-Object System.Collections.Generic.List[int]
Register-ObjectEvent -InputObject $synth -EventName SpeakProgress -SourceIdentifier LRProgress | Out-Null

$n = 0
foreach ($line in Get-Content -Encoding UTF8 $list) {
  if ($line -eq "" -or $line.StartsWith("#")) { continue }
  $parts = $line.Split("`t")
  $key = $parts[0]
  $base = [System.IO.Path]::GetFileNameWithoutExtension($parts[1])
  $wav = Join-Path $outDir ($base + ".wav")
  if (Test-Path $wav) { continue }   # already made; delete a file to make it again

  # The voice's own format: forcing another sample rate resamples it and dulls the sound.
  $synth.SetOutputToWaveFile($wav)
  $synth.Speak($key)
  $synth.SetOutputToNull()

  $times = @()
  Get-Event -SourceIdentifier LRProgress -ErrorAction SilentlyContinue | ForEach-Object {
    $times += [int]$_.SourceEventArgs.AudioPosition.TotalMilliseconds
    Remove-Event -EventIdentifier $_.EventIdentifier
  }
  # Keep the times only if there is one per word (the importer checks again).
  if ($times.Count -eq $key.Split(" ").Count) {
    "[" + ($times -join ",") + "]" | Set-Content -Encoding ASCII (Join-Path $outDir ($base + ".json"))
  }
  $n++
  if ($n % 100 -eq 0) { Write-Host "$n clips..." }
}
Unregister-Event -SourceIdentifier LRProgress
$synth.Dispose()
Write-Host "Made $n clips in $outDir. Next: node tools/import-clips.js $Out"
