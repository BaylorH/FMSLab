let gameState = "Menu";
let posX;
let velX_player = 0;
let x;
let y;
let velX;
let velY;
let x2 = 600;
let y2 = 600;
let velX2;
let velY2;
var bricksX = [];
var bricksY = [];
var n = 0;
var rand = 0;
var rand2 = 0;
let wX = 300;
let wY = 320;
let wVelX = 0;
let wVelY = 0;
let color = 0;
let totalScore = 0;
let base = true;
let spellMaster = false;
let dungeonsMaster = false;
let breakerMaster = false;
let spellMasterUnlocked = false;
let breakerMasterUnlocked = false;
let dungeonsMasterUnlocked = false;
var cols, rows;
var w = 40;
var grid = [];
var available = [];
var current;
var cursorX = 0;
var cursorY = 0;
var selected;
var sets = [];
var wallsRemoved = 0;
var p1;
var points = 0;
var playerLevel = 1;
var pointCheck;
var pressed = false;

function preload() {
  img = loadImage("Assets/HomePage.jpeg");
  img2 = loadImage("Assets/Home.webp");
  img3 = loadImage("Assets/Wizard-PNG-File.png");
  img4 = loadImage("Assets/SpellMaster.png");
  img5 = loadImage("Assets/DungeonsMaster.png");
  img6 = loadImage("Assets/Knight.png");
  img7 = loadImage("Assets/Check.png");
  img8 = loadImage("Assets/Display.png");
  img9 = loadImage("Assets/pngfind.com-padlock-png-2040208.png");
  
  trackMenu = loadSound("Assets/Rejoicing.mp3");
  trackSpells = loadSound("Assets/60SECONDS2019-10-23_-_Morning_Magic_-_FesliyanStudios.com_-_David_Renda.mp3");  
  trackMaze = loadSound("Assets/Fireside-Tales-MP3.mp3");
  trackBreaker = loadSound("Assets/Battle.mp3");
  
  soundFX1 = loadSound("Assets/Arcade-8-bit-level-up-670.wav");
  soundFX2 = loadSound("Assets/Arcade-8-bit-shot-672.wav")
  soundFX3 = loadSound("Assets/Game-coin-collect-620.wav")
}

function setup() {
  createCanvas(600, 400);
  
  //sets up grid for Dungeons
  cols = floor((width-1) / w);
  rows = floor(height / (w + 2));

  for (var j = 0; j < rows; j++) {
    for (var i = 0; i < cols; i++) {
      var cell = new Cell(i, j);
      grid.push(cell);
      sets.push([cell.id]);
    }
  }
  available = grid;
  current = grid[int(random(0, rows * cols))];
  
  trackMenu.loop();
  trackMaze.loop();
  trackSpells.loop();
  trackBreaker.loop();
  
  trackMenu.stop();
  trackMaze.stop();
  trackSpells.stop();
  trackBreaker.stop();
}

function reset() {
  //creates new maze when player reaches end of maze
  soundFX3.play()
  grid = [];
  cursorX = 0;
  cursorY = 0;
  sets = [];
  wallsRemoved = 0;
  for (var j = 0; j < rows; j++) {
    for (var i = 0; i < cols; i++) {
      var cell = new Cell(i, j);
      grid.push(cell);
      sets.push([cell.id]);
    }
  }
  available = grid;
  current = grid[int(random(0, rows * cols))];
}

function draw() {
  //levels up player
  if (points >= 1000) {
    soundFX1.play();
    playerLevel++;
    points = 0;
  }
  
  //checking game state in order call neccessary methods
  if (gameState == "Menu") {
    drawMenu();
  } else if (gameState == "Home") {
    drawHome();
    drawWizard();
    
    //draws live clock on top of screen
    let s = second();
    let m = minute();
    let min = "";
    if (m < 10) min = "0" + m;
    else min = "" + m;
    let h = hour();
    noStroke();
    fill(0);
    if (s < 10) {
      if (h != 12) {
        text((h % 12) + ":" + min + ":0" + s + "pm", 490, 27);
      } else {
        text(h + ":" + min + ":0" + s + "am", 490, 27);
      }
    } else {
      if (h > 12) {
        text((h % 12) + ":" + min + ":" + s + "pm", 490, 27);
      } else {
        text(h + ":" + min + ":" + s + "am", 490, 27);
      }
    }
    
  } else if (gameState == "Dungeons") {
    drawDungeons();
  } else if (gameState == "Breaker") {
    drawBreaker();
  } else if (gameState == "Spells") {
    noLoop();
    drawSpells();
  } else if (gameState == "BreakerGameOver") {
    drawBreakerGameOver();
    
    //clock code isn't put into a method because the location is in a different place each time it is called
    let s = second();
    let m = minute();
    let min = "";
    if (m < 10) min = "0" + m;
    else min = "" + m;
    let h = hour();
    noStroke();
    if (s < 10) {
      if (h != 12) {
        text((h % 12) + ":" + min + ":0" + s + "pm", 15, 20);
      } else {
        text(h + ":" + min + ":0" + s + "am", 15, 20);
      }
    } else {
      if (h > 12) {
        text((h % 12) + ":" + min + ":" + s + "pm", 15, 20);
      } else {
        text(h + ":" + min + ":" + s + "am", 15, 20);
      }
    }
    
  } else if (gameState == "Skins") {
    drawSkins();
    
    //draws clock
    let s = second();
    let m = minute();
    let min = "";
    if (m < 10) min = "0" + m;
    else min = "" + m;
    let h = hour();
    noStroke();
    if (s < 10) {
      if (h != 12) {
        text((h % 12) + ":" + min + ":0" + s + "pm", 15, 20);
      } else {
        text(h + ":" + min + ":0" + s + "am", 15, 20);
      }
    } else {
      if (h > 12) {
        text((h % 12) + ":" + min + ":" + s + "pm", 15, 20);
      } else {
        text(h + ":" + min + ":" + s + "am", 15, 20);
      }
    }
  } else if (gameState == "SpellsGameOver") {
    drawSpellsGameOver();
  }
}

