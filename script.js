const winningCombinations = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

const boardElement = document.getElementById('game-board');
const restartButton = document.getElementById('restart-button');
const statusMessage = document.getElementById('status-message');
const helperMessage = document.getElementById('helper-message');
const scoreXElement = document.getElementById('score-x');
const scoreOElement = document.getElementById('score-o');
const scoreDrawsElement = document.getElementById('score-draws');

const scores = {
  X: 0,
  O: 0,
  draws: 0,
};

let board = Array(9).fill('');
let currentPlayer = 'X';
let gameOver = false;
let winningCells = [];

function createBoard() {
  boardElement.innerHTML = '';

  board.forEach((value, index) => {
    const cell = document.createElement('button');
    cell.type = 'button';
    cell.className = 'cell';
    cell.setAttribute('role', 'gridcell');
    cell.setAttribute('aria-label', `Cell ${index + 1}${value ? `, ${value}` : ', empty'}`);
    cell.dataset.index = String(index);
    cell.textContent = value;

    if (value) {
      cell.classList.add(value === 'X' ? 'cell-x' : 'cell-o');
      cell.disabled = true;
    }

    if (winningCells.includes(index)) {
      cell.classList.add('cell-winning');
    }

    if (gameOver && !winningCells.length) {
      cell.disabled = true;
    }

    cell.addEventListener('click', handleCellClick);
    boardElement.appendChild(cell);
  });
}

function handleCellClick(event) {
  const index = Number(event.currentTarget.dataset.index);

  if (gameOver || board[index]) {
    return;
  }

  board[index] = currentPlayer;

  const winner = getWinningCombination();

  if (winner) {
    winningCells = winner;
    gameOver = true;
    scores[currentPlayer] += 1;
    updateScoreboard();
    updateStatus(`Player ${currentPlayer} wins!`, 'Game over. Start a new game to play again.');
    createBoard();
    return;
  }

  if (board.every(Boolean)) {
    gameOver = true;
    scores.draws += 1;
    updateScoreboard();
    updateStatus("It's a draw!", 'No more moves are available. Start a new game to try again.');
    createBoard();
    return;
  }

  currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
  updateStatus(`Player ${currentPlayer}, your turn`, 'Select any open square to make your move.');
  createBoard();
}

function getWinningCombination() {
  return winningCombinations.find((combination) => {
    const [a, b, c] = combination;
    return board[a] && board[a] === board[b] && board[a] === board[c];
  });
}

function updateStatus(message, helperText) {
  statusMessage.textContent = message;
  helperMessage.textContent = helperText;
}

function updateScoreboard() {
  scoreXElement.textContent = String(scores.X);
  scoreOElement.textContent = String(scores.O);
  scoreDrawsElement.textContent = String(scores.draws);
}

function resetBoard() {
  board = Array(9).fill('');
  currentPlayer = 'X';
  gameOver = false;
  winningCells = [];
  updateStatus('Player X, your turn', 'Select any open square to make your move.');
  createBoard();
}

restartButton.addEventListener('click', resetBoard);

updateScoreboard();
createBoard();
