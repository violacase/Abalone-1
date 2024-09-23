import { gameState } from "./gameState.js";
import { handleMarbleClick } from "./main.js";

function renderBoard() {
  const boardElement = document.getElementById("board");
  boardElement.innerHTML = "";

  gameState.board.forEach((row, rowIndex) => {
    row.forEach((cell, colIndex) => {
      if (cell) {
        const piece = document.createElement("div");
        piece.className = `piece ${cell}`;
        piece.style.top = `${rowIndex * 10 + 5}%`;
        piece.style.left = `${colIndex * 10 + 5}%`;
        piece.addEventListener("click", () =>
          handleMarbleClick(rowIndex, colIndex)
        );
        boardElement.appendChild(piece);
      }
    });
  });
  updateStatus();
}

function updateStatus() {
  const statusElement = document.getElementById("status");
  statusElement.textContent = `Current player: ${
    gameState.currentPlayer
  } | White: ${gameState.whiteMarbles} | Black: ${
    gameState.blackMarbles
  } | AI: ${gameState.aiEnabled ? "On" : "Off"}`;
}

function highlightSelectedMarbles() {
  document
    .querySelectorAll(".piece")
    .forEach((piece) => piece.classList.remove("selected"));
  gameState.selectedMarbles.forEach(([row, col]) => {
    const piece = document.querySelector(
      `.piece[style*="top: ${row * 10 + 5}%"][style*="left: ${col * 10 + 5}%"]`
    );
    if (piece) piece.classList.add("selected");
  });
}

function highlightValidMoves() {
  document.querySelectorAll(".valid-move").forEach((el) => el.remove());

  gameState.validMoves.forEach(([row, col]) => {
    const cell = document.querySelector(
      `.board > div[style*="top: ${row * 10 + 5}%"][style*="left: ${
        col * 10 + 5
      }%"]`
    );
    if (!cell) {
      const newCell = document.createElement("div");
      newCell.className = "piece valid-move";
      newCell.style.top = `${row * 10 + 5}%`;
      newCell.style.left = `${col * 10 + 5}%`;
      newCell.addEventListener("click", () => handleMarbleClick(row, col));
      document.querySelector(".board").appendChild(newCell);
    } else {
      cell.classList.add("valid-move");
    }
  });
}

export {
  renderBoard,
  updateStatus,
  highlightSelectedMarbles,
  highlightValidMoves,
};
