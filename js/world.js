/* My world: the KG-2 "world around me" (EVS) topics as spoken picture questions, in the order UKG classes teach them.
   Each topic is an `e:` item with a box, like the maths and language skills: the first OPEN are open, and each next one
   opens when the one before reaches box 2. Questions are in the shared shape { prompt, show, opts, answer, right, key }
   and drawn by LR.steps.math. Pictures are emoji from Unicode 6 (the tablet's Android 5.1 font) or inline SVG. */
(function(){
'use strict';
var LR = window.LR = window.LR || {};

/* A traffic light with one lamp lit (colour plus position: red on top, green at the bottom). */
function light(which){
  var on = { red:0, amber:1, green:2 }[which], c = ['#E5484D', '#F5A524', '#3FA34D'], s = '<svg class="m-size" viewBox="0 0 60 150" aria-hidden="true"><rect x="8" y="4" width="44" height="130" rx="10" fill="#1E2B38"/>';
  for (var i = 0; i < 3; i++) s += '<circle cx="30" cy="' + (26 + i * 42) + '" r="15" fill="' + (i === on ? c[i] : '#4A5560') + '"/>';
  return s + '<rect x="26" y="134" width="8" height="14" fill="#1E2B38"/></svg>';
}

/* Things to pick: [picture, name with its article]. A picture starting with "<" is SVG. */
var I = {
  nose:['👃', 'a nose'], ear:['👂', 'an ear'], mouth:['👄', 'a mouth'], hand:['✋', 'a hand'], eyes:['👀', 'eyes'], tongue:['👅', 'a tongue'], feet:['👣', 'feet'],
  baby:['👶', 'a baby'], grandpa:['👴', 'a grandfather'], grandma:['👵', 'a grandmother'], man:['👨', 'a man'], woman:['👩', 'a woman'], boy:['👦', 'a boy'], girl:['👧', 'a girl'],
  apple:['🍎', 'an apple'], banana:['🍌', 'a banana'], grapes:['🍇', 'grapes'], melon:['🍉', 'a watermelon'], orange:['🍊', 'an orange'], pineapple:['🍍', 'a pineapple'],
  corn:['🌽', 'corn'], brinjal:['🍆', 'a brinjal'], sweetpotato:['🍠', 'a sweet potato'],
  rice:['🍚', 'rice'], bread:['🍞', 'bread'], sweets:['🍬', 'sweets'], lolly:['🍭', 'a lollipop'], doughnut:['🍩', 'a doughnut'], chips:['🍟', 'chips'], chocolate:['🍫', 'chocolate'],
  tree:['🌳', 'a tree'], cactus:['🌵', 'a cactus'], seedling:['🌱', 'a seedling'], sunflower:['🌻', 'a sunflower'], rose:['🌹', 'a rose'], tulip:['🌷', 'a tulip'], leaf:['🍃', 'a leaf'],
  water:['💧', 'water'], sun:['🌞', 'the sun'], ball:['⚽', 'a ball'], tv:['📺', 'a TV'],
  dog:['🐶', 'a dog'], cat:['🐱', 'a cat'], cow:['🐄', 'a cow'], goat:['🐐', 'a goat'], hen:['🐔', 'a hen'], sheep:['🐑', 'a sheep'],
  tiger:['🐯', 'a tiger'], bear:['🐻', 'a bear'], crocodile:['🐊', 'a crocodile'], panda:['🐼', 'a panda'], monkey:['🐒', 'a monkey'], snake:['🐍', 'a snake'],
  fish:['🐟', 'a fish'], whale:['🐳', 'a whale'], octopus:['🐙', 'an octopus'], dolphin:['🐬', 'a dolphin'], bird:['🐦', 'a bird'], bee:['🐝', 'a bee'],
  chick:['🐤', 'a chick'], calf:['🐮', 'a calf'], puppy:['🐶', 'a puppy'], kitten:['🐱', 'a kitten'],
  ant:['🐜', 'an ant'], bug:['🐛', 'a caterpillar'], ladybird:['🐞', 'a ladybird'], penguin:['🐧', 'a penguin'], rooster:['🐓', 'a rooster'], snail:['🐌', 'a snail'],
  car:['🚗', 'a car'], bus:['🚌', 'a bus'], bike:['🚲', 'a bike'], train:['🚆', 'a train'], tractor:['🚜', 'a tractor'], boat:['⛵', 'a boat'], ship:['🚢', 'a ship'],
  helicopter:['🚁', 'a helicopter'], rocket:['🚀', 'a rocket'],
  fireengine:['🚒', 'a fire engine'], ambulance:['🚑', 'an ambulance'], police:['👮', 'a police officer'], builder:['👷', 'a builder'], postbox:['📮', 'a post box'], medicine:['💊', 'medicine'],
  umbrella:['☔', 'an umbrella'], snowman:['⛄', 'a snowman'], icecream:['🍦', 'ice cream'], tea:['☕', 'hot tea'],
  moon:['🌙', 'the moon'], star:['⭐', 'a star'], rainbow:['🌈', 'a rainbow'],
  fire:['🔥', 'fire'], knife:['🔪', 'a knife'],
  red:[light('red'), 'the red light'], amber:[light('amber'), 'the orange light'], green:[light('green'), 'the green light']
};
/* A question: the spoken question, what to say when right ({w}: the thing, capitalised at the start), right things, wrong things. */
function Q(q, yes, a, d){ return { q:q, yes:yes, a:a, d:d }; }
var BODY = ['nose', 'ear', 'mouth', 'hand', 'tongue'], FAMILY = ['baby', 'grandpa', 'grandma', 'boy', 'girl'];
var FRUIT = ['apple', 'banana', 'grapes', 'melon', 'orange', 'pineapple'], VEG = ['corn', 'brinjal', 'sweetpotato'];
var GOOD = ['apple', 'banana', 'rice', 'bread', 'grapes'], JUNK = ['sweets', 'lolly', 'doughnut', 'chips', 'chocolate'];
var PETS = ['dog', 'cat', 'cow', 'goat', 'hen', 'sheep'], WILD = ['tiger', 'bear', 'crocodile', 'panda'];
var LAND = ['car', 'bus', 'bike', 'train', 'tractor'], WATER = ['boat', 'ship'], AIR = ['helicopter', 'rocket'];
var HELP = ['fireengine', 'ambulance', 'police', 'builder', 'postbox', 'medicine'];

var TOPICS = [
  { id:'body', name:'Parts of the body', qs:BODY.map(function(k){ return Q('Which one is ' + I[k][1] + '?', 'Yes! That is ' + I[k][1] + '.', [k], BODY.filter(function(x){ return x !== k; })); }) },
  { id:'senses', name:'Senses', qs:[
    Q('What do we see with?', 'Yes! We see with our eyes.', ['eyes'], ['ear', 'nose', 'hand', 'tongue']),
    Q('What do we hear with?', 'Yes! We hear with our ears.', ['ear'], ['eyes', 'nose', 'hand', 'tongue']),
    Q('What do we smell with?', 'Yes! We smell with our nose.', ['nose'], ['eyes', 'ear', 'hand', 'tongue']),
    Q('What do we taste with?', 'Yes! We taste with our tongue.', ['tongue'], ['eyes', 'ear', 'hand', 'feet']),
    Q('What do we touch with?', 'Yes! We touch with our hands.', ['hand'], ['eyes', 'ear', 'nose', 'tongue'])] },
  { id:'family', name:'Family', qs:[
    Q('Which one is the baby?', 'Yes! That is the baby.', ['baby'], ['grandpa', 'grandma', 'man', 'woman']),
    Q('Which one is a grandmother, like Nani?', 'Yes! That is a grandmother.', ['grandma'], ['baby', 'girl', 'boy', 'grandpa']),
    Q('Which one is a grandfather?', 'Yes! That is a grandfather.', ['grandpa'], ['baby', 'girl', 'boy', 'grandma']),
    Q('Which one is a girl?', 'Yes! That is a girl.', ['girl'], ['boy', 'baby', 'grandpa']),
    Q('Which one is a boy?', 'Yes! That is a boy.', ['boy'], ['girl', 'baby', 'grandma'])] },
  { id:'fruit', name:'Fruit and vegetables', qs:[
    Q('Which one is a fruit?', 'Yes! {w} is a fruit.', FRUIT, VEG),
    Q('Which one is a vegetable?', 'Yes! {w} is a vegetable.', VEG, FRUIT)] },
  { id:'healthy', name:'Healthy food', qs:[
    Q('Which one is good to eat every day?', 'Yes! {w} is good for you.', GOOD, JUNK)] },
  { id:'plants', name:'Plants', qs:[
    Q('Which one is a plant?', 'Yes! {w} is a plant.', ['tree', 'cactus', 'seedling'], ['dog', 'ball', 'car', 'fish']),
    Q('Which one is a flower?', 'Yes! {w} is a flower.', ['sunflower', 'rose', 'tulip'], ['tree', 'leaf', 'cactus']),
    Q('What do plants need to grow?', 'Yes! Plants need {w}.', ['water', 'sun'], ['sweets', 'ball', 'tv'])] },
  { id:'animals', name:'Pet and wild animals', qs:[
    Q('Which one is a wild animal?', 'Yes! {w} is a wild animal.', WILD, PETS),
    Q('Which one can be a pet?', 'Yes! {w} can be a pet.', ['dog', 'cat'], WILD),
    Q('Which one gives us milk?', 'Yes! {w} gives us milk.', ['cow', 'goat'], ['tiger', 'snake', 'hen', 'dog'])] },
  { id:'homes', name:'Where animals live', qs:[
    Q('Which one lives in water?', 'Yes! {w} lives in water.', ['fish', 'whale', 'octopus', 'dolphin'], ['dog', 'cat', 'cow', 'hen', 'monkey']),
    Q('Which one lives in a tree?', 'Yes! {w} lives in a tree.', ['monkey', 'bird'], ['fish', 'cow', 'whale', 'goat']),
    Q('Which one lives in a hive?', 'Yes! {w} lives in a hive.', ['bee'], ['dog', 'fish', 'cow', 'tiger'])] },
  { id:'sounds', name:'Animal sounds', qs:[
    Q('Which animal says moo?', 'Yes! {w} says moo.', ['cow'], ['dog', 'cat', 'hen', 'sheep']),
    Q('Which animal says woof?', 'Yes! {w} says woof.', ['dog'], ['cow', 'cat', 'hen', 'sheep']),
    Q('Which animal says meow?', 'Yes! {w} says meow.', ['cat'], ['cow', 'dog', 'hen', 'sheep']),
    Q('Which animal says baa?', 'Yes! {w} says baa.', ['sheep'], ['cow', 'dog', 'cat', 'hen']),
    Q('Which animal says cluck?', 'Yes! {w} says cluck.', ['hen'], ['cow', 'dog', 'cat', 'sheep']),
    Q('Which animal says roar?', 'Yes! {w} says roar.', ['tiger'], ['cow', 'hen', 'sheep', 'snake'])] },
  { id:'young', name:'Baby animals', qs:[
    Q('A baby dog is a puppy. Find the puppy.', 'Yes! That is a puppy.', ['puppy'], ['chick', 'calf', 'fish']),
    Q('A baby cat is a kitten. Find the kitten.', 'Yes! That is a kitten.', ['kitten'], ['chick', 'calf', 'fish']),
    Q('A baby hen is a chick. Find the chick.', 'Yes! That is a chick.', ['chick'], ['puppy', 'kitten', 'calf']),
    Q('A baby cow is a calf. Find the calf.', 'Yes! That is a calf.', ['calf'], ['puppy', 'kitten', 'chick'])] },
  { id:'insects', name:'Insects and birds', qs:[
    Q('Which one is an insect?', 'Yes! {w} is an insect.', ['bee', 'ant', 'ladybird', 'bug'], ['bird', 'fish', 'dog', 'penguin']),
    Q('Which one is a bird?', 'Yes! {w} is a bird.', ['bird', 'penguin', 'rooster'], ['bee', 'ant', 'fish', 'snail']),
    Q('Which one can fly?', 'Yes! {w} can fly.', ['bird', 'bee'], ['fish', 'cow', 'snail', 'penguin'])] },
  { id:'transport', name:'Land, water and air', qs:[
    Q('Which one goes on the road?', 'Yes! {w} goes on the road.', ['car', 'bus', 'bike', 'tractor'], WATER.concat(AIR)),
    Q('Which one goes on water?', 'Yes! {w} goes on water.', WATER, LAND.concat(AIR)),
    Q('Which one goes up in the air?', 'Yes! {w} goes up in the air.', AIR, LAND.concat(WATER))] },
  { id:'helpers', name:'Helpers', qs:[
    Q('Which one comes when there is a fire?', 'Yes! {w} comes when there is a fire.', ['fireengine'], ['ambulance', 'police', 'postbox', 'builder']),
    Q('Which one takes sick people to hospital?', 'Yes! {w} takes sick people to hospital.', ['ambulance'], ['fireengine', 'police', 'postbox', 'builder']),
    Q('Who keeps us safe on the road?', 'Yes! {w} keeps us safe.', ['police'], ['builder', 'postbox', 'medicine', 'fireengine']),
    Q('Who builds houses?', 'Yes! {w} builds houses.', ['builder'], ['police', 'postbox', 'medicine', 'ambulance']),
    Q('Where do we post a letter?', 'Yes! In {w}.', ['postbox'], ['ambulance', 'medicine', 'fireengine']),
    Q('What does a doctor give us when we are sick?', 'Yes! The doctor gives us {w}.', ['medicine'], ['postbox', 'police', 'builder'])] },
  { id:'weather', name:'Weather and seasons', qs:[
    Q('What do we need when it rains?', 'Yes! We need {w}.', ['umbrella'], ['snowman', 'icecream', 'sun']),
    Q('What is good on a hot summer day?', 'Yes! {w} on a hot day.', ['icecream', 'melon'], ['tea', 'snowman', 'umbrella']),
    Q('What can we make in the snow in winter?', 'Yes! {w}.', ['snowman'], ['icecream', 'umbrella', 'melon'])] },
  { id:'sky', name:'Day and night', qs:[
    Q('What do we see in the sky at night?', 'Yes! We see {w} at night.', ['moon', 'star'], ['sun', 'rainbow']),
    Q('What do we see in the sky in the day?', 'Yes! We see {w} in the day.', ['sun'], ['moon', 'star']),
    Q('What can we see after rain, when the sun comes out?', 'Yes! {w}.', ['rainbow'], ['moon', 'star', 'snowman'])] },
  { id:'safety', name:'Safety', qs:[
    Q('Which light means stop?', 'Yes! {w} means stop.', ['red'], ['amber', 'green']),
    Q('Which light means go?', 'Yes! {w} means go.', ['green'], ['red', 'amber']),
    Q('Which one is hot? Do not touch it!', 'Yes! {w} is hot. Do not touch it.', ['fire'], ['apple', 'ball', 'cat']),
    Q('Which one is safe to play with?', 'Yes! {w} is safe to play with.', ['ball'], ['fire', 'knife'])] }
];
var OPEN = 2;

function cap(s){ return s.charAt(0).toUpperCase() + s.slice(1); }
function picHTML(k){ var p = I[k][0]; return p.charAt(0) === '<' ? p : '<span class="s-picimg" aria-hidden="true">' + p + '</span>'; }
function gen(item){
  var t = TOPICS.filter(function(x){ return x.id === item.e; })[0];
  if (!t) return null;
  var r = LR.maths.rng(item.seed || 1), q = r.pick(t.qs), a = r.pick(q.a), d = r.shuffle(q.d).slice(0, 2);
  var yes = q.yes.indexOf('{w}') === 5 ? q.yes.replace('{w}', cap(I[a][1])) : q.yes.replace('{w}', I[a][1]);
  return { prompt:q.q, show:'', answer:a, right:yes, key:item.e + a,
    opts:r.shuffle([a].concat(d)).map(function(k){ return { v:k, html:picHTML(k), label:I[k][1] }; }) };
}

LR.world = { TOPICS:TOPICS, OPEN:OPEN, ITEMS:I, gen:gen, ids:TOPICS.map(function(t){ return t.id; }) };
})();
