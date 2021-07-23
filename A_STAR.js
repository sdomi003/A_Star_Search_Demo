/**
 * By Samuel Dominguez - UC Riverside Class of 2020
 * Written using P5.js libaries for the visuals
 */

let grid = [];
let openList = [];
let closedList = [];

let startPathFinding = false;
let drawButtons = true;

let speedSlider;

// this is the gradient value for explored cells.
let globalInterVal = .05;

let BOARD_WIDTH = 20;
let BOARD_HEIGHT = 15;

function setup() {
  createCanvas(400, 400);
  initGrid();
  clearBoard();
  displayBoard();
  openList.push(grid[0][0]);
  grid[0][0].g = 0;  
}

/**
 * This method is called every frame. 
 * draw() is a method picked up by p5.js library
 */
function draw() {
  if (drawButtons) {
      createButtons();
      
      drawButtons = false;
  }
  background(220);
  createObstacle();
  createStartAndEnd();
  if (startPathFinding) {
    frameRate(1 + speedSlider.value()/4);
    AStar();
  }
  displayBoard();
  textSize(15);
  text('edit drawing speed (b4 or during): ', 10, 380);
}

// re-draws the path without clearing the obstacles
function reDrawPath() {
  clearAllButObstacles();
  openList = [];
  openList.push(grid[0][0]);
  grid[0][0].g = 0;
  startPathFinding = true;
  globalInterVal = .05;
}

// used for debugging
function printOpenListPicks (pick) {
  print("\n\n\n");
  for (let i = 0; i < openList.length; ++i) {
    print(openList[i].h); 
  }
  print("PICKED ", openList[pick].h);
  print("\n\n\n");
}

/**
 * The main A* algorithm.
 * This method is called every frame if startPathFinding == true
 * So there is no while() loop because this method is basically in a giant while loop
 */
function AStar() {
  if (openList.length > 0) {
    let lowestIndex = 0;
    let lowestSeen = openList[0].f;
    for (let i = 0; i < openList.length; i++) {
       if (openList[i].f < lowestSeen) {
         lowestIndex = i;
         lowestSeen = openList[i].f;
       }
    }
    //printOpenListPicks(lowestIndex);
    // now I have the index of the node with the lowest F cost
    let currNode = openList[lowestIndex];
    
    // render currNode to show we're looking at it atm
    currNode.fillType = 2;
    refreshBoard();
    lightUpCurrentPath(currNode);
    if (currNode.i == 14 && currNode.j == 19) {
      // path found!!
      lightUpWinningPath(currNode);
      return;
    }
    
    // take away from open list and mark as seen
    openList.splice(lowestIndex, 1);
    currNode.alreadyExplored = true;
    
    // process all available neighbors
    let neighbors = getNeighbors(currNode);
    
    for (let i = 0; i < neighbors.length; i++) {
      let neighbor = neighbors[i];
      let gScore = currNode.g + 1;
      if (neighbor.g == Infinity) {
        openList.push(neighbor);
      }
      if (gScore < neighbor.g) {
        neighbor.g = gScore;
        neighbor.f = neighbor.g + neighbor.h;
        // make sure to set this currNode as neighbor's parent
        neighbor.parent = currNode;
      }
    }
  } else {
    startPathFinding = false;
    refreshBoard();
  }
}

/**
 * Lights up the winning path from start to end.
 * Today, the winning path is the same color as the regular path when it is being explored.
 * But it can be changed.
 */
function lightUpWinningPath(node) {
  console.log("WINNING PATH FOUND");
  curr = node;
  while (curr) {
    curr.fillType = 3;
    curr = curr.parent;
  }
  startPathFinding = false;
}

/**
 * For some reason, back when I wrote this I decided to represent the grid as
 * grid[column][row]
 * So, here i = column and j = row 
 * I'm not sure why I did this :/ 
 */
