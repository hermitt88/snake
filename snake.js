const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 400;
canvas.height = 400;
const canvasW = canvas.width;
const canvasH = canvas.height;

const KEY_RIGHT = "ArrowRight"
const KEY_DOWN = "ArrowDown"
const KEY_LEFT = "ArrowLeft"
const KEY_UP = "ArrowUp"

const gap = 20;

const form = document.querySelector("form");

let snake = [[180, 180]];
let x = 180;
let y = 180;
let snakeInterval = 300;
let direction = "right";
ctx.fillStyle = "green";
paintSnakeBlock(x, y);

window.onload = snakeGame();

function snakeGame() {
    setInterval(moveSnake, snakeInterval);
}

function moveSnake() {
    if (x >= 0 && y >= 0 && x <= canvasW - gap && y <= canvasH - gap) {
        removeSnakeBlock(x, y);
        switch (direction) {
            case "right":
                x += gap;
                paintSnakeBlock(x, y);
                break
            case "down":
                y += gap;
                paintSnakeBlock(x, y);
                break
            case "left":
                x -= gap;
                paintSnakeBlock(x, y);
                break
            case "up":
                y -= gap;
                paintSnakeBlock(x, y);
                break
        }
    } else {
        clearInterval(moveSnake);
    }

}

function initialSetting() {
    ctx.fillStyle = "green";
    x = 180;
    y = 180;
    direction = "right";
    paintSnakeBlock(x, y);
}

function paintSnakeBlock(x, y) {
    ctx.fillRect(x+1, y+1, gap-2, gap-2);
}

function removeSnakeBlock(x, y) {
    ctx.clearRect(x+1, y+1, gap-2, gap-2);
}

function handleClear(e) {
    e.preventDefault();
    ctx.clearRect(0, 0, canvasW, canvasH);
    initialSetting();
}

form.addEventListener("submit", handleClear);

window.addEventListener("keydown", handleHeadMove);

function handleHeadMove(e) {
    switch (e.key) {
        case KEY_RIGHT:
            if (direction !== "left") {
                direction = "right";
            }
            break
        case KEY_DOWN:
            if (direction !== "up") {
                direction = "down";
            }
            break
        case KEY_LEFT:
            if (direction !== "right") {
                direction = "left";
            }
            break
        case KEY_UP:
            if (direction !== "down") {
                direction = "up";
            }
            break
    }
}

// function snakeMove() {
    
// }

// setInterval(snakeMove, 1000);


