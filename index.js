
console.log("Game start!")

let player, ground, platform, carrots, falling, fallplat, g5;
let exit;
let playerIdle, playerJump, playerSuccess;
let walls, bgm, pickup;
let carrotsDefault;
var score = 0;
var lives = 3;
let total = "Carrots: " + score;
let hp = "Lives: " + lives;


// game setup
window.setup = () => {

  // background & environment
  createCanvas(800, 500);
  background("lightblue");
  world.gravity.y = 90;
  score = 0;

  // walls
  walls = new Group();
  walls.width = 30;
  walls.height = 4000;

  walls.collider = "static";
  let wallTop = new walls.Sprite(400, 0);
  wallTop.rotation = 90;

  new walls.Sprite(-500, 250);
  new walls.Sprite(3800, 250);

  walls.visible = false;



  exit = new Sprite(3300, 350, 200, 400, "static");
  exit.collider = "static";
  exit.img = "./assets/barn.png"

  // ground platforms
  ground = new Group();
  ground.collider = "static";
  ground.friction = 0; // used to prevent player rotation

  let g1 = new ground.Sprite(0, 500, 1550, 50);
  g1.img = "./assets/g1.png"
  let g2 = new ground.Sprite(1250, 500, 700, 50);
  g2.img = "./assets/g2.png"

  let g4 = new ground.Sprite(3500, 500, 2000, 50)
  g4.img = "./assets/g4.png"


  // ghost flooring
  g5 = new Sprite(0, 800, 100000, 50);
  g5.collider = "static";

  // main player
  player = new Sprite(-100, 450);

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

  // standard platform tiles
  platform = new Group();
  platform.w = 115;
  platform.h = 25;
  platform.tile = '=';
  platform.collider = "static";
  platform.friction = 0;
  platform.img = "./assets/Platform.png"


  new Tiles(
    [
      "............................",
      "............................",
      "..=.........................",
      "........=................=..",
      ".=.=...................=...",
      ".......................=....",
      ".............=....=.........",
      "............==....=..==.....",
      "......=....===....==........",
      "......=....===....==........",
    ],
    0,
  200,
    platform.w + 4,
    platform.h + 4
  );

  // falling floor
  falling = new Group();
  falling.w = 115;
  falling.h = 20;
  falling.collider = "static";
  falling.friction = 0;
  falling.img = "./assets/falling.png"
  
  for (let i = 0; i < 4; i++) {
    fallplat = new falling.Sprite();
    fallplat.x = 1660 + 115 * i;
    fallplat.y = 350;
  }

  // carrots
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

  // locations of all carrots in level. These needed to be hard-coded
  // because I had mapped out precisely where I wanted them on this level.
  let carrot1 = new carrots.Sprite();
  carrot1.x = 250;
  carrot1.y = 125;

  let carrot2 = new carrots.Sprite();
  carrot2.x = 1050;
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

}

window.draw = () => {
  background("lightblue");
  //text("(" + mouseX + ", " + mouseY + ")", mouseX, mouseY);
  //allSprites.debug = mouse.pressing();

  total = "Carrots: " + score;
  text(total, 50, 50);

  hp = "Lives: " + lives;
  text(hp, 500, 50);
  
  carrots.ani = carrotsDefault;
  if (player.overlapped(carrots)) {
    score+=1;
    console.log("You collected a carrot!");
    console.log(score);
  }

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
    text(msg, 175, 150);
    console.log("That's the end! Thanks for playing.")
    player.ani = playerSuccess;
  } else if (player.collides(g5)) {
    lives -= 1;
    resetPlayer();
    console.log("Uh oh, you fell!")
  }

  if (lives == 0) {
    gameOver();
  }
}

function resetPlayer() {
  player.vel.x = 0;
  player.vel.y = 0;
  player.x = -100;
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