function getNeighbors(node) {
  let i = node.i;
  let j = node.j;
  let neighbors = [];
  
  // down
  if (i+1 < BOARD_HEIGHT && grid[i+1][j].fillType != 1) {
    if (!grid[i+1][j].alreadyExplored) {
      neighbors.push(grid[i+1][j]);
    }
  }
  
  // up
  if (i-1 >= 0 && grid[i-1][j].fillType != 1) {
    if (!grid[i-1][j].alreadyExplored) {
      neighbors.push(grid[i-1][j]);
    }
  }
  
  // right
  if (j + 1 < BOARD_WIDTH && grid[i][j+1].fillType != 1) {
    if (!grid[i][j+1].alreadyExplored) {
      neighbors.push(grid[i][j+1]);
    }
  }
  
  // left
  if (j-1 >= 0 && grid[i][j-1].fillType != 1) {
    if (!grid[i][j-1].alreadyExplored) {
      neighbors.push(grid[i][j-1]);
    }
  }
  
  // upper left corner, i - 1, j - 1
  if (j-1>= 0 && i-1 >= 0 && grid[i-1][j-1].fillType != 1) {
    if (!grid[i-1][j-1].alreadyExplored) {
      neighbors.push(grid[i-1][j-1]);
    }
  }
  
  // lower left corner, i + 1, j - 1
  if (j-1>= 0 && i+1 < BOARD_HEIGHT && grid[i+1][j-1].fillType != 1) {
    if (!grid[i+1][j-1].alreadyExplored) {
      neighbors.push(grid[i+1][j-1]);
    }
  }
  
  
  // upper right corner, i - 1, j + 1
  if (j+1 < BOARD_WIDTH && i-1 >= 0 && grid[i-1][j+1].fillType != 1) {
    if (!grid[i-1][j+1].alreadyExplored) {
      neighbors.push(grid[i-1][j+1]);
    }
  }
  
  
  // lower right corner, i + 1, j + 1
  if (j+1< BOARD_WIDTH && i+1 <= 14 && grid[i+1][j+1].fillType != 1) {
    if (!grid[i+1][j+1].alreadyExplored) {
      neighbors.push(grid[i+1][j+1]);
    }
  }

  return neighbors;
}

function createStartAndEnd() {
  fill(0);
  textSize(14);
  text("S", 6, 15);
  text("E", 386, 295);
}

function AStarStart() {
  startPathFinding = true; 
}

function createButtons() {
  button = createButton('Start Path Finding');
  button.position(30, 480);
  button.style('background-color', '#F3C98B');
  button.mousePressed(AStarStart);

  clearButton = createButton('Re-draw Path');
  clearButton.position(180, 480);
  clearButton.style('background-color', '#F3C98B');
  clearButton.mousePressed(reDrawPath);
  
  clearButton = createButton('CLEAR ALL');
  clearButton.position(300, 480);
  clearButton.style('background-color', '#F3C98B');
  clearButton.mousePressed(eraseBoard);

  speedSlider = createSlider(0, 255, 100);
  speedSlider.position(250, 520);
}

function initGrid() {
  for (let i = 0; i < 15; i++) {
    grid[i] = new Array(20);
  }
  x = 0;
  y = 0;
  for (let i = 0; i < grid.length; i++) {
    for (let j  = 0; j < grid[0].length; j++) {
      grid[i][j] = new Square(x, y, 20, i, j);
      x += 20;
    }
    x = 0;
    y += 20;
  }
}

// removes everything, including obstacles
function clearBoard() {
  frameRate(60);
  startPathFinding = false;
  for (let i = 0; i < grid.length; i++) {
    for (let j  = 0; j < grid[0].length; j++) {
      if (grid[i][j].fillType != 1) { 
        grid[i][j].fillType = 0;
      }
      grid[i][j].parent_i = -1;
      grid[i][j].parent_j = -1;
      grid[i][j].g = Infinity;
      grid[i][j].f = Infinity;
      grid[i][j].alreadyExplored = false;
    }
  }
}

