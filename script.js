// DOM SELECT ELEMENTS
const holes = document.querySelectorAll(".hole");
const scoreDisplay = document.getElementById("score");
const moleCountDisplay = document.getElementById("moleCount");
const startButton = document.getElementById("startButton");
const timerDisplay = document.getElementById("timer");
const gameOverScreen = document.getElementById("gameOverScreen");
const finalScoreDisplay = document.getElementById("finalScore");
const accuracyDisplay = document.getElementById("accuracy");
const playAgainButton = document.getElementById("playAgainButton");

// Game variables
let score = 0;
let timeLeft = 15;
let timerInterval = null;

// Sound effect for whacking moles
function playWhackSound() {
  // Create audio element for whack sound
  const audio = new Audio("sounds/pop.mp3");
  audio.volume = 0.3;

  // Play the sound, handle errors gracefully
  audio.play().catch(function (error) {
    // Sound failed to play, continue silently
    console.log("Sound could not play:", error);
  });
}

// Initialize game board
function initializeGame() {
  holes.forEach((hole) => {
    const mole = document.createElement("div");
    mole.className = "mole";
    hole.appendChild(mole);

    // Add click event listener to each mole
    mole.addEventListener("click", whackMole);
  });
}

// Whack function - handles clicking on moles
function whackMole(event) {
  // Check if the game is running
  if (!gameRunning) return;

  // Get the hole that contains this mole
  const hole = event.target.parentElement;

  // Check if the mole is currently up (visible)
  if (hole.classList.contains("up")) {
    // Increase the score by 1 point
    score++;

    // Update the score display
    scoreDisplay.textContent = score;

    // Remove the mole immediately (hide it)
    hole.classList.remove("up");

    // Play whack sound
    playWhackSound();

    // Optional: Add a visual feedback class (if you have CSS for it)
    hole.classList.add("whacked");

    // Remove the visual feedback after a short time
    setTimeout(function () {
      hole.classList.remove("whacked");
    }, 200);
  }
}

// Keyboard accessibility function - whack mole by hole number
function whackMoleByNumber(holeNumber) {
  // Check if the game is running
  if (!gameRunning) return;

  // Get the specific hole by index (holeNumber - 1 because arrays start at 0)
  const hole = holes[holeNumber - 1];

  // Check if this hole exists and has a mole that is currently up
  if (hole && hole.classList.contains("up")) {
    // Increase the score by 1 point
    score++;

    // Update the score display
    scoreDisplay.textContent = score;

    // Remove the mole immediately (hide it)
    hole.classList.remove("up");

    // Play whack sound
    playWhackSound();

    // Add visual feedback
    hole.classList.add("whacked");

    // Remove the visual feedback after a short time
    setTimeout(function () {
      hole.classList.remove("whacked");
    }, 200);
  }
}

// Keyboard event listener for accessibility
function handleKeyPress(event) {
  // Get the key that was pressed
  const key = event.key;

  // Check if it's a number key from 1 to 9
  if (key >= "1" && key <= "9") {
    // Convert the key to a number and whack that hole
    const holeNumber = parseInt(key);
    whackMoleByNumber(holeNumber);
  }

  // Allow spacebar or Enter to start the game
  if ((key === " " || key === "Enter") && !gameRunning) {
    // Prevent default behavior (like scrolling for spacebar)
    event.preventDefault();
    startGame();
  }
}

// Timer function to countdown the game time
function startTimer() {
  // Update timer display
  timerDisplay.textContent = timeLeft;

  // Start the countdown interval
  timerInterval = setInterval(function () {
    timeLeft--;
    timerDisplay.textContent = timeLeft;

    // Check if time is up
    if (timeLeft <= 0) {
      endGame();
    }
  }, 1000);
}

// End game function
function endGame() {
  // Stop the game
  gameRunning = false;

  // Clear the timer
  clearInterval(timerInterval);

  // Calculate accuracy percentage
  const accuracy = moleCount > 0 ? Math.round((score / moleCount) * 100) : 0;

  // Update final score display
  finalScoreDisplay.textContent = `Your Score: ${score}`;
  accuracyDisplay.textContent = `Accuracy: ${accuracy}%`;

  // Show game over screen
  gameOverScreen.classList.remove("hidden");

  // Re-enable start button
  startButton.disabled = false;
}

// Reset game function
function resetGame() {
  // Reset all game variables
  score = 0;
  timeLeft = 15;
  gameRunning = false;

  // Clear any running timer
  if (timerInterval) {
    clearInterval(timerInterval);
  }

  // Reset displays
  scoreDisplay.textContent = score;
  timerDisplay.textContent = timeLeft;

  // Hide game over screen
  gameOverScreen.classList.add("hidden");

  // Remove all moles from holes
  holes.forEach(function (hole) {
    hole.classList.remove("up");
    hole.classList.remove("whacked");
  });
}

// Modified start game function (this will work with the existing startGame in provided.js)
function startGameWithTimer() {
  // Reset the game first
  resetGame();

  // Start the timer
  startTimer();

  // Call the original startGame function
  startGame();
}

// Add keyboard event listener to the document
document.addEventListener("keydown", handleKeyPress);

// Event listeners
startButton.addEventListener("click", startGameWithTimer);
playAgainButton.addEventListener("click", startGameWithTimer);
initializeGame();