function mousePressed() {
  if (gameState == "Menu") {
    if (mouseX >= 225 && mouseX <= 325 && mouseY >= 130 && mouseY <= 180) {
      gameState = "Home";
      trackMenu.play();
      
    }
  } else if (gameState == "BreakerGameOver") {
    if (mouseX >= 225 && mouseX <= 325 && mouseY >= 140 && mouseY <= 190) {
      //player presses home button
      gameState = "Home";
      trackBreaker.stop();
      trackMenu.play();
    } else if (
      mouseX >= 205 &&
      mouseX <= 355 &&
      mouseY >= 230 &&
      mouseY <= 280
    ) {
      //player presses play again button
      releaseBall();
      LIVES = 3;
      level = 1;
      score = 0;
      setUpBricks();
      gameState = "Breaker";
    }
  } else if (gameState == "Home") {
  } else if (gameState == "SpellsGameOver") {
    if (mouseX >= 225 && mouseX <= 325 && mouseY >= 140 && mouseY <= 190) {
      //player presses home button
      gameState = "Home";
      trackSpells.stop();
      trackMenu.play();
    } else if (
      mouseX >= 205 &&
      mouseX <= 355 &&
      mouseY >= 230 &&
      mouseY <= 280
    ) {
      //player presses play again button
      wX = 300;
      wY = 320;
      wVelX = 0;
      wVelY = 0;
      background(153, 51, 0);
      drawLetters();
      gameState = "Spells";
    }
  } else if (gameState == "Spells") {
      
    if (mouseX >= 540 && mouseX <= 590 && mouseY >= 10 && mouseY <= 60) {
      //player presses play again button
      gameState = "Home";
      trackSpells.stop();
      trackMenu.play();
      
      //seed 0 is the letter A, seed 1 is the letter B, etc.
    } else if (spellSeed == 0) {
      if (mouseX >= 255 && mouseX <= 265 && mouseY >= 240 && mouseY <= 250) {
        //once the red box is pressed, the mouse begins to draw
        pressed = true;
        coinColl = 1;
      }
    } else if (spellSeed == 1) {
      if (mouseX >= 263 && mouseX <= 273 && mouseY >= 240 && mouseY <= 250) {
        pressed = true;
        coinColl = 1;
      }
    } else if (spellSeed == 2) {
      if (mouseX >= 356 && mouseX <= 366 && mouseY >= 147 && mouseY <= 157) {
        pressed = true;
        coinColl = 1;
      }
    } else if (spellSeed == 3) {
      if (mouseX >= 264 && mouseX <= 274 && mouseY >= 240 && mouseY <= 250) {
        pressed = true;
        coinColl = 1;
      }
    } else if (spellSeed == 4) {
      if (mouseX >= 264 && mouseX <= 274 && mouseY >= 121 && mouseY <= 131) {
        pressed = true;
        coinColl = 1;
      }
    } else if (spellSeed == 5) {
      if (mouseX >= 265 && mouseX <= 275 && mouseY >= 121 && mouseY <= 131) {
        pressed = true;
        coinColl = 1;
      }
    } else if (spellSeed == 6) {
      if (mouseX >= 361 && mouseX <= 371 && mouseY >= 147 && mouseY <= 157) {
        pressed = true;
        coinColl = 1;
      }
    } else if (spellSeed == 7) {
      if (mouseX >= 264 && mouseX <= 274 && mouseY >= 121 && mouseY <= 131) {
        pressed = true;
        coinColl = 1;
      }
    } else if (spellSeed == 8) {
      if (mouseX >= 270 && mouseX <= 280 && mouseY >= 121 && mouseY <= 131) {
        pressed = true;
        coinColl = 1;
      }
    } else if (spellSeed == 9) {
      if (mouseX >= 312 && mouseX <= 322 && mouseY >= 121 && mouseY <= 131) {
        pressed = true;
        coinColl = 1;
      }
    }
  } else if (gameState == "Dungeons") {
    if (mouseX >= 540 && mouseX <= 590 && mouseY >= 10 && mouseY <= 60) {
      //player presses home button
      gameState = "Home";
      trackMaze.stop();
      trackMenu.play();
    }
  } else if (gameState == "Breaker") {
    if (mouseX >= 540 && mouseX <= 590 && mouseY >= 10 && mouseY <= 60) {
      //player presses home button
      gameState = "Home";
      trackMenu.play();
      trackBreaker.stop();
    }
  } else if (gameState == "Skins") {
    if (mouseX >= 540 && mouseX <= 590 && mouseY >= 10 && mouseY <= 60) {
      //player presses home button
      gameState = "Home";
    }
    if (mouseX >= 35 && mouseX <= 155 && mouseY >= 135 && mouseY <= 295) {
      //base (AKA default skin) is pressed in skin shop
      if (base == false) {
        base = true;
        dungeonsMaster = false;
        breakerMaster = false;
        spellMaster = false;
      } else {
        base = true;
        dungeonsMaster = false;
        breakerMaster = false;
        spellMaster = false;
      }
    }
    if (mouseX >= 185 && mouseX <= 305 && mouseY >= 135 && mouseY <= 295) {
      //Spells master skin is pressed in skin shop
      if (spellMasterUnlocked == true) {
        if (spellMaster == false) {
          spellMaster = true;
          dungeonsMaster = false;
          breakerMaster = false;
          base = false;
        } else {
          spellMaster = false;
          dungeonsMaster = false;
          breakerMaster = false;
          base = true;
        }
      }
    }
    if (mouseX >= 440 && mouseX <= 540 && mouseY >= 135 && mouseY <= 295) {
      //Dungeons master skin is pressed in skin shop
      if (dungeonsMasterUnlocked == true) {
        if (dungeonsMaster == false) {
          dungeonsMaster = true;
          spellMaster = false;
          breakerMaster = false;
          base = false;
        } else {
          dungeonsMaster = false;
          spellMaster = false;
          breakerMaster = false;
          base = true;
        }
      }
    }
    if (mouseX >= 300 && mouseX <= 420 && mouseY >= 135 && mouseY <= 295) {
      //Breaker master skin is pressed in skin shop
      if (breakerMasterUnlocked == true) {
        if (breakerMaster == false) {
          breakerMaster = true;
          spellMaster = false;
          dungeonsMaster = false;
          base = false;
        } else {
          breakerMaster = false;
          spellMaster = false;
          dungeonsMaster = false;
          base = true;
        }
      }
    }
  }
}

