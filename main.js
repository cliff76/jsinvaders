var gamePieces;

function startGame() {
    gameArea.start();
    gamePieces = [new component(30, 30, "red", 10, 120)];
  }
  
  var gameArea = {
    canvas : document.createElement("canvas"),
    start : function() {
      this.canvas.width = 1280;
      this.canvas.height = 800;
      this.canvas.style = "border:1px solid #000000;";
      this.context = this.canvas.getContext("2d");
      document.body.insertBefore(this.canvas, document.body.childNodes[0]);
      this.interval = setInterval(updateGameArea, 20);
    },
    clear : function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
  }

  function component(width, height, color, x, y) {
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;
    this.update = function(){
        ctx = gameArea.context;
        ctx.fillStyle = color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
    this.move = function(){
        this.x += 1;
    }
  }

  function updateGameArea() {
    gameArea.clear();
    gamePieces.forEach( eachPiece => { eachPiece.move(); eachPiece.update();})
  }

  startGame();