// This method is called every frame to re-draw the whole board with all the updated grid box colors
function refreshBoard() {
  for (let i = 0; i < grid.length; i++) {
    for (let j  = 0; j < grid[0].length; j++) {
      if (grid[i][j].fillType != 1 && grid[i][j].fillType != 2 && grid[i][j].fillType != 5 && grid[i][j].fillType != 4) {
        grid[i][j].fillType = 0;
      } else if ((grid[i][j].fillType == 2 || grid[i][j].fillType == 5) && !grid[i][j].alreadyExplored) {
        // mark as explored but not part of winning
        print("set fill type to " + 4)
        grid[i][j].fillType = 4;
        grid[i][j].interVal = globalInterVal;
        globalInterVal += .008;
      } else if (grid[i][j].fillType == 2 || grid[i][j].fillType == 5) {
        grid[i][j].fillType = 4;
      }
    }
  }
}

// Executed when user wants to re-run the A* search on their existing obstacle course
function clearAllButObstacles() {
  for (let i = 0; i < grid.length; i++) {
    for (let j  = 0; j < grid[0].length; j++) {
      if (grid[i][j].fillType != 1) {
        grid[i][j].fillType = 0;
        grid[i][j].parent_i = -1;
        grid[i][j].parent_j = -1;
        grid[i][j].g = Infinity;
        grid[i][j].f = Infinity;
        grid[i][j].alreadyExplored = false;

      }
    }
  }
}

function displayBoard() {
  for (let i = 0; i < grid.length; i++) {
    for (let j  = 0; j < grid[0].length; j++) {
       grid[i][j].display();
    }
  }
  createStartAndEnd();
}

function createObstacle() {
  if (mouseIsPressed) {
    for (let i = 0; i < grid.length; i++) {
      for (let j  = 0; j < grid[0].length; j++) {
        let d = dist(mouseX, mouseY, grid[i][j].x + 5, grid[i][j].y + 5);
        if (d < 10) {
          grid[i][j].fillType = 1;
        }
        
      }
    }
  }
}

function lightUpCurrentPath(node) {
  curr = node;
  // fill in head
  curr.fillType = 5;  
  curr = curr.parent;
  while (curr) {
    curr.fillType = 2;
    curr = curr.parent;
  }
  displayBoard();
}

class Square {
  constructor(x, y, s, i, j, parent_i, parent_j) {
    this.x = x;
    this.y = y;
    this.s = s;
    // 0 = clear
    // 1 = obstacle
    // 2 = draw path
    // 3 = winning path
    // 4 = explored but not part of winning path
    // 5 = head of current path
    this.fillType = 0;
    this.i = i;
    this.j = j;
    this.parent = null;
    this.g = Infinity;
    this.h = Math.abs(this.i - 14) +  Math.abs(this.j - 19);
    this.f = Infinity;
    this.alreadyExplored = false;
    this.interVal = 0;
  }
  
  display() {
    if (this.fillType == 0) {
      this.displayBlank();
    } else if (this.fillType == 1) {
      this.displayObstacle();
    } else if (this.fillType == 2) {
      this.displayFilled();
    } else if (this.fillType == 3) {
      // is winning path
      this.displayWinning();
    } else if (this.fillType == 4) {
      this.displayExploredButNotPartOfWinning();
    } else if (this.fillType == 5) {
      this.displayHead();
    } else {
      console.log("ERROR, invalid fill type.");
    }
  }
  
  displayBlank() {
    fill(WHITE);
    square(this.x, this.y, this.s); 
  }
  
  displayFilled() {
    fill(GOLD);
    square(this.x, this.y, this.s);
  }
  
  displayObstacle() {
    fill(BLACK);
    square(this.x, this.y, this.s);
  }
  displayWinning() {
    fill(GOLD);
    square(this.x, this.y, this.s);
  }
  displayExploredButNotPartOfWinning() {
    let c1 = color(WHITE);
    let c2 = color(RED);
    //print("inter val" + this.interVal)
    let interA = lerpColor(c1, c2, this.interVal);
    //fill('#d4b7e1');
    fill(interA);
    square(this.x, this.y, this.s);
  }
  displayHead() {
    fill(GREEN);
    square(this.x, this.y, this.s);
  }  
}

let BLACK = "#2d4059";

let GOLD = "#ffb400";

let WHITE = "#f6f6f6";

let RED = "#ea5455";

let GREEN = "#49beb7";

function eraseBoard(){
  globalInterVal = .05;
  grid = [];
  openList = [];
  closedList = [];
  setup(); 
}
