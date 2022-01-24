const head = document.getElementById("head");
const KEY_RIGHT = "ArrowRight"
const KEY_DOWM = "ArrowDown"
const KEY_LEFT = "ArrowLeft"
const KEY_UP = "ArrowUp"
function handleHeadMove(e) {
    switch (e.key) {
        case KEY_RIGHT:
            head.innerText = "→";
            break
        case KEY_DOWM:
            head.innerText = "↓";
            break
        case KEY_LEFT:
            head.innerText = "←";
            break
        case KEY_UP:
            head.innerText = "↑";
            break
    }
}


window.addEventListener("keydown", handleHeadMove);

