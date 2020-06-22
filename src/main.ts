const configuration = {
    shipSpeed: 5,
    shotSpeed: 15,
}

interface GameArea {
    gamePieces: component[],
    canvas: HTMLCanvasElement,
    context,
    start: () => void,
    clear: () => void,
    keysPressed: {
        left: boolean,
        right: boolean,
        shoot: boolean
    }
}

const gameArea: GameArea = {
    gamePieces: [],
    canvas: document.createElement("canvas"),
    context: null,
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

function buildFallingBlocks(gamePieces, numberOfBlocks) {
    const blockSize = 30;
    const locations = new Set();
    for(let i = 0; i < numberOfBlocks; i++) {
        var nextX = getRandomInt(5, gameArea.canvas.width - blockSize - 5);
        nextX = nextX - (nextX % (blockSize + 5));
        locations.add(nextX)
    }
    console.log('Adding ' + numberOfBlocks + ' blocks.', locations);
    locations.forEach(each => gameArea.gamePieces.push(buildFallingBlock(blockSize, each)));
    setTimeout(buildFallingBlocks, 5000, gameArea.gamePieces, getRandomInt(1,5));
}

function buildFallingBlock(blockSize, x) {
    const fallingBlock = new component(blockSize, blockSize, "red", x, 0);
    fallingBlock.move = function () {
        this.y += 1;
    }
    return fallingBlock;
}

function buildGamePieces(gamePieces) {
    const ship = buildShip();
    gamePieces.push(ship);
    buildFallingBlocks(gameArea.gamePieces, getRandomInt(1,5));
}

function buildShip() {
    const sizeOfShip = { height: 30, width: 50 };
    const gapFromBottom = 10;
    const nearBottomOfScreen = gameArea.canvas.height - (sizeOfShip.height + gapFromBottom);
    const shipMiddleOfScreen = (gameArea.canvas.width / 2) - (sizeOfShip.width / 2);
    const ship = new component(sizeOfShip.width, sizeOfShip.height, 
        "media/sprites/spaceship.png", shipMiddleOfScreen, nearBottomOfScreen, 'image');
    ship.direction = 0;
    ship.move = function () {
        const newX = ship.x + ship.direction;
        if(newX > 5 && newX + ship.width < gameArea.canvas.width - 5) {
            ship.x = newX;
        }
    }
    return ship;
}

function buildShot() {
    const ship = getShipComponent();
    const middleOfShip = (ship.x + (ship.width / 2));
    const shot = new component(5, 25, 'blue', middleOfShip - 2, gameArea.canvas.height - 50);
    shot.isShot = true;
    shot.move = function(){
        this.y -= configuration.shotSpeed;
    }
    return shot;
}

function startGame() {
    addDocumentEventListeners();
    gameArea.start();
    buildGamePieces(gameArea.gamePieces);
}

function componentOutOfBounds(component) {
    return component.x > gameArea.canvas.width 
    || component.x + component.width < 0
    || component.y > gameArea.canvas.height 
    || component.y + component.height < 0;
}

function destroyComponent(component) {
    gameArea.gamePieces = gameArea.gamePieces.filter(it => it !== component);
}

class component {
    type: string;
    image: HTMLImageElement;
    width: number;
    height: number;
    x:number;
    y:number;
    direction: number = 0;
    isShot: boolean = false;
    nameOrColor: string;

    constructor(width: number, height: number, nameOrColor: string, x:number, y:number, type: string = 'color') {
        this.type = type;
        if (this.type === 'image') {
            this.image = new Image();
            this.image.src = nameOrColor;
        } else {
            this.nameOrColor = nameOrColor;
        }
        this.width = width;
        this.height = height;
        this.x = x;
        this.y = y;
    }

    update = () => {
        const ctx = gameArea.context;
        if (componentOutOfBounds(this)) {
            destroyComponent(this);
        } else if (this.type === 'image') {
            ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
        } else {
            ctx.fillStyle = this.nameOrColor;
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    }

    move = () => {
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
        } else if (event.keyCode == 32) {
            gameArea.keysPressed.shoot = true;
        } else {
            console.log('Keycode ', event.keyCode);
        }
    });

    document.addEventListener('keyup', event => {
        if (event.keyCode == 37) {
            gameArea.keysPressed.left = false;
        } else if (event.keyCode == 39) {
            gameArea.keysPressed.right = false;;
        } else if (event.keyCode == 32) {
            gameArea.keysPressed.shoot = false;;
        }
    });
}

function handleInput(keysPressed) {
    const ship = getShipComponent();
    ship.direction = 0;
    if (keysPressed.left) {
        ship.direction = -1 * configuration.shipSpeed;
    } else if (keysPressed.right) {
        ship.direction = 1 * configuration.shipSpeed;
    } else if (keysPressed.shoot) {
        keysPressed.shoot = false;
        gameArea.gamePieces.push(buildShot());
    }
}

function getShipComponent() {
    return gameArea.gamePieces[0];
}

function gameLoop() {
    gameArea.clear();
    handleInput(gameArea.keysPressed);
    gameArea.gamePieces.forEach(eachPiece => {
        eachPiece.move();
        eachPiece.update(); 
    });
}

// Utilities
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

startGame();