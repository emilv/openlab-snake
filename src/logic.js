function info() {
    console.log("INFO")
    const response = {
        apiversion: "1",
        author: "lajm",
        color: "#EE5D5F",
        head: "evil",
        tail: "mystic-moon"
    }
    return response
}

function start(gameState) {
    console.log(`${gameState.game.id} START`)
}

function end(gameState) {
    console.log(`${gameState.game.id} END\n`)
}

function shuffle(array) {
  let currentIndex = array.length,  randomIndex;

  // While there remain elements to shuffle...
  while (currentIndex != 0) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }

  return array;
}

function move(gameState) {
    //console.log(gameState)
    let possibleMoves = {
        up: true,
        down: true,
        left: true,
        right: true
    }
    let preferredMoves = {
        up: true,
        down: true,
        left: true,
        right: true
    }
    let currentDirection = null;

    // Step 0: Don't let your Battlesnake move back on its own neck
    const myHead = gameState.you.head
    const myNeck = gameState.you.body[1]
    if (myNeck.x < myHead.x) {
        possibleMoves.left = false
        currentDirection = "right"
    } else if (myNeck.x > myHead.x) {
        possibleMoves.right = false
        currentDirection = "left"
    } else if (myNeck.y < myHead.y) {
        possibleMoves.down = false
        currentDirection = "up"
    } else if (myNeck.y > myHead.y) {
        possibleMoves.up = false
        currentDirection = "down"
    }

    // TODO: Step 1 - Don't hit walls.
    // Use information in gameState to prevent your Battlesnake from moving beyond the boundaries of the board.
    const boardWidth = gameState.board.width
    const boardHeight = gameState.board.height
    if (myHead.x == 0) {
        possibleMoves.left = false

    }
    if (myHead.y == 0) {
        possibleMoves.down = false
    }
    if (myHead.x == boardWidth - 1) {
        possibleMoves.right = false
    }
    if (myHead.y == boardHeight - 1) {
        possibleMoves.up = false
    }
    console.log("head x:", myHead.x, "head y:", myHead.y, "width:", boardWidth, "height:", boardHeight)

    // TODO: Step 2 - Don't hit yourself.
    // Use information in gameState to prevent your Battlesnake from colliding with itself.
    
     const mybody = gameState.you.body
      mybody.forEach((body) => {
        if(myHead.x === body.x - 1 && myHead.y === body.y){
          possibleMoves.right = false;
          }
        if(myHead.x === body.x + 1 && myHead.y === body.y){
          possibleMoves.left = false;
          }
        if(myHead.y === body.y - 1 && myHead.x === body.x){
          possibleMoves.up = false;
        }
        if(myHead.y === body.y + 1 && myHead.x === body.x){
          possibleMoves.down = false;
        } 
      })

    // TODO: Step 3 - Don't collide with others.
    // Use information in gameState to prevent your Battlesnake // from colliding with others.
  //
  const snakes = gameState.board.snakes;
  snakes.forEach((snake) => {
  const snakeBody = snake.body;

    snakeBody.forEach((body, i) => {
      if (myHead.x === body.x - 1 && myHead.y === body.y) {
        possibleMoves.right = false;
      }
      if (myHead.x === body.x + 1 && myHead.y === body.y) {
        possibleMoves.left = false;
      }
      if (myHead.y === body.y - 1 && myHead.x === body.x) {
        possibleMoves.up = false;
      }
      if (myHead.y === body.y + 1 && myHead.x === body.x) {
        possibleMoves.down = false;
      }

      if(i == 0 && gameState.you.length <= snake.length) {
        const theirHead = body
        const headAt = (x, y) => theirHead.x == x && theirHead.y == y
        for (m of [-1, 0, 1]) {
          for (n of [1, 2]) {
            if (headAt(myHead.x - n, myHead.y+m))
              preferredMoves.left = false
            if (headAt(myHead.x + n, myHead.y+m))
              preferredMoves.right = false
            if (headAt(myHead.x+m, myHead.y - n))
              preferredMoves.down = false
            if (headAt(myHead.x+m, myHead.y + n))
              preferredMoves.up = false
          }
        }
        /*
        if(myHead.x == theirHead.x - 2)
            possibleMoves.left = false;
        else if(myHead.x == theirHead.x +2)
            possibleMoves.right = false;
        else if(myHead.y == theirHead.y - 2)
            possibleMoves.up = false;      
        else if(myHead.y == theirHead.y + 2)
            possibleMoves.down = false;     */               
      }

    });
  });

  //


    /*gameState.board.snakes.forEach((snake) => {
        let snakeAbove = false;
        let snakeToTheLeft = false;
        let snakeToTheRight = false;
        let snakeBelow = false;

        snake.body.forEach((body) => {
            if(myHead.x + 1 == body.x)
              snakeToTheRight = true;
            if(myHead.x - 1 == body.x)
              snakeToTheLeft = true;
            if(myHead.y + 1 == body.y)
                snakeAbove = true;
            if(myHead.y - 1 == body.y)
                snakeBelow = true;
        });
        
        possibleMoves.up = possibleMoves.up && !snakeAbove;
        possibleMoves.down = possibleMoves.down && !snakeBelow;
        possibleMoves.left = possibleMoves.left && !snakeToTheLeft;
        possibleMoves.right = possibleMoves.right & !snakeToTheRight;
        
    });*/

    // remove all unsafe moves
    console.log("possible moves:", possibleMoves)
    const safeMoves = shuffle(Object.keys(possibleMoves).filter(key => possibleMoves[key]))
    console.log("safe moves:", safeMoves)
    const betterMoves = safeMoves.filter(key => preferredMoves[key])
    console.log("better moves:", betterMoves)

    const isSafe = move => safeMoves.includes(move)
    const pickSafe = lst => lst.find(isSafe)

    // TODO: Step 4 - Find food.
    // Use information in gameState to seek out and find food.
    let foodMove = null
    const isFood = (x, y) => {
      for (food of gameState.board.food) {
        if (food.x == x && food.y == y) {
          return true
        } 
      }
      return false
    }
    const isFoodAround = (x, y) => {
      return isFood(x-1, y) || isFood(x+1, y) || isFood(x, y-1) || isFood(x,y+1) || isFood(x-1,y-1) || isFood(x+1,y+1)
    }
    if (gameState.you.health < 50) {
      let foodStart = Date.now()
      for (let move of safeMoves) {
        if (move == "up" && isFood(myHead.x, myHead.y + 1)) {
          foodMove = move;
          break;
        }
        if (move == "down" && isFood(myHead.x, myHead.y - 1)) {
          foodMove = move;
          break;
        }
        if (move == "left" && isFood(myHead.x - 1, myHead.y)) {
          foodMove = move;
          break;
        }
        if (move == "right" && isFood(myHead.x + 1, myHead.y)) {
          foodMove = move;
          break;
        }

        // food further away
        if (move == "up" && isFoodAround(myHead.x, myHead.y + 1)) {
          foodMove = move;
          break;
        }
        if (move == "down" && isFoodAround(myHead.x, myHead.y - 1)) {
          foodMove = move;
          break;
        }
        if (move == "left" && isFoodAround(myHead.x - 1, myHead.y)) {
          foodMove = move;
          break;
        }
        if (move == "right" && isFoodAround(myHead.x + 1, myHead.y)) {
          foodMove = move;
          break;
        }
      }
      let foodEnd = Date.now()
    }

    let borderMove = null
    let upDown = (myHead.y > boardHeight/2) ? pickSafe(["down", "up"]) : pickSafe(["up", "down"])
    let leftRight = (myHead.x > boardWidth/2) ? pickSafe(["left", "right"]) : pickSafe(["right", "left"])
    if (myHead.x == 1 && currentDirection == "left") {
      borderMove = upDown
    }
    if (myHead.y == 1 && currentDirection == "down") {
      borderMove = leftRight
    }
    if (myHead.x == boardWidth-2 && currentDirection == "right") {
      borderMove = upDown
    }
    if (myHead.y == boardHeight-2 && currentDirection == "up") {
      borderMove = leftRight
    }


    // Finally, choose a move from the available safe moves.
    // TODO: Step 5 - Select a move to make based on strategy, rather than random.

    let move = safeMoves.length > 0 ? safeMoves[0] : null
    if (safeMoves.includes(currentDirection)) {
      move = currentDirection
    }
    if (betterMoves.length > 0) {
      move = betterMoves.includes(currentDirection) ? currentDirection : betterMoves[0]
    }
    if (foodMove && isSafe(foodMove)) {
      console.log("choosing food move:", foodMove)
      move = foodMove
    }else if(borderMove && isSafe(borderMove)){
      console.log("choosing border move:", borderMove)
      move = borderMove
    }

    const response = {
        move: move,
    }

    console.log(`${gameState.game.id} MOVE ${gameState.turn}: ${response.move}`)
    return response
}

module.exports = {
    info: info,
    start: start,
    move: move,
    end: end
}
