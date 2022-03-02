const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

document.body.style.overflow = "hidden";

canvas.width = Math.min(window.innerWidth, window.innerHeight, 550);
canvas.height = canvas.width;
const canvasW = canvas.width;
const canvasH = canvas.height;

const KEY_RIGHT = "ArrowRight"
const KEY_DOWN = "ArrowDown"
const KEY_LEFT = "ArrowLeft"
const KEY_UP = "ArrowUp"

const boardColor1 = "hsl(44, 40%, 88%)";
const boardColor2 = "hsl(44, 40%, 80%)";
const snakeColor = "green";
const appleColor = "#ff0800";

let pointsPerLine;
let gap;
let gameboardW, gameboardH;


let snakeLength, timerZero, snakeMoved, snakeTurned;
const writeLength = document.querySelector(".snakeLength");
const writeTime = document.querySelector(".snakeTime");
const writeMoved = document.querySelector(".snakeMoved");
const writeTurned = document.querySelector(".snakeTurned");

const retryForm = document.querySelector(".retryForm");

let timeoutId, intervalId;
let snake, apple;
let headX, headY;
let snakeInterval, snakeAccel, snakeMaximum;
let lengthGoal;
const setSnakeInterval = document.querySelector(".setSnakeInterval");
const intervalForm = document.querySelector(".intervalForm");
intervalForm.addEventListener("submit", function (e) {e.preventDefault()});
const goalForm = document.querySelector(".goalForm");
goalForm.addEventListener("submit", function (e) {e.preventDefault()});
const appleForm = document.querySelector(".appleForm");
appleForm.addEventListener("submit", function (e) {e.preventDefault()});
const mapsizeForm = document.querySelector(".mapsizeForm");
mapsizeForm.addEventListener("submit", function (e) {e.preventDefault()});
const setMapsize = document.querySelector(".setMapsize");
const setLengthGoal = document.querySelector(".setLengthGoal");
const setApple = document.querySelector(".setApple");
let applesInGame;
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

function putApple() {
    while (apple.length < applesInGame){
        pickApple = [Math.floor(Math.random() * pointsPerLine), Math.floor(Math.random() * pointsPerLine)];
        while (JSON.stringify([...snake, ...apple]).includes(JSON.stringify(pickApple))) {
            pickApple = [Math.floor(Math.random() * pointsPerLine), Math.floor(Math.random() * pointsPerLine)];
        };
        paintBlock(pickApple[0], pickApple[1], appleColor);
        apple.push(pickApple);
        pickApple = [];
    }
}

function snakeGame() {
    timeoutId = setTimeout(moveSnake, snakeInterval);
}

function determineDirection () {
    if (directionTemp.length != 0) {
        let newDirection = directionTemp.shift();
        if ((direction == "right" && newDirection != "left" && newDirection != "right") 
        || (direction == "down" && newDirection != "up" && newDirection != "down") 
        || (direction == "left" && newDirection != "right" && newDirection != "left") 
        || (direction == "up" && newDirection != "down" && newDirection != "up")) {
            direction = newDirection;
            snakeTurned += 1;
            writeTurned.innerText = `Turned: ${snakeTurned}`;
        }
    }
}

function moveSnake() {
    determineDirection();
    headX = snake[0][0];
    headY = snake[0][1];
    switch (direction) {
        case "right":
            headX += 1;
            break
        case "down":
            headY += 1;
            break
        case "left":
            headX -= 1;
            break
        case "up":
            headY -= 1;
            break
    }
    if (JSON.stringify(snake).includes(JSON.stringify([headX, headY]), 1) || headX<0 || headY<0 || headX>pointsPerLine-1 ||headY>pointsPerLine-1) {
        gameOver();
    } else {
        paintBlock(headX, headY, snakeColor);
        snake.unshift([headX, headY]);
        snakeMoved += 1;
        writeMoved.innerText = `Moved: ${snakeMoved}`;
        if (JSON.stringify(apple).includes(JSON.stringify(snake[0]))) {
            snakeLength += 1;
            writeLength.innerText = ` Snake Length: ${snakeLength}`;
            if (snakeLength == lengthGoal) {
                gameClear();
            } else {
                for (let i = 0; i < apple.length; i++) {
                    if (JSON.stringify(apple[i]) == JSON.stringify(snake[0])) {
                        apple.splice(i, 1);
                        break
                    }
                };
                snakeInterval = Math.max(snakeInterval*snakeAccel, snakeMaximum);
                putApple();
                snakeGame();
            }
        } else {
            removeSnakeTail();
            snakeGame();
        }
    }
}