function keyPressed() {
  if (gameState == "Breaker") {
    //controls paddle in breaker
    if (keyCode === LEFT_ARROW) {
      velX_player = -4;
    } else if (keyCode === RIGHT_ARROW) {
      velX_player = 4;
    }
  }
  if (gameState == "Home") {
    //controls wizard on home screen
    if (keyCode === LEFT_ARROW) {
      wVelX = -2;
    } else if (keyCode === RIGHT_ARROW) {
      wVelX = 2;
    } else if (keyCode === UP_ARROW) {
      wVelY = -2;
    } else if (keyCode === DOWN_ARROW) {
      wVelY = 2;
    }
  }
  if (gameState == "Dungeons") {
    //controls wizard in the maze
    if (key == "R" || key == "r") {
      cursorX = 0;
      cursorY = 0;
    } else if (keyCode == UP_ARROW && cursorY > 0) {
      if (!selected.walls[0]) {
        cursorY--;
      }
    } else if (keyCode == LEFT_ARROW && cursorX > 0) {
      if (!selected.walls[3]) {
        cursorX--;
      }
    } else if (keyCode == DOWN_ARROW && cursorY < rows - 1) {
      if (!selected.walls[2]) {
        cursorY++;
      }
    } else if (keyCode == RIGHT_ARROW && cursorX < cols - 1) {
      if (!selected.walls[1]) {
        cursorX++;
      }
    }
  }
}

function keyReleased() {
  if (gameState == "Breaker") {
    //controls paddle in breaker
    if (keyCode === LEFT_ARROW) {
      if (velX_player == -4) {
        velX_player = 0;
      }
    } else if (keyCode === RIGHT_ARROW) {
      if (velX_player == 4) {
        velX_player = 0;
      }
    }
  }
  if (gameState == "Home") {
    //controls wizard on home screen
    if (keyCode === LEFT_ARROW) {
      if (wVelX == -2) {
        wVelX = 0;
      }
    } else if (keyCode === RIGHT_ARROW) {
      if (wVelX == 2) {
        wVelX = 0;
      }
    } else if (keyCode === UP_ARROW) {
      if (wVelY == -2) {
        wVelY = 0;
      }
    } else if (keyCode === DOWN_ARROW) {
      if (wVelY == 2) {
        wVelY = 0;
      }
    }
  }
}

function drawMenu() {
  //welcome screen
  background(img);
  fill(400);
  textSize(60);
  strokeWeight(4);
  stroke(51);
  textWrap(WORD);
  text("Welcome!", 160, 25, 100);

  //draws clock
  textSize(10);
  let s = second();
  let m = minute();
  let min = "";
  if (m < 10) min = "0" + m;
  else min = "" + m;
  let h = hour();
  noStroke();
  if (s < 10) {
    if (h != 12) {
      text((h % 12) + ":" + min + ":0" + s + "pm", 15, 20);
    } else {
      text(h + ":" + min + ":0" + s + "am", 15, 20);
    }
  } else {
    if (h > 12) {
      text((h % 12) + ":" + min + ":" + s + "pm", 15, 20);
    } else {
      text(h + ":" + min + ":" + s + "am", 15, 20);
    }
  }

  textSize(13);
  strokeWeight(2);
  stroke(51);
  text("-develop your FMS-", 215, 85, 200);
  
  //highlights buttons when hovered over
  if (225 < mouseX && 325 > mouseX && 130 < mouseY && 180 > mouseY) {
    fill(231, 255, 70);
  } else {
    fill(255, 255, 255);
  }
  rect(225, 130, 100, 50, 10);
  textSize(20);
  if (225 < mouseX && 325 > mouseX && 130 < mouseY && 180 > mouseY) {
    fill(255, 0, 0);
  } else {
    fill(51);
  }
  noStroke();
  text("Train", 250, 145, 100);
  textSize(13);
}

function drawHome() {
  
  //draws home screen
  noStroke();
  drawBack();
  drawHouses();
  fill(0);
  noStroke();
  text("level " + playerLevel + ":", 40, 30);
  strokeWeight(3);
  stroke(10);
  fill(125);
  rect(120, 17, 100, 13);
  noStroke();
  fill("green");
  rect(121, 18, (points % 1000) / 10, 11);
  fill('white');
  stroke(4)
  rect(245, 13, 220, 45,10);
  fill(0);
  noStroke();
  textSize(15);
  
  //instructions on home page
  text("Use Arrow Keys to Move", 275, 30);
  text("Walk Up to Door to Play Game", 255, 50);

}

function drawWizard() {
  //checks what skin is equipt
  if (spellMaster == true) {
    p1 = img4;
  } else if (dungeonsMaster == true) {
    p1 = img5;
  } else if (breakerMaster == true) {
    p1 = img6;
  } else {
    p1 = img3;
  }
  
  //draws corresponding skin as the player on the home screen
  image(p1, wX, wY, 60, 80);
  wX += wVelX;
  wY += wVelY;

  //keeps player in bounds on home screen
  if (wY < 260) {
    wY++;
    wVelY = 0;
  }
  if (wY > 330) {
    wY--;
    wVelY = 0;
  }
  if (wX < 20) {
    wX++;
    wVelX = 0;
  }
  if (wX > 550) {
    wX--;
    wVelX = 0;
  }
}

function drawBack() {
  background(img2);
}

