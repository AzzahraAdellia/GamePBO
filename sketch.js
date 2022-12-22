let player;
let level;
let m;

let state = 0;

function setup() {
  player = new Hero(10, 200, 20, 20);
  level = new Level();
  level.setLevel(1);
  m = new Map(600, 400);
  m.init(1);
}
 
function draw() {
    
  if(state === 0){
    background(220);
    stroke(255, 0, 0);
    text('Press enter to play', 250, 200 + 10);
  }
  else if(state === 1){
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
    text("Enemy left:", 500, 85);
    text(m.enemy.length, 500, 100);
    noStroke();

  player.show();
  
   for(let plr of player.peluru){
     plr.show(10);
   }
  
   for(let en of m.enemy){
     en.show();
     
     if(dist(en.x, en.y, player.x, player.y) < 20){
       m.enemy.splice(m.enemy.indexOf(en), 1);
       player.calculateLife(-10);
       
       
       if(en.effect === 1){
            player.addLife(10);
          }else{
            player.calculateLife(-10);
          }
     }
   }
  if(player.life <= 0){

      if(level.maxLevel < level.getCurentLevel()){
        level.maxLevel = level.getCurentLevel();
      }
      state = 2;
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
    level.latestLevel = level.getCurentLevel();
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

}else{
    background(220);
    textSize(24);
    stroke(255, 0, 0);
    text('Game Over', 200, 200);
    stroke(0, 0, 0);
    text('Press enter to play', 200, 200 + 30);
    text('Highest Level', 200, 200 + 60);
    text(level.maxLevel, 200, 200 + 90);
    textSize(12);
  }
}  
  
function keyPressed() {
  if (keyCode === 32) {
    player.attack();
  } 
  if (keyCode === RETURN){
    state = 1;
    level.setLevel(1);
    m.init(1);
    player.life = 100;
  }
}


class Entity {
  constructor(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.height = w;
    this.width = h;
    this.peluru = [];
  }
  
  attack(){
    let plr = new Peluru(player.x, player.y);
    this.peluru.push(plr);
  }
  
  moveRight(){
    if(this.x < 600){    
      this.x += 2;
    }
  }
  moveLeft(){
    if(this.x > 0){
      this.x -= 2;
    }
  }
  moveDown(){
    if(this.y < 400){
      this.y += 2;
    }
  }
  moveUp(){
    if(this.y > 0){
      this.y -= 2;
    }
  }
}

class Hero extends Entity{
  constructor(x, y, w, h) {
    super(x, y, w, h);
    this.life = 100;
    this.score = 0;
  }
  
  show(){
    fill(255, 100, 20);
    ellipse(this.x, this.y, this.width, this.height);
    noFill();
  }
  
  increaseScore(){
    this.score +=1;
  }
  calculateLife(l){
    this.life += l;
  }
addLife(l){
    if(this.life + l > 100){
      this.life = 100;
    }else{    
      this.life += l; 
    }
  }
}

class Monster extends Entity {
  constructor(x, y, h, w) {
    super(x, y, h, w);
    this.life = 1;
    this.color = [random(0, 255), random(0, 255), random(0, 255)];
    this.effect = 0;
    this.type = random(0, 2);
  }
  moveRandom() {
    let move = ['up', 'down'];
    return random(move);
  }
  show(){
    stroke(0);
    if(this.effect === 1.5){  
      this.effect = 1;
      fill(0, 255, 0);
      triangle(this.x, this.y, this.x+10, this.y-10, this.x+10, this.y+10);
      noFill()
      
    }else{
      fill(0, 255, 0);
      triangle(this.x, this.y, this.x+10, this.y-10, this.x+10, this.y+10);
      noFill()
    }
    noStroke();
    this.x -= 2;
  }
}

class Peluru{
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
  
  show(s){
    stroke(255, 0, 0);
    fill(255, 0, 0);
    circle(this.x, this.y, 3);
    this.x += s;
    noFill();
    noStroke();
  }
}

class Map{
  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.enemy = [];
  }
  init(lev){
    createCanvas(this.width, this.height);
    for(let i = 0; i < 10 * lev; i++){
      let yE = random(0, 400);
      let xE = random(1600, 600);
      let en = new Monster(xE, yE, 10, 10, 1);
      this.enemy.push(en)
    }
  }
}

class Level{
  constructor() {
    this.currentLevel = 0;
    this.latestLevel = 0;
    this.maxLevel = 0;
  }
  setLevel(level){
    this.currentLevel = level;
  }
  getCurentLevel(){
    return this.currentLevel;
  }
}
