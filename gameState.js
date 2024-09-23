let gameState = {
  board: [],
  currentPlayer: "white",
  whiteMarbles: 14,
  blackMarbles: 14,
  selectedMarbles: [],
  validMoves: [],
  aiEnabled: false,
};

function initializeGameState() {
  gameState.board = Array(9)
    .fill()
    .map(() => Array(9).fill(null));

  // Set up initial white marbles
  [
    [0, 2],
    [0, 3],
    [0, 4],
    [0, 5],
    [0, 6], // 5 marbles
    [1, 2],
    [1, 3],
    [1, 4],
    [1, 5],
    [1, 6],
    [1, 7], // 6 marbles
    [2, 3],
    [2, 4],
    [2, 5], // 3 marbles
  ].forEach(([row, col]) => (gameState.board[row][col] = "white"));

  // Set up initial black marbles
  [
    [6, 3],
    [6, 4],
    [6, 5], // 3 marbles
    [7, 1],
    [7, 2],
    [7, 3],
    [7, 4],
    [7, 5],
    [7, 6], // 6 marbles
    [8, 2],
    [8, 3],
    [8, 4],
    [8, 5],
    [8, 6], // 5 marbles
  ].forEach(([row, col]) => (gameState.board[row][col] = "black"));

  gameState.whiteMarbles = 14;
  gameState.blackMarbles = 14;
  gameState.currentPlayer = "white";
  gameState.selectedMarbles = [];
  gameState.validMoves = [];
}

export { gameState, initializeGameState };
