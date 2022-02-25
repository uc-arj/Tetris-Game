const canvas = document.getElementById('tetris');
const ctx = canvas.getContext('2d');

//level button
 const levelUpBtn = document.getElementById("increment");
 const levelDownBtn = document.getElementById("decrement");
 //buttons
 const leftBtn= document.querySelector("#leftarrow");
 const rightBtn = document.querySelector("#rightarrow");
  const downBtn = document.querySelector("#downarrow");
//help button
 const helpBtn=document.querySelector("#help");
//Variable for game
 let gameScore=0;   //set gameScore=0
 let gamelevel=1;   //set gamelevel=1
 const ROW = 12;    // let Row= 12
 const COL = COLUMN = 3; //let column=3
 const tetball = 46;  //ball Size
 const Space = "WHITE"; //Vacant space which shows Grid Space
 const radius = 23;  //Ball radius
 let level=1;   
 let downstart=Date.now();// Getting date Variable     


 //Draw Ball Code using X,Y cordinate and Color
 function drawBall(x, y, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc((x + 0.5) * tetball, (y + 0.5) * tetball, radius, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "White";
  ctx.stroke();
}

//Score Updater function
function scoreUpdater() {
  let score = document.querySelector("#score");
  let scoreValue = Number(score.value);
  console.log(scoreValue)
  score.value = scoreValue + 10;
  gameScore = scoreValue + 10;
}

//Grid Pattern Making
let Grid = [];
for (r = 0; r < ROW; r++) {
    Grid[r] = [];
    for (c = 0; c < COL; c++) {
        Grid[r][c] = Space;
    }
}

function gridPattern() { //Function for Grid
    for (r = 0; r < ROW; r++) {
        for (c = 0; c < COL; c++) {
            drawBall(c, r, Grid[r][c]);
        }
    }
}

//Random Ball Color 
const colors=["Purple","green","yellow","Blue"]
//Random ball Color Function
function randomColor(){
  let r=Math.floor(Math.random()*colors.length)
  return colors[r]
}
//Random number function
function randomNumber(){
  let r=Math.floor(Math.random()*3)
  return r;
}
//level down function
function levelDown() {
  let level = document.querySelector("#level");
  let levelValue = Number(level.value)
  if (levelValue === 1) {
      alert("Level should be at least 1");
  } else {
      level.value = levelValue - 1;
      gamelevel = levelValue - 1;
  }
  down();
};

// Level up Function
function levelUp() {
  let level = document.querySelector("#level");
  let levelValue = Number(level.value);
  if (levelValue === 4) {
      alert("Level 4 is max");
  } else {
      level.value = levelValue + 1;
      gamelevel = levelValue + 1;
  }
  down();
}
// Define Ball object 
let ball = new generateBall();
// Ball Function Definiation
function Ball() { 
    this.x = randomNumber();
    this.y = -1;
    this.color = randomColor();
  }
//Ball function Draw
Ball.prototype.draw = function (){
  drawBall(this.x,this.y,this.color);
}
ball.draw();

// Button Moves  function
Ball.prototype.moveDown = function (){
  if (!this.colliod(0, 1)) {
     drawBall(this.x,this.y,Space);
     this.y++
     drawBall(this.x,this.y,this.color);
    }
  else{
    ball.jam();
    ball=generateBall() ;  
  }
}
Ball.prototype.moveRight=function(){
  if (!this.colliod(1, 0)) {
  drawBall(this.x,this.y,Space);
  this.x++
  drawBall(this.x,this.y,this.color)
  }
}
Ball.prototype.moveLeft=function(){
  if(!this.colliod(-1,0)){
  drawBall(this.x,this.y,Space);
  this.x--
  drawBall(this.x,this.y,this.color)
}
}
// colliod function for New Ball
Ball.prototype.colliod = function (x, y) {
  let Xcore = this.x + x; 
  let Ycore = this.y + y;
  
  //Condition for Left Right and Last Location
  if (Xcore < 0 || Xcore >= COL || Ycore >= ROW) {
      return true;
  }
  if(Ycore<0){  
  }else if (Grid[Ycore][Xcore] != Space) { 
      return true;}

  return false;
}
// ball collapse and lock function
//Jam function for Match Making vertical and Horizonatal and game over alert
Ball.prototype.jam=function(){
     if(this.y<0){  
       gameover=true
       alert(`Game Over Your Score is  ${gameScore}`);
       location.reload();
     }
     else{ 
      // Define the grid to the Implement Color on the X and Y
      // If any color found than stop on another
     Grid[this.y][this.x]=this.color
     // If grid is vacant then score not Update
     if(Grid[this.y][this.x]!=Space){
       if(this.y<10){
        if (Grid[this.y][this.x] == Grid[this.y + 1][this.x] && Grid[this.y + 1][this.x] == Grid[this.y + 2][this.x]) {
          Grid[this.y][this.x] = Grid[this.y + 1][this.x] = Grid[this.y + 2][this.x] = Space;
          drawBall(this.x, this.y, Space);
          drawBall(this.x, this.y + 1, Space);
          drawBall(this.x, this.y + 2, Space);
          
          scoreUpdater();
        }
      }}
      //If grid is not vacant is true then score will update 
      if(Grid[this.y][this.x]!=Space){
        if (Grid[this.y][0] == Grid[this.y][1] && Grid[this.y][1] == Grid[this.y][2]) {
          Grid[this.y][0] = Grid[this.y][1] = Grid[this.y][2] = Space;
      
          // this loop for update the grid and shift the ball to the down  
          for (i = this.y; i > 0; i--) {
              for (r = 0; r < COL; r++) {
                Grid[i][r] = Grid[i - 1][r];
                  drawBall(r, i, Grid[i][r]);
                       }
                }  scoreUpdater();
             }
          }     
       // end of function
      } //end of else 
  } //end of jam function
   


let gameover=false;
// Drop and Sliding function
function down(){
  let now = Date.now();
  let delay = now - downstart;
  
  if (delay > 1000 +50- gamelevel * 250) {
      ball.moveDown();   
      downstart = Date.now();   
  }
  if(gameover==false){
      requestAnimationFrame(down);
    }
}
// Generate new ball Randomly
function generateBall() {
  let randomN = Math.floor(Math.random() * colors.length)
  return new Ball(Math.floor(Math.random() * 5), 0, colors[randomN])
}
down();

//  key button controller
document.addEventListener("keydown",controller);
function controller() {
  if (event.keyCode == 37) {
      ball.moveLeft();
      downstart = Date.now();
      leftBtn.focus();
  } else if (event.keyCode == 39) {
      ball.moveRight();
      downstart = Date.now();
      rightBtn.focus();
  } else if (event.keyCode == 40) {
      ball.moveDown();
      downstart = Date.now();
      downBtn.focus();}
   else if (event.keyCode == 107) {
      levelUp();
      levelUpBtn.focus();
  } else if (event.keyCode == 109) {
      levelDown();
      levelDownBtn.focus();
  }
}
//level controller
levelDownBtn.addEventListener("click", levelDown);
levelUpBtn.addEventListener("click", levelUp);
helpBtn.addEventListener("click", help);

//Control button Function
leftBtn.addEventListener("click",function(){
  ball.moveLeft()
  downstart= Date.now();
  leftBtn.focus();
})
rightBtn.addEventListener("click", function () {
  ball.moveRight();
  downstart = Date.now();
  rightBtn.focus();
});
downBtn.addEventListener("click", function () {
  ball.moveDown();
  downstart = Date.now();
  downBtn.focus();
});
function help(){ //help function
  alert(`Help\n
  - : to level Down\n
  + : to level Up\n
  > : to move right\n
  V : to move Down\n
  < : to move left\n`);
}
