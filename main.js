import { initializeGameState, gameState } from "./gameState.js";
import { renderBoard, updateStatus } from "./boardRenderer.js";
import { selectMarble, makeMove } from "./moveLogic.js";
import { makeAIMove } from "./ai.js";

function initGame() {
  initializeGameState();
  renderBoard();
}

function handleMarbleClick(row, col) {
  if (gameState.board[row][col] === gameState.currentPlayer) {
    selectMarble(row, col);
  } else if (
    gameState.validMoves.some((move) => move[0] === row && move[1] === col)
  ) {
    makeMove(row, col);
    if (gameState.aiEnabled && gameState.currentPlayer === "black") {
      setTimeout(makeAIMove, 1000);
    }
  }
}

// Event listeners
document.getElementById("newGameBtn").addEventListener("click", initGame);
document.getElementById("instructionsBtn").addEventListener("click", () => {
  const instructions = document.getElementById("instructions");
  instructions.style.display =
    instructions.style.display === "none" ? "block" : "none";
});
document.getElementById("toggleAIBtn").addEventListener("click", () => {
  gameState.aiEnabled = !gameState.aiEnabled;
  updateStatus();
});

// Start the game
initGame();

export { handleMarbleClick };
