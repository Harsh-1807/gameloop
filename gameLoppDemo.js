// game.js
class NumberGame {
    constructor() {
        this.targetNumber = 0;
        this.timeLeft = 30;
        this.isGameRunning = false;
        this.highScore = localStorage.getItem('highScore') || 0;
        this.animationFrameId = null;
        this.lastTimestamp = 0;
        
        // DOM elements
        this.startButton = document.getElementById('start-button');
        this.gameArea = document.getElementById('game-area');
        this.timerDisplay = document.getElementById('timer');
        this.guessButton = document.getElementById('guess-button');
        this.numberInput = document.getElementById('number-input');
        this.messageDisplay = document.getElementById('message');
        this.highScoreDisplay = document.getElementById('high-score');
        
        // Bind methods
        this.startGame = this.startGame.bind(this);
        this.gameLoop = this.gameLoop.bind(this);
        this.makeGuess = this.makeGuess.bind(this);
        this.updateHighScore = this.updateHighScore.bind(this);
        
        // Initialize event listeners
        this.initializeEventListeners();
        this.displayHighScore();
    }

    initializeEventListeners() {
        this.startButton.addEventListener('click', this.startGame);
        this.guessButton.addEventListener('click', this.makeGuess);
        this.numberInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.makeGuess();
        });
    }

    startGame() {
        this.targetNumber = Math.floor(Math.random() * 100) + 1;
        this.timeLeft = 30;
        this.isGameRunning = true;
        this.gameArea.style.display = 'block';
        this.startButton.style.display = 'none';
        this.messageDisplay.textContent = '';
        this.numberInput.value = '';
        this.numberInput.focus();
        
        // Start the game loop
        this.lastTimestamp = performance.now();
        this.animationFrameId = requestAnimationFrame(this.gameLoop);
    }

    async gameLoop(timestamp) {
        if (!this.isGameRunning) return;

        // Calculate delta time in seconds
        const deltaTime = (timestamp - this.lastTimestamp) / 1000;
        this.lastTimestamp = timestamp;

        // Update timer
        this.timeLeft = Math.max(0, this.timeLeft - deltaTime);
        this.timerDisplay.textContent = Math.ceil(this.timeLeft);

        // Check if time's up
        if (this.timeLeft <= 0) {
            this.endGame(false);
            return;
        }

        // Continue the loop
        this.animationFrameId = requestAnimationFrame(this.gameLoop);
    }

    async makeGuess() {
        if (!this.isGameRunning) return;

        const guess = parseInt(this.numberInput.value);
        if (isNaN(guess) || guess < 1 || guess > 100) {
            this.messageDisplay.textContent = 'Please enter a valid number between 1 and 100';
            return;
        }

        if (guess === this.targetNumber) {
            this.endGame(true);
        } else {
            const hint = guess < this.targetNumber ? 'higher' : 'lower';
            this.messageDisplay.textContent = `Try ${hint}!`;
            this.numberInput.value = '';
            this.numberInput.focus();
        }
    }

    endGame(won) {
        this.isGameRunning = false;
        cancelAnimationFrame(this.animationFrameId);
        
        if (won) {
            const score = Math.ceil(this.timeLeft);
            this.messageDisplay.textContent = `Congratulations! You won with ${score} seconds left!`;
            this.updateHighScore(score);
        } else {
            this.messageDisplay.textContent = `Time's up! The number was ${this.targetNumber}`;
        }

        this.startButton.style.display = 'block';
        this.startButton.textContent = 'Play Again';
    }

    updateHighScore(score) {
        if (score > this.highScore) {
            this.highScore = score;
            localStorage.setItem('highScore', score);
            this.displayHighScore();
        }
    }

    displayHighScore() {
        this.highScoreDisplay.textContent = this.highScore;
    }
}

// Initialize the game
const game = new NumberGame();