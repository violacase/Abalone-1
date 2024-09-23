import { gameState } from "./gameState.js";
import {
  highlightSelectedMarbles,
  highlightValidMoves,
  renderBoard,
} from "./boardRenderer.js";

function selectMarble(row, col) {
  const index = gameState.selectedMarbles.findIndex(
    ([r, c]) => r === row && c === col
  );
  if (index === -1) {
    gameState.selectedMarbles.push([row, col]);
  } else {
    gameState.selectedMarbles.splice(index, 1);
  }
  highlightSelectedMarbles();
  calculateValidMoves();
}

function calculateValidMoves() {
  gameState.validMoves = [];
  if (gameState.selectedMarbles.length === 0) return;

  const directions = [
    [-1, 0],
    [1, 0], // up, down
    [0, -1],
    [0, 1], // left, right
    [-1, -1],
    [1, 1], // diagonals
  ];

  directions.forEach((dir) => {
    const moves = getMovesInDirection(dir);
    gameState.validMoves.push(...moves);
  });

  highlightValidMoves();
}

function getMovesInDirection(direction) {
  const moves = [];
  const [dx, dy] = direction;
  const lineMarbles = getLineMarbles(direction);

  if (lineMarbles.length === 0) return moves;

  // In-line move
  const [frontRow, frontCol] = lineMarbles[0];
  const newRow = frontRow + dx;
  const newCol = frontCol + dy;

  if (
    isValidPosition(newRow, newCol) &&
    gameState.board[newRow][newCol] === null
  ) {
    moves.push([newRow, newCol]);
  }

  // Push move
  if (lineMarbles.length <= 3) {
    let pushRow = newRow;
    let pushCol = newCol;
    let opponentMarbles = 0;

    while (
      isValidPosition(pushRow, pushCol) &&
      gameState.board[pushRow][pushCol] === getOpponentColor()
    ) {
      opponentMarbles++;
      pushRow += dx;
      pushCol += dy;
    }

    if (
      opponentMarbles > 0 &&
      opponentMarbles < lineMarbles.length &&
      isValidPosition(pushRow, pushCol) &&
      gameState.board[pushRow][pushCol] === null
    ) {
      moves.push([pushRow, pushCol]);
    }
  }

  // Side-step move
  if (lineMarbles.length <= 3) {
    const sideDirections = getSideDirections(direction);
    sideDirections.forEach((sideDir) => {
      const [sdx, sdy] = sideDir;
      if (
        lineMarbles.every(
          ([r, c]) =>
            isValidPosition(r + sdx, c + sdy) &&
            gameState.board[r + sdx][c + sdy] === null
        )
      ) {
        moves.push([lineMarbles[0][0] + sdx, lineMarbles[0][1] + sdy]);
      }
    });
  }

  return moves;
}

function getLineMarbles(direction) {
  const [dx, dy] = direction;
  const lineMarbles = [];
  let [currentRow, currentCol] = gameState.selectedMarbles[0];

  while (
    gameState.selectedMarbles.some(
      ([r, c]) => r === currentRow && c === currentCol
    )
  ) {
    lineMarbles.push([currentRow, currentCol]);
    currentRow += dx;
    currentCol += dy;
  }

  return lineMarbles;
}

function getSideDirections(direction) {
  const [dx, dy] = direction;
  if (dx === 0)
    return [
      [-1, -1],
      [1, 1],
    ];
  if (dy === 0)
    return [
      [-1, -1],
      [1, 1],
    ];
  if (dx === dy)
    return [
      [-1, 0],
      [0, 1],
    ];
  return [
    [1, 0],
    [0, -1],
  ];
}

function isValidPosition(row, col) {
  return row >= 0 && row < 9 && col >= 0 && col < 9;
}

function getOpponentColor() {
  return gameState.currentPlayer === "white" ? "black" : "white";
}

function makeMove(targetRow, targetCol) {
  const direction = getDirection(gameState.selectedMarbles[0], [
    targetRow,
    targetCol,
  ]);
  const lineMarbles = getLineMarbles(direction);

  // Remove marbles from their original positions
  lineMarbles.forEach(([row, col]) => {
    gameState.board[row][col] = null;
  });

  // Move marbles to new positions
  lineMarbles.forEach(([row, col], index) => {
    const newRow = targetRow + index * direction[0];
    const newCol = targetCol + index * direction[1];
    gameState.board[newRow][newCol] = gameState.currentPlayer;
  });

  // Handle pushing opponent marbles
  let pushRow = targetRow + direction[0] * lineMarbles.length;
  let pushCol = targetCol + direction[1] * lineMarbles.length;
  while (
    isValidPosition(pushRow, pushCol) &&
    gameState.board[pushRow][pushCol] === getOpponentColor()
  ) {
    const nextRow = pushRow + direction[0];
    const nextCol = pushCol + direction[1];
    if (!isValidPosition(nextRow, nextCol)) {
      // Marble is pushed off the board
      if (getOpponentColor() === "white") {
        gameState.whiteMarbles--;
      } else {
        gameState.blackMarbles--;
      }
      gameState.board[pushRow][pushCol] = null;
    } else if (gameState.board[nextRow][nextCol] === null) {
      // Move the pushed marble
      gameState.board[nextRow][nextCol] = gameState.board[pushRow][pushCol];
      gameState.board[pushRow][pushCol] = null;
    }
    pushRow = nextRow;
    pushCol = nextCol;
  }

  // Reset selection and switch players
  gameState.selectedMarbles = [];
  gameState.currentPlayer = getOpponentColor();

  // Check for win condition
  if (gameState.whiteMarbles <= 8 || gameState.blackMarbles <= 8) {
    const winner = gameState.whiteMarbles <= 8 ? "Black" : "White";
    alert(`${winner} wins the game!`);
    initGame();
  } else {
    renderBoard();
  }
}

function getDirection(start, end) {
  return [Math.sign(end[0] - start[0]), Math.sign(end[1] - start[1])];
}

export { selectMarble, makeMove, calculateValidMoves };