function drawHouses() {
  //draws houses on home screen
  fill(400);
  stroke(10);
  textSize(20);
  text("Skins", 95, 243, 100);
  text("Spells", 215, 185, 100);
  text("Dungeons", 330, 210, 100);
  text("Breaker", 445, 250, 100);

  //changes gamestate when player enters the corresponding house
  if (wY < 265) {
    if (wX >= 10 && wX <= 35) {
      gameState = "Skins";
      
      //resets the wizard on the home page
      wX = 300;
      wY = 320;
      wVelX = 0;
      wVelY = 0;
    } else if (wX >= 200 && wX <= 225) {
      gameState = "Spells";
      trackMenu.stop();
      trackSpells.play();
      
      wX = 300;
      wY = 320;
      wVelX = 0;
      wVelY = 0;
      background(153, 51, 0);
      drawLetters();
    } else if (wX >= 305 && wX <= 330) {
      gameState = "Dungeons";
      trackMenu.stop();
      trackMaze.play();
      wX = 300;
      wY = 320;
      wVelX = 0;
      wVelY = 0;
    } else if (wX >= 430 && wX <= 455) {
      wX = 300;
      wY = 320;
      wVelX = 0;
      wVelY = 0;

      releaseBall();
      LIVES = 3;
      level = 1;
      score = 0;
      setUpBricks();
      gameState = "Breaker";
      trackMenu.stop();
      trackBreaker.play();
    }
  }
}

function drawSkins() {
  background(img8);
  
  //draws home button
  fill(0);
  noStroke();
  rect(540, 10, 50, 50);
  textSize(20);
  fill(400);
  rect(555, 30, 20, 20);
  triangle(550, 30, 565, 15, 580, 30);
  fill(0);
  rect(565, 40, 5, 10);
  
  //unlocks the master skins when the corresponding level is unlocked
  if (playerLevel >= 20) {
    spellMasterUnlocked = true;
  }
  if (playerLevel >= 40) {
    breakerMasterUnlocked = true;
  }
  if (playerLevel >= 60) {
    dungeonsMasterUnlocked = true;
  }

  fill(400);
  textSize(30);
  strokeWeight(4);
  stroke(51);
  textWrap(WORD);
  text("Level up to unlock skins", 145, 20, 400);
  textSize(12);
  noStroke();
  image(img3, 35, 135, 120, 160);
  if (base == true) {
    image(img7, 55, 135, 120, 160);
  }
  if (spellMasterUnlocked == false) {
    text("Unlocked at level 20", 185, 100, 150);
  }
  image(img4, 185, 135, 120, 160);
  if (spellMaster == true) {
    image(img7, 185, 135, 120, 160);
  }
  if (spellMasterUnlocked == false) {
    image(img9, 205, 185, 60, 80);
  }
  if (breakerMasterUnlocked == false) {
    text("Unlocked at level 40", 315, 100, 150);
  }
  image(img6, 300, 135, 120, 160);
  if (breakerMaster == true) {
    image(img7, 300, 135, 120, 160);
  }
  if (breakerMasterUnlocked == false) {
    image(img9, 345, 185, 60, 80);
  }
  if (dungeonsMasterUnlocked == false) {
    text("Unlocked at level 60", 440, 100, 150);
  }
  image(img5, 450, 145, 120, 160);
  if (dungeonsMaster == true) {
    image(img7, 450, 145, 120, 160);
  }
  if (dungeonsMasterUnlocked == false) {
    image(img9, 470, 185, 60, 80);
  }
}

