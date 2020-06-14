const configuration = {
    shipSpeed: 5
}

var gamePieces;

var gameArea = {
    canvas: document.createElement("canvas"),
    start: function () {
        this.canvas.width = 1280;
        this.canvas.height = 800;
        this.canvas.style = "border:1px solid #000000;";
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.interval = setInterval(gameLoop, 20);
    },
    clear: function () {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },
    keysPressed: {
        left: false,
        right: false,
        shoot: false
    }
}

function buildGamePieces() {
    const ship = buildShip();
    const fallingBlock = new component(30, 30, "red", 10, 120);
    fallingBlock.move = function () {
        this.y += 1;
    }
    return [ship, fallingBlock];
}

function buildShip() {
    const sizeOfShip = { height: 30, width: 50 };
    const gapFromBottom = 10;
    const nearBottomOfScreen = gameArea.canvas.height - (sizeOfShip.height + gapFromBottom);
    const shipMiddleOfScreen = (gameArea.canvas.width / 2) - (sizeOfShip.width / 2);
    const ship = new component(sizeOfShip.width, sizeOfShip.height, "yellow", shipMiddleOfScreen, nearBottomOfScreen);
    ship.direction = 0;
    ship.move = function () {
        ship.x += ship.direction;
    }
    return ship;
}

function startGame() {
    addDocumentEventListeners();
    gameArea.start();
    gamePieces = buildGamePieces();
}

function component(width, height, color, x, y) {
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;
    this.update = function () {
        ctx = gameArea.context;
        ctx.fillStyle = color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
    this.move = function () {
        this.x += 1;
    }
}

/*
Document event listener listens to the HTML document for keyboard input
*/
function addDocumentEventListeners() {
    document.addEventListener('keydown', event => {
        if (event.keyCode == 37) {
            gameArea.keysPressed.left = true;
        } else if (event.keyCode == 39) {
            gameArea.keysPressed.right = true;
        }
    });

    document.addEventListener('keyup', event => {
        if (event.keyCode == 37) {
            gameArea.keysPressed.left = false;
        } else if (event.keyCode == 39) {
            gameArea.keysPressed.right = false;;
        }
    });
}

function handleInput(keysPressed) {
    const ship = gamePieces[0];
    ship.direction = 0;
    if (keysPressed.left) {
        ship.direction = -1 * configuration.shipSpeed;
    } else if (keysPressed.right) {
        ship.direction = 1 * configuration.shipSpeed;
    }
}

function gameLoop() {
    gameArea.clear();
    handleInput(gameArea.keysPressed);
    gamePieces.forEach(eachPiece => { eachPiece.move(); eachPiece.update(); })
}

startGame();