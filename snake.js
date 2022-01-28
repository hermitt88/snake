const head = document.querySelector(".head");
const KEY_RIGHT = "ArrowRight"
const KEY_DOWM = "ArrowDown"
const KEY_LEFT = "ArrowLeft"
const KEY_UP = "ArrowUp"

function clearDirection(baba) {
    baba.classList.remove("right");
    baba.classList.remove("down");
    baba.classList.remove("left");
    baba.classList.remove("up");
}

function handleHeadMove(e) {
    switch (e.key) {
        case KEY_RIGHT:
            clearDirection(head);
            head.classList.add("right")
            break
        case KEY_DOWM:
            clearDirection(head);
            head.classList.add("down")
            break
        case KEY_LEFT:
            clearDirection(head);
            head.classList.add("left")
            break
        case KEY_UP:
            clearDirection(head);
            head.classList.add("up")
            break
    }
}


window.addEventListener("keydown", handleHeadMove);