function drawSpells() {
  loop();
  noStroke();
  fill(153, 51, 0);
  rect(0, 0, 600, 100);
  fill(0);
  rect(540, 10, 50, 50);
  textSize(20);
  fill(400);
  rect(555, 30, 20, 20);
  triangle(550, 30, 565, 15, 580, 30);
  fill(0);
  rect(565, 40, 5, 10);
  
  let radius = 7;

  noStroke();
  if (pressed == true) {
    const color = get(mouseX+radius, mouseY);
    const color2 = get(mouseX-radius, mouseY);
    const color3 = get(mouseX, mouseY+radius);
    const color4 = get(mouseX, mouseY-radius);
    if ((color[0] == 153 && color[1] == 51 && color[2] == 0) || (color2[0] == 153 && color2[1] == 51 && color2[2] == 0) || (color3[0] == 153 && color3[1] == 51 && color3[2] == 0) || (color4[0] == 153 && color4[1] == 51 && color4[2] == 0)) {
      gameState = "SpellsGameOver";
      pressed = false;
    }
    
    let offset = 5;
    
    if(spellSeed == 0) {
      if(coinColl == 1){
      if (mouseX+offset > 308 && mouseX-offset < 318 && mouseY+offset > 130 && mouseY-offset < 140) {
        soundFX3.play()
        points+=50;
        coinColl = 2;
        noStroke();
        fill(400);
        circle(308,130,10);
      }
      }
      if(coinColl == 2){
        if (mouseX+offset > 360 && mouseX-offset < 370 && mouseY+offset > 245 && mouseY-offset < 255) {
          soundFX3.play()
          points+=50;
          coinColl = 3;
          noStroke();
          fill(400);
          circle(360,245,10);
        }
      }
      if(coinColl == 3) {
        if(mouseX+offset > 308 && mouseX-offset < 318 && mouseY+offset > 205 && mouseY-offset < 215) {
          soundFX3.play()
          points+=50;
          coinColl = 4;
          noStroke();
          fill(400);
          circle(308, 205, 10);
        }
      }
       if(coinColl == 4) {
         if(mouseX+offset > 265 && mouseX-offset < 275 && mouseY+offset > 205 && mouseY-offset < 215) {
           soundFX3.play()
           points+=100;
            pressed = false;
            background(153, 51, 0);
            drawLetters();
         }
     
     }
    
      noStroke();
      fill(255, 213, 0);
      if(coinColl == 1){
        circle(308, 130, 10);
      }
      if(coinColl == 2){
        circle(360, 245, 10);
      }
      if(coinColl == 3) {
        circle(308, 205, 10);
      }
      if(coinColl == 4) {
        noFill();
        fill("green");
        rect(265, 205, 10, 10);
      }
    }
    
    if(spellSeed == 1) {
      if(coinColl == 1) {
        if(mouseX+offset > 270 && mouseX-offset < 280 && mouseY+offset > 126 && mouseY-offset < 136) {
          soundFX3.play()
          points+=50;
          coinColl = 2;
          noStroke();
          fill(400);
          circle(270, 126, 10);
        }
      }
      if(coinColl == 2) {
        if(mouseX+offset > 345 && mouseX-offset < 355 && mouseY+offset > 150 && mouseY-offset < 160) {
          soundFX3.play()
          points+=50;
          coinColl = 3;
          noStroke();
          fill(400);
          circle(345,150,10);
        }
      }
      if(coinColl == 3) {
        if(mouseX+offset > 270 && mouseX-offset < 280 && mouseY+offset > 180 && mouseY-offset < 190) {
          soundFX3.play()
          points+=50;
          coinColl = 4;
          noStroke();
          fill(400);
          circle(270,180,10);
        }
      }
      if(coinColl == 4) {
        if(mouseX+offset > 350 && mouseX-offset < 360 && mouseY+offset > 210 && mouseY-offset < 220) {
          soundFX3.play()
          points+=50;
          coinColl = 5;
          noStroke();
          fill(400);
          circle(350, 210, 10);
        }
      }
      if(coinColl == 5) {
        if(mouseX+offset > 273 && mouseX-offset < 283 && mouseY+offset > 240 && mouseY-offset < 250) {
          soundFX3.play()
          points+=100;
          pressed = false;
          background(153, 51, 0);
          drawLetters();
        } 
      }
      
      noStroke();
      fill(255, 213, 0);
      if(coinColl == 1) {
        circle(270, 126, 10);
      }
      if(coinColl == 2) {
        circle(345, 150, 10);
      }
      if(coinColl == 3) {
        circle(270, 180, 10);
      }
      if(coinColl == 4) {
        circle(350, 210, 10);
      }
      if(coinColl == 5) {
        noFill();
        fill('green');
        rect(273, 240, 10, 10);
      }
    }
    if (spellSeed == 2) {
      if(coinColl == 1) {
        noStroke();
        fill("green");
        rect(356, 207, 10, 10);
        if(mouseX+offset > 356 && mouseX-offset < 366 && mouseY+offset > 207 && mouseY-offset < 217) {
          soundFX3.play()
          points+=100;
          pressed = false;
          background(153,51,0);
          drawLetters();
        }
      }
    }
    if(spellSeed == 3) {
      if(coinColl == 1) {
        if(mouseX+offset > 270 && mouseX-offset < 280 && mouseY+offset > 126 && mouseY-offset < 136) {
          soundFX3.play()
          points+=50;
          coinColl = 2;
          noStroke();
          fill(400);
          circle(270, 126, 10);
        }
      }
      if(coinColl == 2) {
        if(mouseX+offset > 360 && mouseX-offset < 370 && mouseY+offset > 180 && mouseY-offset < 190) {
          soundFX3.play()
          points+=50;
          coinColl = 3;
          noStroke();
          fill(400);
          circle(360, 180, 10);
        }
      }
      if(coinColl == 3) {
        if(mouseX+offset > 274 && mouseX-offset < 284 && mouseY+offset > 240 && mouseY-offset < 250) {
          soundFX3.play()
          points+=100;
          pressed = false;
          background(153, 51, 0);
          drawLetters();
        }
      }
      
      fill(255, 213, 0);
      if(coinColl == 1) {
        circle(270, 126, 10);
      }
      if(coinColl == 2) {
        circle(360, 180, 10);
      }
      if(coinColl == 3) {
        noFill();
        fill('green');
        rect(274, 240, 10, 10);
      }
    }
    if (spellSeed == 4) {
      if(coinColl == 1) {
        if(mouseX+offset > 350 && mouseX-offset < 360 && mouseY+offset > 128 && mouseY-offset < 138) {
          soundFX3.play()
          points+=50;
          coinColl = 2;
          noStroke();
          fill(400);
          circle(350, 128, 10);
        }
      }
      if(coinColl == 2) {
        if(mouseX+offset > 345 && mouseX-offset < 355 && mouseY+offset > 185 && mouseY-offset < 195) {
          soundFX3.play()
          points+=50;
          coinColl = 3;
          noStroke();
          fill(400);
          circle(345, 185, 10);
        }
      }
      if(coinColl == 3) {
        if(mouseX+offset-offset > 353 && mouseX-offset < 363 &&+mouseY-offset > 240 && mouseY-offset < 250) {
          soundFX3.play()
          points+=100;
          pressed = false;
          background(153, 51, 0);
          drawLetters();
        }
      }
      
      fill(255, 213, 0);
      if(coinColl == 1) {
        circle(350, 128, 10);
      }
      if(coinColl == 2) {
        circle(345, 185, 10);
      }
      if(coinColl == 3) {
        noFill();
        fill("green");
        rect(353, 240, 10, 10);
      }
    }
    if (spellSeed == 5) {
      if(coinColl == 1) {
        if(mouseX+offset > 345 && mouseX-offset < 355 && mouseY+offset > 128 && mouseY-offset < 138) {
          soundFX3.play()
          points+=50;
          coinColl = 2;
          noStroke();
          fill(400);
          circle(345, 128, 10);
        }
      }
      if(coinColl == 2) {
        if(mouseX+offset > 335 && mouseX-offset < 345 && mouseY+offset > 185 && mouseY-offset < 195) {
          soundFX3.play()
          points+=50;
          coinColl = 3;
          noStroke();
          fill(400);
          circle(335, 185, 10);
        }
      }
      if(coinColl == 3) {
        if(mouseX+offset > 265 && mouseX-offset < 275 && mouseY+offset > 240 && mouseY-offset < 250) {
          soundFX3.play()
          points+=100;
          pressed = false;
          background(153, 51, 0);
          drawLetters();
        }
      }
      
      fill(255, 213, 0);
      if(coinColl == 1) {
        circle(345, 128, 10);
      }
      if(coinColl == 2) {
        circle(335, 185, 10);
      }
      if(coinColl == 3) {
        noFill();
        fill("green");
        rect(265, 240, 10, 10);
      }
    }
    if (spellSeed == 6) {
      if(coinColl == 1) {
        noStroke();
        fill("green");
        rect(326, 187, 10, 10);
        if(mouseX+offset > 326 && mouseX-offset < 336 && mouseY+offset > 187 && mouseY-offset < 197) {
          soundFX3.play()
          points+=100;
          pressed = false;
          background(153, 51, 0);
          drawLetters();
        }
      }
    }
    if (spellSeed == 7) {
      fill(255, 213, 0);
      if(coinColl == 1) {
        circle(273, 244, 10);
        if(mouseX+offset > 273 && mouseX-offset < 283 && mouseY+offset > 244 && mouseY-offset < 254) {
          soundFX3.play()
          points+=50;
          coinColl = 2;
          noStroke();
          fill(400);
          circle(273, 244, 10);
        }
      }
      if(coinColl == 2) {
        circle(357, 127, 10);
        if(mouseX+offset > 357 && mouseX-offset < 367 && mouseY+offset > 127 && mouseY-offset < 137) {
          soundFX3.play()
          points+=50;
          coinColl = 3;
          noStroke();
          fill(400);
          circle(357, 127, 10);
        }
      }
      if(coinColl == 3) {
        noStroke();
        fill("green");
        rect(352, 240, 10, 10);
        if(mouseX+offset > 352 && mouseX-offset < 362 && mouseY+offset > 240 && mouseY-offset < 250) {
          soundFX3.play()
          points+=100;
          pressed = false;
          background(153, 51, 0);
          drawLetters();
        }
      }
    }
    if (spellSeed == 8) {
      if(coinColl == 1) {
        noStroke();
        fill("green");
        rect(270, 241, 10, 10);
        if(mouseX+offset > 270 && mouseX-offset < 280 && mouseY+offset > 241 && mouseY-offset < 251) {
          soundFX3.play()
          points+=100;
          pressed = false;
          background(153, 51, 0);
          drawLetters();
        }
      }
    }
    if (spellSeed == 9) {
      if(coinColl == 1) {
        noStroke();
        fill("green");
        rect(259, 216, 10, 10);
        if(mouseX+offset > 259 && mouseX-offset < 269 && mouseY+offset > 216 && mouseY-offset < 226) {
          soundFX3.play()
          points+=100;
          pressed = false;
          background(153, 51, 0);
          drawLetters();
        }
      }
    }

    fill(0);
    circle(mouseX, mouseY, radius);
  }
  
  //draws level bar
  fill(400);
  noStroke();
  text("level " + playerLevel + ":", 40, 30);
  strokeWeight(3);
  stroke(10);
  fill(125);
  rect(120, 17, 100, 13);
  noStroke();
  fill("green");
  rect(121, 18, (points % 1000) / 10, 11);
  
  //debugs something that was being drawn
  noStroke();
  fill(153, 51, 0);
  rect(0, 300, 600, 100);
}

