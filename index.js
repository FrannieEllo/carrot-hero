
console.log("Game start!")

let player, ground, platform, carrots, falling, fallplat, g5;
let exit, bugs;
let playerIdle, playerJump, playerSuccess, playerDamage, bugsDefault;
let tutorialMessage
let walls, bgm, pickup;
let carrotsDefault;
let img, uncollectedimg, collectedimg;
var score = 0;
var lives = 3;
var timer = 0;
var level = 1;
let total = "Carrots: " + score;
let hp = "Lives: " + lives;

// game setup
window.setup = () => {

  img = loadImage("./assets/heart.png");
  uncollectedimg = loadImage("./assets/carrot-uncollected.png");
  collectedimg = loadImage("./assets/carrot-small.png");


  // background & environment main
  createCanvas(800, 500);
  background("lightblue");
  world.gravity.y = 90;
  score = 0;

  // main player
  player = new Sprite(-750, 450);

  // idle animation
  playerIdle = loadAnimation(
    "./assets/player-idle-1.png",
    "./assets/player-idle-2.png");
  playerIdle.frameDelay = 30;
  player.width = 48;
  player.height = 112;
  player.shapeColor = color("red");
  player.rotationLock = true;

  // jumping animation
  playerJump = loadAnimation(
    "./assets/player-jump.png"
  );
  playerJump.frameDelay = 200;

  // success ending animation
  playerSuccess = loadAnimation(
    "./assets/player-success.png"
    );

  // damage animation
  playerDamage = loadAnimation(
    "./assets/player-damage-1.png",
  )

  // bug animation
  bugsDefault = loadAnimation(
    "./assets/bug-1.png",
    "./assets/bug-2.png"
  )

  // walls main
  walls = new Group();
  walls.width = 30;
  walls.height = 4000;
  walls.collider = "static";
  walls.visible = false;

  exit = new Group();
  exit.width = 200;
  exit.height = 400;
  exit.collider = "static";
  exit.img = "./assets/barn.png"


  // ground platforms main
  ground = new Group();
  ground.collider = "static";
  ground.friction = 0; // used to prevent player rotation


  // ghost flooring main
  g5 = new Sprite(0, 800, 100000, 50);
  g5.collider = "static";

  // standard platform tiles main
  platform = new Group();
  platform.w = 115;
  platform.h = 25;
  platform.tile = '=';
  platform.collider = "static";
  platform.friction = 0;
  platform.img = "./assets/Platform.png"

  // falling floor main
  falling = new Group();
  falling.w = 115;
  falling.h = 20;
  falling.collider = "static";
  falling.friction = 0;
  falling.img = "./assets/falling.png"
  

  // carrots main
  carrots = new Group();
  carrots.w = 50;
  carrots.h = 50;
  carrots.collider = "static";
  carrotsDefault = loadAnimation(
    "./assets/carrot-1.png",
    "./assets/carrot-2.png",
    "./assets/carrot-3.png",
    "./assets/carrot-4.png",
  );
  carrotsDefault.frameDelay = 32;


  // stink bugs main
  bugs = new Group();
  bugs.w = 56;
  bugs.h = 56;
  //bugs.collider = "static";
  bugs.friction = 0;
  bugs.collider = "kinematic";


// level 1, aka the "tutorial" level
if (level == 1) {
  // lvl 1 barriers
  
  let wallTop = new walls.Sprite(400, 0);
  wallTop.rotation = 90;

  new walls.Sprite(-790, 250);
  new walls.Sprite(3800, 250);

  let g1 = new ground.Sprite(0, 500, 1550, 50);
  g1.img = "./assets/g1.png"
  let g2 = new ground.Sprite(1250, 500, 700, 50);
  g2.img = "./assets/g2.png"

  let g4 = new ground.Sprite(3500, 500, 2000, 50)
  g4.img = "./assets/g4.png"

  // lvl 1 stink bug
  let bug1 = new bugs.Sprite();
  bug1.x = 1000;
  bug1.y = 450; // ask hannah in class
  //if (bug1.x > 1100) {
  //  bug1.vel.x = -1;
  //} else if (bug1.x < 950) {
  //  bug1.vel.x = 1;
  //}

  // lvl 1 carrots
  let carrot1 = new carrots.Sprite();
  carrot1.x = 250;
  carrot1.y = 125;

  let carrot2 = new carrots.Sprite();
  carrot2.x = 900;
  carrot2.y = 425;

  let carrot3 = new carrots.Sprite();
  carrot3.x = 1850;
  carrot3.y = 400;

  let carrot4 = new carrots.Sprite();
  carrot4.x = 2750;
  carrot4.y = 400;

  let carrot5 = new carrots.Sprite();
  carrot5.x = 2975;
  carrot5.y = 50;

  player.overlaps(carrots, collect);

  // lvl 1 falling platforms
  for (let i = 0; i < 4; i++) {
    fallplat = new falling.Sprite();
    fallplat.x = 1660 + 115 * i;
    fallplat.y = 350;
  }

  // lvl 1 plat form tiles
  new Tiles(
    [
      "............................",
      "............................",
      "..=.........................",
      "........=................=..",
      ".=.=...................=...",
      ".......................=....",
      ".............=....=.........",
      "......=.....==....=..==.....",
      "......=....===....==........",
      "......=....===....==........",
    ],
    0,
  200,
    platform.w + 4,
    platform.h + 4
  );

  let exit1 = new exit.Sprite(3300, 350);
  player.overlaps(exit1);
} // close level 1

}


