import { gameState } from "./gameState.js";
import { calculateValidMoves, makeMove } from "./moveLogic.js";

function makeAIMove() {
  let validMoves = [];
  for (let i = 0; i < gameState.board.length; i++) {
    for (let j = 0; j < gameState.board[i].length; j++) {
      if (gameState.board[i][j] === gameState.currentPlayer) {
        gameState.selectedMarbles = [[i, j]];
        calculateValidMoves();
        validMoves.push(
          ...gameState.validMoves.map((move) => ({ from: [i, j], to: move }))
        );
      }
    }
  }

  if (validMoves.length > 0) {
    const randomMove =
      validMoves[Math.floor(Math.random() * validMoves.length)];
    gameState.selectedMarbles = [randomMove.from];
    makeMove(randomMove.to[0], randomMove.to[1]);
  }
}

export { makeAIMove };
