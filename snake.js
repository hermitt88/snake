const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

document.body.style.overflow = "hidden";

canvas.width = 360; // Multiples of "20"
canvas.height = 360;
const canvasW = canvas.width;
const canvasH = canvas.height;

// ctx.translate(x, y); 원점 이동
// save() restore()

const KEY_RIGHT = "ArrowRight"
const KEY_DOWN = "ArrowDown"
const KEY_LEFT = "ArrowLeft"
const KEY_UP = "ArrowUp"

const pointsX = 20;
const pointsY = 20;
const gap = canvas.width / pointsX;
let snakeLength = 3;
const writeLength = document.querySelector(".snakeLength");
let timerZero;
const writeTime = document.querySelector(".snakeTime");
let snakeMoved = 0;
const writeMoved = document.querySelector(".snakeMoved");
let snakeTurned = 0;
const writeTurned = document.querySelector(".snakeTurned");

const form = document.querySelector("form");

let timeoutId, intervalId;

let snake = [[10 * gap, 9 * gap], [9 * gap, 9 * gap], [8 * gap, 9 * gap]];
let apple = [];
let headX, headY;
let snakeInterval, snakeAccel;
let direction, directionTemp;
let directions = [KEY_RIGHT, KEY_DOWN, KEY_LEFT, KEY_UP]
setSnakeGame();

let touchstartX, touchstartY, touchendX, touchendY;

window.addEventListener('touchstart', function(event) {
    touchstartX = event.changedTouches[0].screenX;
    touchstartY = event.changedTouches[0].screenY;
}, false);

window.addEventListener('touchend', function(event) {
    touchendX = event.changedTouches[0].screenX;
    touchendY = event.changedTouches[0].screenY;
    handleGesure();
}, false); 

function handleGesure() {
    let lastKey;
    let swipeX = touchendX - touchstartX;
    let swipeY = touchendY - touchstartY;
    if (Math.abs(swipeX) > Math.abs(swipeY)) {
        if (swipeX > 0) {
            lastKey = "right";
        } else {
            lastKey = "left";
        }
    } else {
        if (swipeY > 0) {
            lastKey = "down";
        } else {
            lastKey = "up";
        }
    }
    if (directionTemp.length == 0 || lastKey != directionTemp[directionTemp.length-1]) {
        directionTemp = directionTemp.slice(-2).concat(lastKey);
    }
}


// ctx.strokeStyle = "#964b00";
// ctx.lineWidth = 5;

function putApple() {
    while (apple.length === 0 || JSON.stringify(snake).includes(JSON.stringify(apple))) {
        apple = [Math.floor(Math.random() * 20) * gap, Math.floor(Math.random() * 20) * gap];
    }
    paintAppleBlock(apple[0], apple[1]);
}

function snakeGame() {
    timeoutId = setTimeout(moveSnake, snakeInterval);
}

function moveSnake() {
    headX = snake[0][0];
    headY = snake[0][1];
    if (directionTemp.length != 0) {
        let newDirection = directionTemp.shift();
        if (direction == "right" && newDirection != "left" && newDirection != "right") {direction = newDirection}
        if (direction == "down" && newDirection != "up" && newDirection != "down") {direction = newDirection}
        if (direction == "left" && newDirection != "right" && newDirection != "left") {direction = newDirection}
        if (direction == "up" && newDirection != "down" && newDirection != "up") {direction = newDirection}
        snakeTurned += 1;
        writeTurned.innerText = `Turned: ${snakeTurned}`;
    }
    switch (direction) {
        case "right":
            headX += gap;
            break
        case "down":
            headY += gap;
            break
        case "left":
            headX -= gap;
            break
        case "up":
            headY -= gap;
            break
    }
    if (JSON.stringify(snake).includes(JSON.stringify([headX, headY]), 1) || headX<0 || headY<0 || headX>canvasW-gap ||headY>canvasH-gap) {
        gameOver();
    } else {
        paintSnakeBlock(headX, headY);
        snake.unshift([headX, headY]);
        if (JSON.stringify(apple) == JSON.stringify(snake[0])) {
            apple = [];
            putApple();
            snakeInterval = Math.max(snakeInterval * snakeAccel, 150);
            snakeLength += 1;
            writeLength.innerText = ` Snake Length: ${snakeLength}`;
        } else {
            removeSnakeTail();
        }
        snakeMoved += 1;
        writeMoved.innerText = `Moved: ${snakeMoved}`;
        snakeGame();
    }
}

