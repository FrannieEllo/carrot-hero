console.log("Game start!");

let player, ground, platform, carrots, falling, fallplat, g5;
let exit, bugs, spikes;
let playerIdle, playerJump, playerSuccess, playerDamage, bugsDefault;
let tutorialMessage;
let walls;
let carrotsDefault;
let img, uncollectedimg, collectedimg, barnimg, bgImg, buttonImg, logoImg, gameoverImg, menubuttonImg;
var x1 = 0;
var x2;
var scrollSpeed = 0.25;
var score = 0;
var lives = 3;
var level = 0;
let total = "Carrots: " + score;
let hp = "Lives: " + lives; 

// game setup
window.setup = () => {
	bgImg = loadImage("./assets/game-background.png");
  img = loadImage("./assets/heart.png");
  uncollectedimg = loadImage("./assets/carrot-uncollected.png");
  collectedimg = loadImage("./assets/carrot-small.png");
  barnimg = loadImage("./assets/barn.png");
  buttonImg = loadImage("./assets/button.png");
  logoImg = loadImage("./assets/carrot-hero-logo.png");
  gameoverImg = loadImage("./assets/game-over.png");
  menubuttonImg = loadImage("./assets/menu-button.png");


  // background & environment main
  createCanvas(800, 500);
  world.gravity.y = 90;
  score = 0;
  x2 = width;

  // exit barn
  exit = new Group();
  exit.width = 200;
  exit.height = 400;
  exit.collider = "static";
  exit.img = "./assets/barn.png";
  exit.layer = 1;

  // main player
  player = new Sprite(-750, 450);
  player.width = 48;
  player.height = 112;
  player.rotationLock = true;
  player.layer = 2;

  // idle animation
  playerIdle = loadAnimation(
    "./assets/player-idle-1.png",
    "./assets/player-idle-2.png");
  playerIdle.frameDelay = 30;

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
  );

  // bug animation
  bugsDefault = loadAnimation(
    "./assets/bug-1.png",
    "./assets/bug-2.png"
  );

  bugsDefault.frameDelay = 64;

  // spikes main
  spikes = new Group();
  spikes.width = 26;
  spikes.height = 104;
  spikes.collider = "static";
  spikes.img ="./assets/spikes.png";
  
  // walls main
  walls = new Group();
  walls.width = 30;
  walls.height = 4000;
  walls.collider = "static";
  walls.visible = false;


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
  platform.img = "./assets/Platform.png";

  // falling floor main
  falling = new Group();
  falling.w = 115;
  falling.h = 20;
  falling.collider = "static";
  falling.friction = 0;
  falling.img = "./assets/falling.png";
  

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

};

window.draw = () => {
  clear();
  image(bgImg, x1, 0, width, height);
  image(bgImg, x2, 0, width, height);
  
  x1 -= scrollSpeed;
  x2 -= scrollSpeed;
  
  if (x1 < -width){
    x1 = width;
  }
  if (x2 < -width){
    x2 = width;
  }
  if (level == 0) { // game menu
    player.x = 0;
    player.y = 0;
    player.visible = true;
    // menu
    image(logoImg, 220, 25, logoImg.width, logoImg.height);
    image(barnimg, 245, 150, barnimg.width / 2, barnimg.height / 2);
    image(buttonImg, 265, 390, buttonImg.width, buttonImg.height);

  } else if (level == -1) {
    player.x = 0;
    player.y = 0;
    player.visible = false;
    image(gameoverImg, 60, 150, gameoverImg.width, gameoverImg.height);
    image(menubuttonImg, 265, 325, menubuttonImg.width, menubuttonImg.height);
  }

  if (level != 0 && level != -1) {
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
    // hud - carrot score
    for (let i = 1; i < 6; i++) {
      image(uncollectedimg, 450 + i * 50, 40);
    }
    for (let x = 0; x < score; x++) {
      image(collectedimg, 500 + x * 50, 40);
    }

    // hud text health, score
    total = "Carrots: " + score;
    text(total, 400, 60);

    hp = "Lives: " + lives;
    text(hp, 300, 60);

    gameOver();

  }



  // tutorial message events

  tutorialMessage = "";
  if (level == 1 ) {
    if (player.x > -800 && player.x < -375) {
      tutorialMessage = "Welcome to Carrot Hero! Use your Right and Left arrow keys to move.";
    } else if (player.x > -400 && player.x < 540) {
      tutorialMessage = "Use your Up arrow key to jump!";
    } else if (player.x > 600 && player.x < 1250) {
      tutorialMessage = "Avoid the stink bugs...";
    } else if (player.x > 1400 && player.x < 2000) {
      tutorialMessage = "and watch out for surprises ;)";
  
    }
  }

  
  // tutorial message display
  text(tutorialMessage, width / 2, 150);
  textAlign(CENTER);

  text("(" + mouseX + ", " + mouseY + ")", mouseX, mouseY);
  allSprites.debug = mouse.pressing();
  
  carrots.ani = carrotsDefault;
  if (player.overlapped(carrots)) {
    score+=1;
    console.log("You collected a carrot!");
    console.log(score);
  } 

  bugs.ani = bugsDefault;

  camera.x = player.x;
 //camera.y = player.y - 150;
  if (player.y < 30) {
    camera.y = player.y - 50;
  } else {
    camera.y = 275;
  }
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

  // lvl 1 falling platform
  if (level == 1) {
    for (let i = 0; i < 4; i++) {
      if (player.collides(falling[i])) {
        falling[i].collider = "dynamic";
      }
    }
  } else if ( level == 2) {
    if (player.collides(falling)) {
      falling.collider = "dynamic";
    }
  }

  // collision events
  if (player.overlapping(exit)) {
    let msg = "Woohoo! You made it to the end with " + score + " carrots!!";
    text(msg, width / 2, 90);
    textAlign(CENTER);
    console.log("That's the end! Thanks for playing.");
    player.ani = playerSuccess;
  } else if (player.collides(g5)) {
    lives -= 1;
    resetPlayer();
    console.log("Uh oh, you fell!");
  } else if (player.overlapped(exit)) {
    level+=1;
    console.log(level);
    levels();
  }

  // damage to health bar
  if (player.collides(bugs)) {
    lives -=1;
    player.ani = playerDamage;
  } else if (player.collides(spikes)) {
    lives -=1;
    player.ani = playerDamage;
  }

};