function setSnakeGame() {
    if(setMapsize.value) {
        pointsPerLine = Math.max(parseInt(setMapsize.value), 11);
    } else {
        pointsPerLine = 19;
    };
    gap = Math.ceil(canvas.width / (pointsPerLine + 2));
    gameboardW = gap * pointsPerLine;
    gameboardH = gap * pointsPerLine;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.fillStyle = "#964b00";
    ctx.fillRect(0, 0, canvasW, canvasH);
    ctx.translate(Math.floor(0.5*(canvasW - gameboardW)), Math.floor(0.5*(canvasH - gameboardH)));
    for (let i=0; i<pointsPerLine; i++) {
        for (let j=0; j<pointsPerLine; j++) {
            if ((i+j) % 2 == 0) {
                ctx.fillStyle = boardColor1;
            } else {
                ctx.fillStyle = boardColor2;
            };
            ctx.fillRect(i*gap, j*gap, gap, gap);
        }
    };
    let startingPos = Math.floor(pointsPerLine / 3);
    snake = [[startingPos, startingPos], [startingPos-1, startingPos], [startingPos-2, startingPos]];
    if (setSnakeInterval.value) {
        snakeInterval = parseInt(setSnakeInterval.value);
    } else {snakeInterval = 200;};
    snakeAccel = 0.97;
    snakeMaximum = snakeInterval*0.5;
    if (setLengthGoal.value) {
        lengthGoal = Math.max(parseInt(setLengthGoal.value), pointsPerLine*pointsPerLine);
    } else {lengthGoal = 30;};
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
        paintBlock(headX, headY, snakeColor);
    };
    if (setApple.value) {
        applesInGame = parseInt(setApple.value);
    } else {
        applesInGame = 3;
    }
    apple = [];
    putApple();
    intervalForm.hidden = true;
    goalForm.hidden = true;
    appleForm.hidden = true;
    mapsizeForm.hidden = true;
    retryForm.hidden = true;
    snakeGame();
}

function gameOver() {
    clearTimeout(timeoutId);
    clearInterval(intervalId);
    for (let i = 0; i < snake.length; i++) {
        setTimeout(() => {
            ctx.fillStyle = "hsl(0, 0%, " + Math.round(100*(1 - i/(snake.length - 1))).toString() + "%)";
            ctx.fillRect(Math.round((0.075+snake[i][0])*gap), Math.round((0.075+snake[i][1])*gap), Math.round(0.85*gap), Math.round(0.85*gap));}, 100*i);
        };
    intervalForm.hidden = false;
    goalForm.hidden = false;
    appleForm.hidden = false;
    mapsizeForm.hidden = false;
    retryForm.hidden = false;
}

function gameClear() {
    clearTimeout(timeoutId);
    clearInterval(intervalId);
    for (let i = 0; i < snake.length; i++) {
        setTimeout(() => {
            ctx.fillStyle = "hsl(" + Math.round(320*i/(snake.length - 1)).toString() + ", 100%, 50%)";
            ctx.fillRect(Math.round((0.075+snake[i][0])*gap), Math.round((0.075+snake[i][1])*gap), Math.round(0.85*gap), Math.round(0.85*gap));}, 100*i);
        };
    intervalForm.hidden = false;
    goalForm.hidden = false;
    appleForm.hidden = false;
    mapsizeForm.hidden = false;
    retryForm.hidden = false;
}

function paintBlock(x, y, color) {
    ctx.fillStyle = color;
    ctx.fillRect(Math.round((0.075+x)*gap), Math.round((0.075+y)*gap), Math.round(0.85*gap), Math.round(0.85*gap));
}


function removeSnakeTail() {
    const snakeTail = snake.pop();
    if ((snakeTail[0]+snakeTail[1]) % 2 == 0) {
        ctx.fillStyle = boardColor1;
    } else {
        ctx.fillStyle = boardColor2;
    };
    ctx.fillRect(snakeTail[0]*gap, snakeTail[1]*gap, gap, gap);
}

function handleRetryBtn(e) {
    e.preventDefault();
    clearTimeout(timeoutId);
    ctx.clearRect(0, 0, gameboardW, gameboardH);
    setSnakeGame();
}

function timer() {
    const date = new Date();
    const seconds = parseInt((date.getTime() - timerZero)/1000);
    writeTime.innerText = `Survived: ${seconds >= 60 ? `${parseInt(seconds / 60)}m ${seconds % 60}s` : `${seconds % 60}s`}`;
}

retryForm.addEventListener("submit", handleRetryBtn);

window.addEventListener("keydown", changeDirection);

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