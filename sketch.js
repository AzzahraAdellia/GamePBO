let player;
let level;
let m;

function setup() {
  player = new Hero(10, 200, 20, 20);
  m = new Map(600, 400);
  m.init(1);
  level = new Level();
}

function draw() {
    
  if(level.getCurentLevel() % 2 == 0){
    background(220);
    stroke(0);
    text(level.getCurentLevel(), 500, 70);
  }else{
    background(50);
    stroke(255);
    text(level.getCurentLevel(), 500, 70);
  }
  stroke(255, 0, 0);
  text(player.life, 500, 50);
  noStroke();
  
  player.show();
  
   for(let plr of player.peluru){
     plr.show();
   }
  
   for(let en of m.enemy){
     en.show();
     
     if(dist(en.x, en.y, player.x, player.y) < 20){
       m.enemy.splice(m.enemy.indexOf(en), 1);
       player.calculateLife(-10);
     }
   }
  if(player.life <= 0){
    stroke(0, 0, 0);
    text('Game Over', 300, 200);
    text('Press enter to play', 300, 200 + 10);
    noLoop();
  }
  
  for(let en of m.enemy){
    for(let plr of player.peluru){
      if (dist(en.x, en.y, plr.x, plr.y) < 20){
        m.enemy.splice(m.enemy.indexOf(en), 1);
        player.peluru.splice(player.peluru.indexOf(plr), 1);
        
      }
    }
    
    if(en.x < 0){
      m.enemy.splice(m.enemy.indexOf(en), 1);
      let yE = random(0, 400);
      let xE = random(1600, 400);
      en = new Monster(xE, yE, 10, 10, 1);
      m.enemy.push(en)
    }
  }
  
  if(m.enemy.length < 1){
    level.setLevel(level.getCurentLevel() + 1);
    m.init(level.getCurentLevel());
  }
  
  if (keyIsDown(UP_ARROW)) {
    player.moveUp();
  }
  if (keyIsDown(DOWN_ARROW)) {
    player.moveDown();
  }
  if (keyIsDown(LEFT_ARROW)) {
    player.moveLeft();
  }
  if (keyIsDown(RIGHT_ARROW)) {
    player.moveRight();
  }
  
}

function keyPressed() {
  if (keyCode === 32) {
    player.attack();
  } 
  if (keyCode === RETURN){
    level.setLevel(1);
    m.init(1);
    player.life = 100;
    loop();
  }
}
