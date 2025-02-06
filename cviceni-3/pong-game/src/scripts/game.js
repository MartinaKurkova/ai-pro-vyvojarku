// Get DOM elements
const menu = document.getElementById('menu');
const canvas = document.getElementById('pong');
const context = canvas.getContext('2d');
const singlePlayerButton = document.getElementById('singlePlayerButton');
const multiPlayerButton = document.getElementById('multiPlayerButton');

// Add DOMContentLoaded event to ensure elements are loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize game
    canvas.width = 800;
    canvas.height = 400;

    // Add menu listeners
    singlePlayerButton.addEventListener('click', () => startGame('singleplayer'));
    multiPlayerButton.addEventListener('click', () => startGame('multiplayer'));
});

// Paddle properties
const paddleWidth = 10;
const paddleHeight = 100;
const playerPaddle = {
    x: 0,
    y: canvas.height / 2 - paddleHeight / 2,
    width: paddleWidth,
    height: paddleHeight,
    color: '#ff6b6b',
    score: 0,
    speed: 5
};

const computerPaddle = {
    x: canvas.width - paddleWidth,
    y: canvas.height / 2 - paddleHeight / 2,
    width: paddleWidth,
    height: paddleHeight,
    color: '#5f27cd',
    score: 0,
    speed: 4
};

// Ball properties
const ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: 5,
    baseSpeed: 7,
    speed: 7,
    dx: 5,
    dy: 5,
    color: '#52b3ff',
    hits: 0
};

// Game controls
let upPressed = false;
let downPressed = false;
let wPressed = false;
let sPressed = false;
let isMultiPlayer = false;

// Event listeners for paddle movement
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowUp') upPressed = true;
    if (e.key === 'ArrowDown') downPressed = true;
    if (e.key === 'w' || e.key === 'W') wPressed = true;
    if (e.key === 's' || e.key === 'S') sPressed = true;
});

document.addEventListener('keyup', (e) => {
    if (e.key === 'ArrowUp') upPressed = false;
    if (e.key === 'ArrowDown') downPressed = false;
    if (e.key === 'w' || e.key === 'W') wPressed = false;
    if (e.key === 's' || e.key === 'S') sPressed = false;
});

// Reset ball function
function resetBall() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.dx = (Math.random() > 0.5 ? 1 : -1) * ball.baseSpeed;
    ball.dy = (Math.random() * 2 - 1) * ball.baseSpeed;
    ball.speed = ball.baseSpeed;
    ball.hits = 0;
}

// Start game function
function startGame(mode) {
    isMultiPlayer = mode === 'multiplayer';
    menu.style.display = 'none';
    canvas.style.display = 'block';
    resetGame();
    gameLoop();
}

// Reset game function
function resetGame() {
    playerPaddle.score = 0;
    computerPaddle.score = 0;
    resetBall();
}

// Draw functions
function drawPaddle(paddle) {
    context.fillStyle = paddle.color;
    context.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
}

function drawBall() {
    context.beginPath();
    context.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    context.fillStyle = ball.color;
    context.fill();
    context.closePath();
}

// Update score drawing
function drawScore() {
    context.fillStyle = '#fff';
    context.font = 'bold 32px Segoe UI';
    context.textAlign = 'center';
    
    // Draw dividing line
    context.beginPath();
    context.setLineDash([5, 15]);
    context.moveTo(canvas.width / 2, 0);
    context.lineTo(canvas.width / 2, canvas.height);
    context.strokeStyle = 'white';
    context.stroke();
    context.setLineDash([]);
    
    // Draw scores
    context.fillText(playerPaddle.score, canvas.width / 4, 50);
    context.fillText(computerPaddle.score, 3 * canvas.width / 4, 50);
}

// Update game state
function update() {
    // Player 1 paddle movement
    if (upPressed && playerPaddle.y > 0) {
        playerPaddle.y -= playerPaddle.speed;
    }
    if (downPressed && playerPaddle.y + playerPaddle.height < canvas.height) {
        playerPaddle.y += playerPaddle.speed;
    }

    // Handle second paddle movement based on game mode
    if (isMultiPlayer) {
        // Player 2 controls
        if (wPressed && computerPaddle.y > 0) {
            computerPaddle.y -= computerPaddle.speed;
        }
        if (sPressed && computerPaddle.y + computerPaddle.height < canvas.height) {
            computerPaddle.y += computerPaddle.speed;
        }
    } else {
        // AI movement
        const computerCenter = computerPaddle.y + computerPaddle.height / 2;
        if (computerCenter < ball.y - 35) {
            computerPaddle.y += computerPaddle.speed;
        } else if (computerCenter > ball.y + 35) {
            computerPaddle.y -= computerPaddle.speed;
        }
    }

    // Ball movement
    ball.x += ball.dx;
    ball.y += ball.dy;

    // Ball collision with top and bottom
    if (ball.y + ball.radius > canvas.height || ball.y - ball.radius < 0) {
        ball.dy = -ball.dy;
    }

    // Ball collision with paddles
    if (ball.dx < 0 && ball.x - ball.radius < playerPaddle.x + playerPaddle.width &&
        ball.y > playerPaddle.y && ball.y < playerPaddle.y + playerPaddle.height) {
        ball.dx = -ball.dx;
        ball.hits++;
        increaseDifficulty();
    }

    if (ball.dx > 0 && ball.x + ball.radius > computerPaddle.x &&
        ball.y > computerPaddle.y && ball.y < computerPaddle.y + computerPaddle.height) {
        ball.dx = -ball.dx;
        ball.hits++;
        increaseDifficulty();
    }

    // Score points
    if (ball.x + ball.radius > canvas.width) {
        playerPaddle.score++;
        resetBall();
    } else if (ball.x - ball.radius < 0) {
        computerPaddle.score++;
        resetBall();
    }
}

// Add difficulty increase function
function increaseDifficulty() {
    const maxSpeedIncrease = 5;
    const speedIncrease = Math.min(ball.hits * 0.5, maxSpeedIncrease);
    ball.speed = ball.baseSpeed + speedIncrease;
    
    // Update ball velocity while maintaining direction
    const angle = Math.atan2(ball.dy, ball.dx);
    ball.dx = Math.cos(angle) * ball.speed;
    ball.dy = Math.sin(angle) * ball.speed;
    
    // Increase computer difficulty
    computerPaddle.speed = 4 + (ball.hits * 0.2);
}

// Update draw function to show current speed
function drawStats() {
    context.fillStyle = 'rgba(255, 255, 255, 0.5)';
    context.font = '16px Segoe UI';
    context.fillText(`Speed: ${Math.round(ball.speed)}`, 10, 20);
    context.fillText(`Rally: ${ball.hits}`, 10, 40);
}

// Game loop
function gameLoop() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    
    drawScore();
    drawPaddle(playerPaddle);
    drawPaddle(computerPaddle);
    drawBall();
    drawStats();
    
    update();
    
    requestAnimationFrame(gameLoop);
}