document.getElementById("start-game").addEventListener("click", startGame);

let gridSize, winStreak;
let board;
let currentPlayer;
let gameActive;

function startGame() {
  gridSize = parseInt(document.getElementById("grid-size").value);
  winStreak = parseInt(document.getElementById("win-streak").value);

  if (winStreak > gridSize) {
    alert("Win streak cannot be greater than grid size.");
    return;
  }

  board = Array(gridSize)
    .fill(null)
    .map(() => Array(gridSize).fill(""));
  currentPlayer = "X";
  gameActive = true;
  document.getElementById(
    "game-message"
  ).textContent = `Player ${currentPlayer}'s turn`;
  renderBoard();
}

function renderBoard() {
  const gameBoard = document.getElementById("game-board");
  gameBoard.innerHTML = "";
  gameBoard.style.gridTemplateColumns = `repeat(${gridSize}, 1fr)`;
  gameBoard.style.gridTemplateRows = `repeat(${gridSize}, 1fr)`;

  for (let i = 0; i < gridSize; i++) {
    for (let j = 0; j < gridSize; j++) {
      const cell = document.createElement("div");
      cell.classList.add("cell");
      cell.dataset.row = i;
      cell.dataset.col = j;
      cell.textContent = board[i][j];
      cell.addEventListener("click", handleCellClick);
      gameBoard.appendChild(cell);
    }
  }
}

function handleCellClick(event) {
  const row = event.target.dataset.row;
  const col = event.target.dataset.col;

  if (board[row][col] !== "" || !gameActive) {
    return;
  }

  board[row][col] = currentPlayer;
  renderBoard();

  const winInfo = checkWin(row, col);
  if (winInfo) {
    document.getElementById(
      "game-message"
    ).textContent = `Player ${currentPlayer} wins!`;
    gameActive = false;
    drawWinningLine(winInfo);
    return;
  }

  if (board.flat().every((cell) => cell !== "")) {
    document.getElementById("game-message").textContent = "It's a draw!";
    gameActive = false;
    return;
  }

  currentPlayer = currentPlayer === "X" ? "O" : "X";
  document.getElementById(
    "game-message"
  ).textContent = `Player ${currentPlayer}'s turn`;
}

function checkWin(row, col) {
  row = parseInt(row);
  col = parseInt(col);
  const directions = [
    { dr: 0, dc: 1 }, // horizontal
    { dr: 1, dc: 0 }, // vertical
    { dr: 1, dc: 1 }, // diagonal down-right
    { dr: 1, dc: -1 }, // diagonal down-left
  ];

  for (let { dr, dc } of directions) {
    let count = 1;
    let startRow = row,
      startCol = col;
    let endRow = row,
      endCol = col;

    for (let i = 1; i < winStreak; i++) {
      const r = row + i * dr;
      const c = col + i * dc;
      if (
        r >= 0 &&
        r < gridSize &&
        c >= 0 &&
        c < gridSize &&
        board[r][c] === currentPlayer
      ) {
        count++;
        endRow = r;
        endCol = c;
      } else {
        break;
      }
    }

    for (let i = 1; i < winStreak; i++) {
      const r = row - i * dr;
      const c = col - i * dc;
      if (
        r >= 0 &&
        r < gridSize &&
        c >= 0 &&
        c < gridSize &&
        board[r][c] === currentPlayer
      ) {
        count++;
        startRow = r;
        startCol = c;
      } else {
        break;
      }
    }

    if (count >= winStreak) {
      return { startRow, startCol, endRow, endCol, dr, dc };
    }
  }
  return null;
}

function drawWinningLine({ startRow, startCol, endRow, endCol, dr, dc }) {
  const gameBoard = document.getElementById("game-board");
  const line = document.createElement("div");
  line.classList.add("winning-line");

  const cellSize = 50; // Size of each cell in px
  const offsetX = 2; // Border offset for positioning
  const offsetY = 2; // Border offset for positioning

  const x1 = startCol * (cellSize + offsetX) + cellSize / 2;
  const y1 = startRow * (cellSize + offsetY) + cellSize / 2;
  const x2 = endCol * (cellSize + offsetX) + cellSize / 2;
  const y2 = endRow * (cellSize + offsetY) + cellSize / 2;

  line.style.width = `${Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2)}px`;
  line.style.transform = `rotate(${
    Math.atan2(y2 - y1, x2 - x1) * (180 / Math.PI)
  }deg)`;
  line.style.top = `${y1}px`;
  line.style.left = `${x1}px`;

  gameBoard.appendChild(line);
}
