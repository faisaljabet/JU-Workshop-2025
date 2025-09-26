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

// Handle jump
document.addEventListener("keydown", function(event) {
  if (event.code === "Space" || event.code === "ArrowUp") {
    jump();
  }
});

function jump() {
  if (isJumping) return;
  isJumping = true;
  verticalVelocity = 13; // initial jump impulse

  const jumpInterval = setInterval(() => {
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
    groundOffset -= runSpeed;
    game.style.backgroundPosition = groundOffset + "px bottom";
  }, 20);
}

scrollGround();