function drawSpellsGameOver() {
  background("red");
  fill(400);
  textSize(60);
  strokeWeight(3);
  stroke(51);
  textWrap(WORD);
  text("GAMEOVER", 125, 45, 100);
  fill(0);
  stroke(51);

  if (225 < mouseX && 325 > mouseX && 140 < mouseY && 190 > mouseY) {
    fill(231, 255, 70);
  } else {
    fill(255, 255, 255);
  }
  rect(225, 140, 100, 50, 10);
  textSize(20);
  if (225 < mouseX && 325 > mouseX && 140 < mouseY && 190 > mouseY) {
    fill(255, 0, 0);
  } else {
    fill(51);
  }
  noStroke();
  text("Home", 250, 155, 100);
  textSize(13);

  if (205 < mouseX && 355 > mouseX && 230 < mouseY && 280 > mouseY) {
    fill(231, 255, 70);
  } else {
    fill(255, 255, 255);
  }
  strokeWeight(3);
  stroke(51);
  rect(205, 230, 150, 50, 10);
  textSize(20);
  if (205 < mouseX && 355 > mouseX && 230 < mouseY && 280 > mouseY) {
    fill(255, 0, 0);
  } else {
    fill(51);
  }
  noStroke();
  text("Play again", 230, 245, 100);
  textSize(13);
}

function drawLetters() {
  coinColl = 0;
  let seeds = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  //spellSeed = random(seeds);
  spellSeed = random(seeds);

  fill(400);
  if (spellSeed == 0) {
    strokeWeight(10);
    stroke(0);
    textSize(180);
    text("A", 250, 250);
    noStroke();
    fill("red");
    rect(255, 240, 10, 10);
  } else if (spellSeed == 1) {
    strokeWeight(10);
    stroke(0);
    textSize(180);
    text("B", 250, 250);
    noStroke();
    fill("red");
    rect(263, 240, 10, 10);
  } else if (spellSeed == 2) {
    strokeWeight(10);
    stroke(0);
    textSize(180);
    text("C", 250, 250);
    noStroke();
    fill("red");
    rect(356, 147, 10, 10);
  } else if (spellSeed == 3) {
    strokeWeight(10);
    stroke(0);
    textSize(180);
    text("D", 250, 250);
    noStroke();
    fill("red");
    rect(264, 240, 10, 10);
  } else if (spellSeed == 4) {
    strokeWeight(10);
    stroke(0);
    textSize(180);
    text("E", 250, 250);
    noStroke();
    fill("red");
    rect(264, 121, 10, 10);
  } else if (spellSeed == 5) {
    strokeWeight(10);
    stroke(0);
    textSize(180);
    text("F", 250, 250);
    noStroke();
    fill("red");
    rect(265, 121, 10, 10);
  } else if (spellSeed == 6) {
    strokeWeight(10);
    stroke(0);
    textSize(180);
    text("G", 250, 250);
    noStroke();
    fill("red");
    rect(361, 147, 10, 10);
  } else if (spellSeed == 7) {
    strokeWeight(10);
    stroke(0);
    textSize(180);
    text("H", 250, 250);
    noStroke();
    fill("red");
    rect(264, 121, 10, 10);
  } else if (spellSeed == 8) {
    strokeWeight(10);
    stroke(0);
    textSize(180);
    text("I", 250, 250);
    noStroke();
    fill("red");
    rect(270, 121, 10, 10);
  } else if (spellSeed == 9) {
    strokeWeight(10);
    stroke(0);
    textSize(180);
    text("J", 250, 250);
    noStroke();
    fill("red");
    rect(312, 121, 10, 10);
  }
}