window.mouseClicked = () => {
  if (level == 0) {
    if (mouseX > 265 && mouseX < 493) { // menu to level 1
      if (mouseY > 390 && mouseY < 470) {
        level = 1;
        levels();
        console.log("You are now on the level " + level);
      }
    }
  } else if (level == -1) {
      if (mouseX > 265 && mouseX < 493) { // game over to menu
        if (mouseY > 325 && mouseY < 400) {
          level = 0;
          //levels();
          console.log("You are now on game menu.");
          console.log(level);
        }
      }
  }
};

function levels() {
  player.x = -750;
  player.y = 450;

  // level selector
  if (level == 1) { // begin level 1
    clearPrevLevel(); // clear previous level items

    lives = 3;
    score = 0;
    console.log("You're on level " + level);
   
    // lvl 1 barriers
    let wallTop = new walls.Sprite(400, 0);
    wallTop.rotation = 90;

    new walls.Sprite(-790, 250);
    new walls.Sprite(3800, 250);

    let g1 = new ground.Sprite(0, 500, 1550, 50);
    g1.img = "./assets/g1.png";
    let g2 = new ground.Sprite(1250, 500, 700, 50);
    g2.img = "./assets/g2.png";

    let g4 = new ground.Sprite(3500, 500, 2000, 50);
    g4.img = "./assets/g4.png";

    // lvl 1 stink bug
    let bug1 = new bugs.Sprite();
    bug1.x = 1000;
    bug1.y = 450;
    bugSequence();

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

    let exit1 = new exit.Sprite(3300, 275);
    player.overlaps(exit1);

  } else if (level == 2) {// close level 1, start level 2
    
    clearPrevLevel(); // remove all level 1 items

    // level 2 start
    console.log("You're on level " + level);
    score = 0;

    // lvl 2 barriers
    
    let wallTop = new walls.Sprite(400, -500);
    wallTop.rotation = 90;

    new walls.Sprite(-790, 250);
    new walls.Sprite(5250, 250);

    let g1 = new ground.Sprite(0, 500, 5600, 50);
    g1.img = "./assets/g6.png";
    let g2 = new ground.Sprite(4000, 500, 3000, 50);
    g2.img = "./assets/g7.png";

    // lvl 2 stink bugs
    let bug1 = new bugs.Sprite();
    bug1.x = 1250;
    bug1.y = 450;
    bugSequence();

    
    let bug2 = new bugs.Sprite();
    bug2.x = 1750;
    bug2.y = 450;

    // lvl 2 carrots
    let carrot1 = new carrots.Sprite();
    carrot1.x = 300;
    carrot1.y =  -125;

    let carrot2 = new carrots.Sprite();
    carrot2.x = 1535;
    carrot2.y = 425;

    let carrot3 = new carrots.Sprite();
    carrot3.x = 2677;
    carrot3.y = 100;

    let carrot4 = new carrots.Sprite();
    carrot4.x = 3000;
    carrot4.y = 300;

    let carrot5 = new carrots.Sprite();
    carrot5.x = 4400;
    carrot5.y = 10;

    player.overlaps(carrots, collect);

    // lvl 2 falling platforms
    fallplat = new falling.Sprite();
    fallplat.x = 4300;
    fallplat.y = 120;

    // lvl 2 spikes
    let spike1 = new spikes.Sprite();
    spike1.x = 2545;
    spike1.y = 385;
    let spike2 = new spikes.Sprite();
    spike2.x = 2810;
    spike2.y = 385;
    spike2.mirror.x = true;    

    // lvl 2 plat form tiles
    new Tiles(
      [
        "........................................",
        "........................................",
        "........................................",
        "....=...................................",
        "......===...............................",
        "........................................",
        "........................................",
        "..........=.............................",
        "...........==...........................",
        "........................................",
        "........................................",
        "..............==........................",
        "...................................=....",
        "........................................",
        "........................................",
        "........................................",
        "........................................",
        "......................==.........==.....",
        ".................=....==................",
        ".......=.........=....==........=.......",
        "...=...=.........=....==................",
        "...=...=.........=....==................",
      ],
      0,
      -150,
      platform.w + 4,
      platform.h + 4
    );

    let exit2 = new exit.Sprite(5000, 275);
    player.overlaps(exit2);
  } // end level 2
}

async function bugSequence() {
  bugs.mirror.x = true;
	await bugs.move(200);
  bugs.mirror.x = false;
	await bugs.move(-200);
	bugSequence();
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
  if (lives == 0) {
    level = -1;
    player.visible = false;
    console.log("Game Over. You ran out of lives! Refresh to restart.");
  }
}

function clearPrevLevel() { // removes all previous sprites and tiles to reset for new level
  platform.remove();        // without this function, previous tiles/sprites will overlap other levels
  bugs.remove();
  walls.remove();
  spikes.remove();
  carrots.remove();
  falling.remove();
  ground.remove();
}