function setSnakeGame() {
    ctx.fillStyle = "#ebc292";
    ctx.fillRect(0, 0, canvasW, canvasH);
    snake = [[10 * gap, 9 * gap], [9 * gap, 9 * gap], [8 * gap, 9 * gap]];
    snakeInterval = 300;
    snakeAccel = 0.9;
    direction = "right";
    directionTemp = [];
    snakeLength = 3;
    writeLength.innerText = `Snake Length: ${snakeLength}`;
    const date = new Date();
    timerZero = date.getTime();
    snakeTime = "0s";
    intervalId = setInterval(timer, 1000);
    writeTime.innerText = `Survived: ${snakeTime}`;
    snakeMoved = 0;
    writeMoved.innerText = `Moved: ${snakeMoved}`;
    snakeTurned = 0;
    writeTurned.innerText = `Turned: ${snakeTurned}`;
    for (let block of snake) {
        headX = block[0];
        headY = block[1];
        paintSnakeBlock(headX, headY);
    }
    apple = [];
    putApple();
    snakeGame();
}

function gameOver() {
    clearTimeout(timeoutId);
    clearInterval(intervalId);
    for (let i = 0; i < snake.length; i++) {
        setTimeout(() => {
            ctx.fillStyle = "#" + (238 + Math.round(i*153/(1-snake.length))).toString(16).repeat(3);
            ctx.fillRect(snake[i][0]+1, snake[i][1]+1, gap-2, gap-2);}, 100*i);
        }
}

function paintSnakeBlock(x, y) {
    ctx.fillStyle = "green";
    ctx.fillRect(x+1, y+1, gap-2, gap-2);
}

function paintAppleBlock() {
    ctx.fillStyle = "#ff0800";
    ctx.fillRect(apple[0]+1, apple[1]+1, gap-2, gap-2);
}

function removeSnakeTail() {
    const snakeTail = snake.pop();
    ctx.fillStyle = "#ebc292";
    ctx.fillRect(snakeTail[0]+1, snakeTail[1]+1, gap-2, gap-2);
}

function handleRetryBtn(e) {
    e.preventDefault();
    clearTimeout(timeoutId);
    ctx.clearRect(0, 0, canvasW, canvasH);
    setSnakeGame();
}

function timer() {
    const date = new Date();
    const seconds = parseInt((date.getTime() - timerZero)/1000);
    writeTime.innerText = `Survived: ${seconds >= 60 ? `${parseInt(seconds / 60)}m ${seconds % 60}s` : `${seconds % 60}s`}`;
}

form.addEventListener("submit", handleRetryBtn);

window.addEventListener("keydown", changeDirection);

function sleep(ms) {
    const wakeUpTime = Date.now() + ms;
    while (Date.now() < wakeUpTime) {}
}

function changeDirection(e) {
    let lastKey = e.key;
    if (directions.includes(lastKey)) {
        switch (lastKey) {
            case KEY_RIGHT:
                lastKey = "right";
                break
            case KEY_DOWN:
                lastKey = "down";
                break
            case KEY_LEFT:
                lastKey = "left";
                break
            case KEY_UP:
                lastKey = "up";
                break
            }
        if (directionTemp.length == 0 || lastKey != directionTemp[directionTemp.length-1]) {
            directionTemp = directionTemp.slice(-2).concat(lastKey);
        }
    }
}