function drawDungeons() {
  background(51);

  for (var i = 0; i < grid.length; i++) {
    grid[i].show();
  }

  if (wallsRemoved < cols * rows - 1) {
    if (!current.isFinished) {
      current.highlight();
      // CHOOSE RANDOM NEIGHBOR
      var neighbor = current.randomNeighbor();
      var mergedSet, removedSet, removedIndex;
      if (neighbor) {
        // FIND THE SETS THAT CURRENT AND NEIGHBOR ARE IN
        for (var i = 0; i < sets.length; i++) {
          if (sets[i].includes(current.id)) {
            mergedSet = sets[i];
          } else if (sets[i].includes(neighbor.id)) {
            removedSet = sets[i];
            removedIndex = i;
          }
        }
        // ADD NEIGHBOR TO CURRENT SET (UNION THE CELLS) AND DELETE NEIGHBOR'S SET
        if (removedSet !== undefined) {
          for (var i = 0; i < removedSet.length; i++) {
            mergedSet.push(removedSet[i]);
          }
          sets.splice(removedIndex, 1);
          // REMOVE WALLS FROM BETWEEN CURRENT AND NEIGHBOR
          removeWalls(current, neighbor);
        }
      } else if (sets.length > 1) {
        current.isFinished = true;
        available = available.filter((cell) => cell.id !== current.id);
      }
    }
    // GET NEW CURRENT (RANDOM)
    current = available[int(random(0, available.length))];
  } else {
    selected = grid.filter(
      (cell) => cell.i === cursorX && cell.j === cursorY
    )[0];
    selected.highlight();
    grid[grid.length - 1].highlight(true);
    if (grid[grid.length - 1].id === selected.id) reset();
  }

  // cell.i == x coord
  //cell.j == y coord
  
  fill(0);
  noStroke();
  rect(540, 10, 50, 50);
  textSize(20);
  fill(400);
  rect(555, 30, 20, 20);
  triangle(550, 30, 565, 15, 580, 30);
  fill(0);
  rect(565, 40, 5, 10);
  
  //draws level bar
  let inc = 355;
  fill(400);
  noStroke();
  text("level " + playerLevel + ":", 40, 30+inc);
  strokeWeight(3);
  stroke(10);
  fill(125);
  rect(120, 17+inc, 100, 13);
  noStroke();
  fill("green");
  rect(121, 18+inc, (points % 1000) / 10, 11);
}

function index(i, j) {
  if (i < 0 || j < 0 || i > cols - 1 || j > rows - 1) {
    return -1;
  }
  return i + j * cols;
}

function removeWalls(a, b) {
  var x = a.i - b.i;
  if (x === 1) {
    a.walls[3] = false;
    b.walls[1] = false;
  } else if (x === -1) {
    a.walls[1] = false;
    b.walls[3] = false;
  }
  var y = a.j - b.j;
  if (y === 1) {
    a.walls[0] = false;
    b.walls[2] = false;
  } else if (y === -1) {
    a.walls[2] = false;
    b.walls[0] = false;
  }
  wallsRemoved++;
  points+=4;
}

function Cell(i, j) {
  this.i = i;
  this.j = j;
  this.walls = [true, true, true, true];
  this.id = i * cols + (j + 1);
  this.isFinished = false; // TRUE IF ALL NEIGHBORS ARE IN SAME SET

  this.isUnioned = function (neighbor) {
    for (var i = 0; i < sets.length; i++) {
      if (sets[i].includes(this.id) && sets[i].includes(neighbor.id)) {
        return true;
      }
    }
    return false;
  };

  this.randomNeighbor = function () {
    var neighbors = [];

    var top = grid[index(i, j - 1)];
    var right = grid[index(i + 1, j)];
    var bottom = grid[index(i, j + 1)];
    var left = grid[index(i - 1, j)];

    if (this.walls[0] && top && !this.isUnioned(top)) {
      neighbors.push(top);
    }
    if (this.walls[1] && right && !this.isUnioned(right)) {
      neighbors.push(right);
    }
    if (this.walls[2] && bottom && !this.isUnionedbottom) {
      neighbors.push(bottom);
    }
    if (this.walls[3] && left && !this.isUnioned(left)) {
      neighbors.push(left);
    }

    if (neighbors.length > 0) {
      var r = floor(random(0, neighbors.length));
      return neighbors[r];
    } else {
      return undefined;
    }
  };
  this.highlight = function (isRed) {
    var x = this.i * w;
    var y = this.j * w;
    noStroke();
    isRed ? fill("red") : fill(0, 0, 255, 100);
    isRed ? rect(x + 2, y + 2, w - 4, w - 4) : image(p1, x, y, w, w);
  };

  this.show = function () {
    var x = this.i * w;
    var y = this.j * w;
    stroke(255);
    if (this.walls[0]) {
      line(x, y, x + w, y);
    }
    if (this.walls[1]) {
      line(x + w, y, x + w, y + w);
    }
    if (this.walls[2]) {
      line(x + w, y + w, x, y + w);
    }
    if (this.walls[3]) {
      line(x, y + w, x, y);
    }

    if (this.visited) {
      noStroke();
      fill(255, 0, 255, 100);
      rect(x, y, w, w);
    }
  };
}

