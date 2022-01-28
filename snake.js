const snake = document.querySelector(".snake");
const head = document.querySelector(".head");
const KEY_RIGHT = "ArrowRight"
const KEY_DOWN = "ArrowDown"
const KEY_LEFT = "ArrowLeft"
const KEY_UP = "ArrowUp"

const dx = 50;
const dy = 50;

function clearDirection(baba) {
    baba.classList.remove("right");
    baba.classList.remove("down");
    baba.classList.remove("left");
    baba.classList.remove("up");
}

function handleHeadMove(e) {
    switch (e.key) {
        case KEY_RIGHT:
            if (head.classList.contains("left") || head.classList.contains("right")) {
                break
            };
            clearDirection(head);
            head.classList.add("right")
            break
        case KEY_DOWN:
            if (head.classList.contains("up") || head.classList.contains("down")) {
                break
            };
            clearDirection(head);
            head.classList.add("down")
            break
        case KEY_LEFT:
            if (head.classList.contains("right") || head.classList.contains("left")) {
                break
            };
            clearDirection(head);
            head.classList.add("left")
            break
        case KEY_UP:
            if (head.classList.contains("down") || head.classList.contains("up")) {
                break
            };
            clearDirection(head);
            head.classList.add("up")
            break
    }
}

function snakeMove() {
    
}

setInterval(snakeMove, 1000);

window.addEventListener("keydown", handleHeadMove);

