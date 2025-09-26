let dino = document.getElementById("dino");
let tree = document.getElementById("tree");
let game = document.getElementById("game");
let restartBtn = document.getElementById("restartBtn");

let isJumping = false;
let isDucking = false;
let gravity = 0.9;
let position = 0;
let runFrame = 1;
let duckFrame = 1;
let runSpeed = 5;
let runIntervalId = null;
let duckIntervalId = null;
let verticalVelocity = 0;
let groundOffset = 0;
let gameOver = false;
let score = 0;
let scoreIntervalId = null;
let treePosition = 600;
let treeIntervalId = null;
let isNightMode = false;
let lastCycleScore = 0;
let highestScore = 0;

// Handle jump and duck
document.addEventListener("keydown", function (event) {
  if (gameOver) return;

  if (event.code === "Space" || event.code === "ArrowUp") {
    jump();
  } else if (event.code === "ArrowLeft") { // To solve problem-3: write the correct condition in this line
    startDucking();
  }
});

// Handle keyup for ducking
document.addEventListener("keyup", function (event) {
  if (event.code === "ArrowLeft" && !gameOver) { // To solve problem-3: write the correct condition in this line
    stopDucking();
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

function startDucking() {
  if (isDucking || gameOver) return;
  isDucking = true;
  stopRunAnimation();
  startDuckAnimation();
}

function stopDucking() {
  if (!isDucking || gameOver) return;
  isDucking = false;
  stopDuckAnimation();
  startRunAnimation();
}

function startDuckAnimation() {
  if (duckIntervalId !== null) return;
  duckIntervalId = setInterval(() => {
    if (gameOver || !isDucking) return;

    duckFrame = duckFrame === 1 ? 2 : 1;
    if (duckFrame === 1) {
      dino.classList.add('duck1');
      dino.classList.remove('duck2');
    } else {
      dino.classList.add('duck2');
      dino.classList.remove('duck1');
    }
  }, 120);
}

function stopDuckAnimation() {
  if (duckIntervalId !== null) {
    clearInterval(duckIntervalId);
    duckIntervalId = null;
  }
  // Remove duck classes
  dino.classList.remove('duck1', 'duck2');
}

// Move tree
function moveTree() {
  treeIntervalId = setInterval(() => {
    if (gameOver) return;

    treePosition -= runSpeed;
    if (treePosition < -40) {
      // randomize next gap and height
      const randomGap = Math.floor(Math.random() * (600 - 200 + 1)) + 200; // 200-600px
      treePosition = 600 + randomGap; // reset to right side with gap
      if (score > 200) {
        const randomHeight = Math.floor(Math.random() * (70 - 50 + 1)) + 50; // 50-120px
        tree.style.height = randomHeight + "px";
        tree.style.width = 48 * (randomHeight / 100) + "px";
      }
    }
    tree.style.left = treePosition + "px";
  }, 20);
}

function stopTreeMovement() {
  if (treeIntervalId !== null) {
    treeIntervalId = null;
  }
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
    endGame();
  }
  }, 20);
}

function endGame() {
  gameOver = true;
  stopRunAnimation();
  stopScore();
  stopTreeMovement();
  runSpeed = 5;

  // Show game over text
  const gameOverText = document.createElement("div");
  gameOverText.textContent = "GAME OVER!";
  gameOverText.style.position = "absolute";
  gameOverText.style.top = "50%";
  gameOverText.style.left = "50%";
  gameOverText.style.transform = "translate(-50%, -50%)";
  gameOverText.style.zIndex = "1000";
  gameOverText.id = "gameOverMessage";
  game.appendChild(gameOverText);
}

// Score system
function startScore() {
  if (scoreIntervalId !== null) return;
  scoreIntervalId = setInterval(() => {
    if (gameOver) return;

    score += 1;
    updateScoreDisplay();
  }, 100); // 0.1 seconds = 100ms
}

function stopScore() {
  if (scoreIntervalId !== null) {
    clearInterval(scoreIntervalId);
    scoreIntervalId = null;
  }
}

function updateScoreDisplay() {
  let scoreElement = document.getElementById("score");
  if (!scoreElement) {
    scoreElement = document.createElement("div");
    scoreElement.id = "score";
    scoreElement.style.position = "absolute";
    scoreElement.style.top = "10px";
    scoreElement.style.right = "10px";
    scoreElement.style.fontSize = "12px";
    scoreElement.style.zIndex = "1000";
    game.appendChild(scoreElement);
  }

  // To solve problem-2: set the high score value according to the condition
  

  // To solve problem-2: Display both highest score and current score
  scoreElement.textContent = "Highest score: " + score + " | Score: " + score;

  // Set speed based on score (5 + 1 for every 100 points)
  runSpeed = 5 + Math.floor(score / 100);
}

function toggleDayNightCycle() {
  isNightMode = !isNightMode;
  lastCycleScore = score;

  // Apply smooth transition
  const gameElement = document.getElementById("game");
  const dinoElement = document.getElementById("dino");
  const treeElement = document.getElementById("tree");

  if (isNightMode) {
    // Transition to night mode (negative colors)
    gameElement.style.filter = "invert(1) hue-rotate(180deg)";
    gameElement.style.transition = "filter 1s ease-in-out";
  } else {
    // Transition to day mode (normal colors)
    gameElement.style.filter = "none";
    gameElement.style.transition = "filter 1s ease-in-out";
  }
}

function restartGame() {
  // Reset all game state
  gameOver = false;
  score = 0;
  runSpeed = 5;
  position = 0;
  verticalVelocity = 0;
  isJumping = false;
  isDucking = false;
  treePosition = 700;
  groundOffset = 0;
  isNightMode = false;
  lastCycleScore = 0;

  // Reset visual elements
  dino.style.bottom = "0px";

  // Reset day/night cycle
  const gameElement = document.getElementById("game");
  gameElement.style.filter = "none";
  gameElement.style.transition = "none";

  const gameOverText = document.getElementById("gameOverMessage");
  if (gameOverText) {
    gameOverText.remove();
  }

  // Stop any duck animations and restart run animation
  stopDuckAnimation();
  startRunAnimation();
  startScore();
  updateScoreDisplay();
}

// Add restart button event listener
restartBtn.addEventListener("click", restartGame);

checkCollision();
startScore();