function drawBreaker() {
  background(153, 51, 0);

  pointCheck = totalScore;

  if (spellMaster == true) {
    image(img4, 520, 350, 60, 80);
  } else if (dungeonsMaster == true) {
    image(img5, 520, 350, 60, 80);
  } else if (breakerMaster == true) {
    image(img6, 520, 350, 60, 80);
  } else {
    image(img3, 520, 350, 60, 80);
  }

  drawBricks();
  circle(x, y, 10);
  fill("blue");
  circle(x2, y2, 10);
  fill(0);
  noStroke();
  rect(540, 10, 50, 50);
  textSize(20);
  fill(400);
  rect(555, 30, 20, 20);
  triangle(550, 30, 565, 15, 580, 30);
  fill(0);
  rect(565, 40, 5, 10);
  stroke(200);
  fill(0);
  textSize(20);
  let spacer = 300;
  text("Level: " + level, 10, 10 + spacer, 100);
  text("Lives: " + LIVES, 10, 30 + spacer, 100);
  text("Score: " + score, 10, 50 + spacer, 200);

  posX += velX_player;
  x += velX;
  y += velY;
  fill(color);
  rect(posX, 330, 50, 10);

  //checks if paddle is in bounds
  if (posX < 0) {
    posX += 1;
    velX_player = 0;
  }
  if (posX > 550) {
    posX -= 1;
    velX_player = 0;
  }

  //check if ball is in bounds
  if (x > 590 || x < 5) {
    velX *= -1;
  }
  if (y < 5) {
    velY *= -1;
  }
  let r = 0;
  if (velX == 0) {
    while (r == 0) {
      r = round(random(2) - 1);
    }
    velX = r;
    r = 0;
  }
  if (x > posX && x < posX + 50) {
    if (y > 325 && y < 327) {
      if (x - posX > 30) {
        velX++;
      } else if (x - posX < 20) {
        velX--;
      }
      velY *= -1;
    }
  }
  if (y > 400) {
    loseLife();
  }
  if (LIVES < 1) {
    gameState = "BreakerGameOver";
  }
  if (totalScore >= 1000) {
    totalScore = 0;
    setUpBricks();
    level++;
    releaseBall();
    x2 = 600;
    y2 = 600;
    velX2 = 0;
    velY2 = 0;
  }

  x2 += velX2;
  y2 += velY2;

  //checks if second ball is in bounds
  if (x2 > 590 || x2 < 5) {
    velX2 *= -1;
  }
  if (y2 < 5) {
    velY2 *= -1;
  }
  r = 0;
  if (velX2 == 0) {
    while (r == 0) {
      r = round(random(2) - 1);
    }
    velX2 = r;
    r = 0;
  }
  if (x2 > posX && x2 < posX + 50) {
    if (y2 > 325 && y2 < 328) {
      if (x2 - posX > 30) {
        velX2++;
      } else if (x2 - posX < 20) {
        velX2--;
      }
      velY2 *= -1;
    }
  }
  
  //draws level bar
  let inc = 355;
  let xInc = 80;
  fill(400);
  noStroke();
  text("level " + playerLevel + ":", 40+xInc, 30+inc);
  strokeWeight(3);
  stroke(10);
  fill(125);
  rect(120+xInc, 17+inc, 100, 13);
  noStroke();
  fill("green");
  rect(121+xInc, 18+inc, (points % 1000) / 10, 11);
}

function setUpBricks() {
  for (var i = 0; i < 10; i++) {
    for (var j = 5; j < 160; j += 15) {
      bricksX[n] = i * 60 + 5;
      bricksY[n] = j;
      n++;
    }
  }
  let r = round(random(n));
  rand = r;
  let r2 = round(random(n));
  rand2 = r2;
}

function drawBricks() {
  fill(400);
  noStroke();

  for (var i = 0; i < n; i++) {
    if (rand != i) {
      fill(400);
    }
    if (rand == i || i == rand2) {
      fill(120, 120, 120);
    }
    rect(bricksX[i], bricksY[i], 50, 10);
    if (rand == i) {
      fill(400);
      textSize(10);
      text("+LIFE+", bricksX[i] + 9, bricksY[i], 100);
    }
    if (i == rand2) {
      fill(400);
      textSize(10);
      text("+BALL+", bricksX[i] + 7, bricksY[i], 100);
    }
  }

  checkCollision();
}

function checkCollision() {
  for (var i = 0; i < n; i++) {
    if (x >= bricksX[i] && x <= bricksX[i] + 50) {
      if (y >= bricksY[i] && y <= bricksY[i] + 10) {
        soundFX2.play();
        bricksX[i] = 600;
        score += 10;
        totalScore += 25;
        points += 25;
        velY *= -1;

        //powerup
        if (rand == i) {
          LIVES++;
        }
        if (rand2 == i) {
          releaseSecondBall();
        }
      }
    }
  }
  for (i = 0; i < n; i++) {
    if (x2 >= bricksX[i] && x2 <= bricksX[i] + 50) {
      if (y2 >= bricksY[i] && y2 <= bricksY[i] + 10) {
        soundFX2.play();
        bricksX[i] = 600;
        score += 25;
        totalScore += 25;
        points += 25;
        velY2 *= -1;

        //powerup
        if (rand == i) {
          LIVES++;
        }
      }
    }
  }
}

function releaseSecondBall() {
  x2 = posX + 5;
  y2 = 320;
  velY2 = -1;
  let r = 0;
  while (r == 0) {
    r = round(random(2) - 1);
  }
  velX2 = r * 2;
}

function loseLife() {
  LIVES--;
  releaseBall();
  x2 = 600;
  y2 = 600;
  velX2 = 0;
  velY2 = 0;
}

function releaseBall() {
  posX = 300;
  velX_player = 0;
  x = 325;
  y = 320;
  let r = 0;
  while (r == 0) {
    r = round(random(2) - 1);
  }
  velY = -3;
  velX = 2 * r;
}

function drawBreakerGameOver() {
  background(0, 255, 255);
  fill(400);
  textSize(60);
  strokeWeight(3);
  stroke(51);
  textWrap(WORD);
  text("GAMEOVER", 125, 45, 100);
  fill(0);
  textSize(20);
  noStroke();
  text("Score: " + score, 220, 105, 150);
  stroke(51);

  totalScore = 0;

  if (225 < mouseX && 325 > mouseX && 140 < mouseY && 190 > mouseY) {
    fill(231, 255, 70);
  } else {
    fill(255, 255, 255);
  }
  rect(225, 140, 100, 50, 10);
  textSize(20);
  if (225 < mouseX && 325 > mouseX && 140 < mouseY && 190 > mouseY) {
    fill(255, 0, 0);
  } else {
    fill(51);
  }
  noStroke();
  text("Home", 250, 155, 100);
  textSize(13);

  if (205 < mouseX && 355 > mouseX && 230 < mouseY && 280 > mouseY) {
    fill(231, 255, 70);
  } else {
    fill(255, 255, 255);
  }
  strokeWeight(3);
  stroke(51);
  rect(205, 230, 150, 50, 10);
  textSize(20);
  if (205 < mouseX && 355 > mouseX && 230 < mouseY && 280 > mouseY) {
    fill(255, 0, 0);
  } else {
    fill(51);
  }
  noStroke();
  text("Play again", 230, 245, 100);
  textSize(13);
}