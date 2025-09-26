let dino = document.getElementById("dino");
let tree = document.getElementById("tree");
let game = document.getElementById("game");

let isJumping = false;
let gravity = 0.9;
let position = 0;
let runFrame = 1;
let runSpeed = 5;
let runIntervalId = null;
let verticalVelocity = 0;
let groundOffset = 0;
let gameOver = false;

// Handle jump
document.addEventListener("keydown", function(event) {
  if ((event.code === "Space" || event.code === "ArrowUp") && !gameOver) {
    jump();
  }
});

function jump() {
  if (isJumping || gameOver) return;
  isJumping = true;
  verticalVelocity = 13; // initial jump impulse

  const jumpInterval = setInterval(() => {
    if (gameOver) {
      clearInterval(jumpInterval);
      return;
    }
    
    position += verticalVelocity;
    verticalVelocity -= gravity;

    if (position <= 0) {
      position = 0;
      isJumping = false;
      clearInterval(jumpInterval);
    }

    dino.style.bottom = position + "px";
  }, 20);
}

// Move tree
function moveTree() {
  let treePosition = 600;

  setInterval(() => {
    if (gameOver) return;
    
    treePosition -= runSpeed;
    if (treePosition < -40) {
      treePosition = 600; // reset to right side
    }
    tree.style.left = treePosition + "px";
  }, 20);
}

moveTree();

// Toggle dino run frames
function startRunAnimation() {
  if (runIntervalId !== null) return;
  runIntervalId = setInterval(() => {
    if (gameOver) return;
    
    runFrame = runFrame === 1 ? 2 : 1;
    if (runFrame === 1) {
      dino.classList.add('run1');
      dino.classList.remove('run2');
    } else {
      dino.classList.add('run2');
      dino.classList.remove('run1');
    }
  }, 120);
}

// Stops dino run frames
function stopRunAnimation() {
  if (runIntervalId !== null) {
    clearInterval(runIntervalId);
    runIntervalId = null;
  }
}

// Start animating on load
startRunAnimation();

// Scroll ground background continuously based on runSpeed
function scrollGround() {
  setInterval(() => {
    if (gameOver) return;
    
    groundOffset -= runSpeed;
    game.style.backgroundPosition = groundOffset + "px bottom";
  }, 20);
}

scrollGround();

// Collision detection
function checkCollision() {
  setInterval(() => {
    if (gameOver) return;
    
    const dinoRect = dino.getBoundingClientRect();
    const treeRect = tree.getBoundingClientRect();
    const gameRect = game.getBoundingClientRect();
    
    // Convert to game coordinates
    const dinoLeft = dinoRect.left - gameRect.left;
    const dinoRight = dinoRect.right - gameRect.left;
    const dinoTop = dinoRect.top - gameRect.top;
    const dinoBottom = dinoRect.bottom - gameRect.top;
    
    const treeLeft = treeRect.left - gameRect.left;
    const treeRight = treeRect.right - gameRect.left;
    const treeTop = treeRect.top - gameRect.top;
    const treeBottom = treeRect.bottom - gameRect.top;
    
    // Check if dino and tree overlap
    if (treeRight-dinoLeft > 5 && dinoRight-treeLeft > 5 && 
        treeBottom-dinoTop > 5 && dinoBottom-treeTop > 5) {
      //call the correct function here

      endGame()

    }
  }, 20);
}

function endGame() {
  gameOver = true;
  stopRunAnimation();
}


checkCollision();
