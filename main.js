const canvas = document.getElementById('tetris');
const ctx = canvas.getContext('2d');

//level button
const level_up_btn = document.getElementById("increment");
const level_down_btn = document.getElementById("decrement");
//buttons
const left_btn = document.querySelector("#leftarrow");
const right_btn = document.querySelector("#rightarrow");
const down_btn = document.querySelector("#downarrow");
//help button

const leftmovekey_code = 37;
const rightmovekey_code = 39;
const downmovekey_code = 40;
const levelupkey_code = 187;
const leveldownkey_code = 189;
const helpkey_code = 191;
const increase = 10;
const help_btn = document.querySelector("#help");
//Variable for game
let game_score = 0;   //set game_score=0
let game_level = 1;   //set game_level=1
const row = 12;    // let row= 12
const col = 3; //let column=3
const ball_size = 46;  //ball Size
const space = "WHITE"; //Vacant space which shows grid space
const radius = 23;  //Ball radius
let level = 1;
let down_start = Date.now();// Getting date Variable     
const colors = ["Purple", "green", "yellow", "Blue"]//Random Ball color 

//Draw Ball Code using X,Y cordinate and color

function drawBall(x, y, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc((x + 0.5) * ball_size, (y + 0.5) * ball_size, radius, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "White";
  ctx.stroke();
}
// init();


//Score Updater function
function scoreUpdater() {
  let score = document.querySelector("#score");
  let scorevalue = Number(score.value);
  console.log(scorevalue)
  score.value = scorevalue + increase;
  game_score = scorevalue + increase;
}

//grid Pattern Making
let grid = [];
for (r = 0; r < row; r++) {
  grid[r] = [];
  for (c = 0; c < col; c++) {
    grid[r][c] = space;
  }
}

function gridPattern() { //Function for grid
  for (r = 0; r < row; r++) {
    for (c = 0; c < col; c++) {
      drawBall(c, r, grid[r][c]);
    }
  }
}
//Random ball color Function
function randomColor() {
  let r = Math.floor(Math.random() * colors.length)
  return colors[r]
}

//level down function
function levelDown() {
  let level = document.querySelector("#level");
  console.log(level);
  let level_value = Number(level.value)
  if (level_value === 1) {
    alert("Level should be at least 1");
  } else {
    level.value = level_value - 1;
    game_level = level_value - 1;
  }
  down();
};


// Level up Function
function levelUp() {
  let level = document.querySelector("#level");
  let level_value = Number(level.value);
  if (level_value === 4) {
    alert("Level 4 is max");
  } else {
    level.value = level_value + 1;
    game_level = level_value + 1;
  }
  down();
}
// Define Ball object 
let ball = new generateBall();
// Ball Function Definiation
function Ball() {
  this.x = 1;
  this.y = -1;
  this.color = randomColor();
}
//Ball function Draw
Ball.prototype.draw = function () {
  drawBall(this.x, this.y, this.color);
}
ball.draw();

// Button Moves  function
Ball.prototype.moveDown = function () {
  if (!this.colliod(0, 1)) {
    drawBall(this.x, this.y, space);
    this.y++
    drawBall(this.x, this.y, this.color);
  }
  else {
    ball.jam();
    ball = generateBall();
  }
}
Ball.prototype.moveRight = function () {
  if (!this.colliod(1, 0)) {
    drawBall(this.x, this.y, space);
    this.x++
    drawBall(this.x, this.y, this.color)
  }
}
Ball.prototype.moveLeft = function () {
  if (!this.colliod(-1, 0)) {
    drawBall(this.x, this.y, space);
    this.x--
    drawBall(this.x, this.y, this.color)
  }
}
// colliod function for New Ball
Ball.prototype.colliod = function (x, y) {
  let xcore = this.x + x;
  let ycore = this.y + y;


  //Condition for Left Right and Last Location
  if (xcore < 0 || xcore >= col || ycore >= row || (ycore < 0)) {
    return true;
  }

  else if (grid[ycore][xcore] != space) {
    return true;
  }

  return false;
}
// ball collapse and lock function
//Jam function for Match Making vertical and Horizonatal and game over alert
Ball.prototype.jam = function () {
  if (this.y < 0) {
    gameover = true
    alert(`Game Over Your Score is  ${game_score}`);
    location.reload();
  }
  else {
    // Define the grid to the Implement Color on the X and Y
    // If any color found than stop on another
    grid[this.y][this.x] = this.color
    // If grid is vacant then score not Update
    if (grid[this.y][this.x] != space) {
      if (this.y < 10) {
        if (grid[this.y][this.x] == grid[this.y + 1][this.x] && grid[this.y + 1][this.x] == grid[this.y + 2][this.x]) {
          grid[this.y][this.x] = grid[this.y + 1][this.x] = grid[this.y + 2][this.x] = space;
          drawBall(this.x, this.y, space);
          drawBall(this.x, this.y + 1, space);
          drawBall(this.x, this.y + 2, space);

          scoreUpdater();
        }
      }
    }
    //If grid is not vacant is true then score will update 
    if (grid[this.y][this.x] != space) {
      if (grid[this.y][0] == grid[this.y][1] && grid[this.y][1] == grid[this.y][2]) {
        grid[this.y][0] = grid[this.y][1] = grid[this.y][2] = space;

        // this loop for update the grid and shift the ball to the down  
        for (i = this.y; i > 0; i--) {
          for (r = 0; r < col; r++) {
            grid[i][r] = grid[i - 1][r];
            drawBall(r, i, grid[i][r]);
          }
        } scoreUpdater();
      }
    }
    // end of function
  } //end of else 
} //end of jam function

let gameover = false;
// Drop and Sliding function
function down() {
  let now = Date.now();
  let delay = now - down_start;

  if (delay > 1000 + 50 - game_level * 250) {
    ball.moveDown();
    down_start = Date.now();
  }
  if (gameover == false) {
    requestAnimationFrame(down);
  }
}
// Generate new ball Randomly
function generateBall() {
  let random = Math.floor(Math.random() * colors.length)
  return new Ball(Math.floor(Math.random() * 5), 0, colors[random])
}
down();

//  key button controller
document.addEventListener("keydown", controller);
function controller() {
  if (event.keyCode == leftmovekey_code) {
    ball.moveLeft();
    down_start = Date.now();
    left_btn.focus();
  } else if (event.keyCode == rightmovekey_code) {
    ball.moveRight();
    down_start = Date.now();
    right_btn.focus();
  } else if (event.keyCode == downmovekey_code) {
    ball.moveDown();
    down_start = Date.now();
    down_btn.focus();
  }
  else if (event.keyCode == levelupkey_code) {
    levelUp();
    level_up_btn.focus();
  } else if (event.keyCode == leveldownkey_code) {
    levelDown();
    level_down_btn.focus();
  }
  else if (event.keyCode == helpkey_code) {
    help()
    help_btn.focus();
  }
}

function help() { //help function
  alert(`Help\n
  - : to level Down\n
  + : to level Up\n
  > : to move right\n
  V : to move Down\n
  < : to move left\n`);
}

//level controller init
function init() {
  level_down_btn.addEventListener("click", levelDown);
  level_up_btn.addEventListener("click", levelUp);
  help_btn.addEventListener("click", help);

  //Control button Function
  left_btn.addEventListener("click", function () {
    ball.moveLeft()
    down_start = Date.now();
    left_btn.focus();
  })
  right_btn.addEventListener("click", function () {
    ball.moveRight();
    down_start = Date.now();
    right_btn.focus();
  });
  down_btn.addEventListener("click", function () {
    ball.moveDown();
    down_start = Date.now();
    down_btn.focus();
  });
}

