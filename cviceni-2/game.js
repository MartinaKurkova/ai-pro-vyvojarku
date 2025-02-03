// Herní proměnné
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const boxSize = 20;
const canvasSize = 20;
canvas.width = canvasSize * boxSize;
canvas.height = canvasSize * boxSize;

// Menu a tlačítko Start
const menu = document.getElementById("menu");
const gameContainer = document.getElementById("gameContainer");
const startButton = document.getElementById("startButton");
const snakeColorSelect = document.getElementById("snakeColor");

// High score – načteme z LocalStorage
let highScore = localStorage.getItem("highScore") || 0;
document.getElementById("menuHighScore").innerText = highScore;
document.getElementById("highScore").innerText = highScore;

// Načteme vybranou barvu z LocalStorage
let snakeColor = localStorage.getItem("snakeColor") || "lime";
snakeColorSelect.value = snakeColor; // Nastavíme výchozí hodnotu v menu

// Had, jablko, skóre, čas
let snake = [{ x: 10, y: 10 }];
let direction = { x: 0, y: 0 };
let apple = { x: 5, y: 5 };
let score = 0;
let time = 0;
let timerInterval = null;
let gameInterval = null;

// Poslouchání kláves
document.addEventListener("keydown", changeDirection);

// Funkce pro spuštění hry
function startGame() {
    // Uložíme vybranou barvu hada
    snakeColor = snakeColorSelect.value;
    localStorage.setItem("snakeColor", snakeColor);

    menu.style.display = "none";
    gameContainer.style.display = "block";

    resetGame();
    gameInterval = setInterval(gameLoop, 100);
}

// Hlavní smyčka hry
function gameLoop() {
    moveSnake();
    if (checkCollision()) {
        clearInterval(timerInterval);
        clearInterval(gameInterval);

        if (snake.length > highScore) {
            highScore = snake.length;
            localStorage.setItem("highScore", highScore);
            document.getElementById("highScore").innerText = highScore;
            document.getElementById("menuHighScore").innerText = highScore;
        }

        alert("Konec hry! Skóre: " + score + "\nČas: " + time + " s\nNejlepší délka: " + highScore);
        menu.style.display = "block";
        gameContainer.style.display = "none";
    }
    drawGame();
}

// Pohyb hada
function moveSnake() {
    const newHead = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };

    if (direction.x !== 0 || direction.y !== 0) {
        snake.unshift(newHead);
        if (newHead.x === apple.x && newHead.y === apple.y) {
            score++;
            placeApple();
        } else {
            snake.pop();
        }
    }
}

// Kontrola kolize
function checkCollision() {
    if (snake[0].x < 0 || snake[0].y < 0 || 
        snake[0].x >= canvasSize || snake[0].y >= canvasSize) {
        return true;
    }
    for (let i = 1; i < snake.length; i++) {
        if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) {
            return true;
        }
    }
    return false;
}

// Kreslení hry
function drawGame() {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Had - použijeme vybranou barvu
    ctx.fillStyle = snakeColor;
    snake.forEach(part => {
        ctx.fillRect(part.x * boxSize, part.y * boxSize, boxSize, boxSize);
    });

    // Jablko
    ctx.fillStyle = "red";
    ctx.fillRect(apple.x * boxSize, apple.y * boxSize, boxSize, boxSize);
}

// Umístění jablka
function placeApple() {
    apple.x = Math.floor(Math.random() * canvasSize);
    apple.y = Math.floor(Math.random() * canvasSize);
}

// Ovládání hada
function changeDirection(event) {
    const key = event.key;
    if (key === "ArrowUp" && direction.y === 0) {
        direction = { x: 0, y: -1 };
    } else if (key === "ArrowDown" && direction.y === 0) {
        direction = { x: 0, y: 1 };
    } else if (key === "ArrowLeft" && direction.x === 0) {
        direction = { x: -1, y: 0 };
    } else if (key === "ArrowRight" && direction.x === 0) {
        direction = { x: 1, y: 0 };
    }

    if (timerInterval === null) {
        timerInterval = setInterval(updateTimer, 1000);
    }
}

// Aktualizace času
function updateTimer() {
    time++;
    document.getElementById("timer").innerText = time;
}

// Restart hry
function resetGame() {
    clearInterval(timerInterval);
    clearInterval(gameInterval);
    time = 0;
    document.getElementById("timer").innerText = time;
    snake = [{ x: 10, y: 10 }];
    direction = { x: 0, y: 0 };
    score = 0;
    timerInterval = null;
    gameInterval = null;
    placeApple();
}

// Kliknutí na tlačítko Start
startButton.addEventListener("click", startGame);