window.draw = () => {
  background("lightblue");
  
  // hud

  // health
 if (lives == 3) {
    image(img, 150, 50);
    image(img, 100, 50);
    image(img, 50, 50);
  } else if (lives == 2) {
    image(img, 100, 50);
    image(img, 50, 50);
  } else if (lives == 1) {
    image(img, 50, 50);
  }

  // carrot score
  for (let i = 1; i < 6; i++) {
    image(uncollectedimg, 450 + i * 50, 40);
  }

  for (let x = 0; x < score; x++) {
    image(collectedimg, 500 + x * 50, 40);
  }


  // tutorial message events
  tutorialMessage = "";
  if (player.x > -800 && player.x < -375) {
    tutorialMessage = "Welcome to Carrot Hero! Use your Right and Left arrow keys to move.";
  } else if (player.x > -400 && player.x < 540) {
    tutorialMessage = "Use your Up arrow key to jump!";
  } else if (player.x > 600 && player.x < 1250) {
    tutorialMessage = "Avoid the stink bugs...";
  } else if (player.x > 1400 && player.x < 2000) {
    tutorialMessage = "and watch out for surprises ;)";

  }
  
  // tutorial message display
  text(tutorialMessage, width / 2, 150);
  textAlign(CENTER);

  text("(" + mouseX + ", " + mouseY + ")", mouseX, mouseY);
  allSprites.debug = mouse.pressing();

  total = "Carrots: " + score;
  text(total, 300, 60);

  hp = "Lives: " + lives;
  text(hp, 400, 60);
  
  carrots.ani = carrotsDefault;
  if (player.overlapped(carrots)) {
    score+=1;
    console.log("You collected a carrot!");
    console.log(score);
  } 

  bugs.ani = bugsDefault;

  camera.x = player.x;
  // player x movement
  if (kb.pressing("right")) {
    player.vel.x = 5;
    player.mirror.x = false;
  } else if (kb.pressing("left")) {
    player.vel.x = -5;
    player.mirror.x = true;
  } else {
    player.vel.x = 0;
    player.ani = playerIdle;

  }

  // player y movement
  if (kb.presses("up")) {
    player.vel.y = -27;
    player.ani = playerJump;
  } else if (kb.pressing("down")) {
    player.vel.y = 50;
  }

  // falling platform
  for (let i = 0; i < 4; i++) {
    if (player.collides(falling[i])) {
      falling[i].collider = "dynamic";
    }
  }

  // collision events
  if (player.overlapping(exit)) {
    let msg = "Woohoo! You made it to the end with " + score + " carrots!! Please refresh to play again!"
    text(msg, width / 2, 150);
    textAlign(CENTER);
    console.log("That's the end! Thanks for playing.")
    player.ani = playerSuccess;
  } else if (player.collides(g5)) {
    lives -= 1;
    resetPlayer();
    console.log("Uh oh, you fell!")
  }

  if (player.collides(bugs)) {
    lives -=1;
    player.ani = playerDamage;
  }

  if (lives == 0) {
    gameOver();
  }

}

function resetPlayer() {
  player.vel.x = 0;
  player.vel.y = 0;
  player.x = -750;
  player.y = 450;
  
}

function collect(player, carrots) {
  carrots.remove();
}

function gameOver() {
  player.remove();
  let msg = "Game Over. You ran out of lives! Refresh to restart."
  text(msg, 250, 200);
}