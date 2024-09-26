const cells = document.querySelectorAll('.cell');
const message = document.getElementById('message');
const restartButton = document.getElementById('restart');
const gameModeSelect = document.getElementById('game-mode');

let board = Array(9).fill(null);
let currentPlayer = 'X';
let gameActive = true;
let playerVsComputer = false; 
const winningConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
];

function handleCellClick(event) {
    const index = event.target.getAttribute('data-index');
    if (board[index] || !gameActive) return;

    board[index] = currentPlayer;
    event.target.textContent = currentPlayer;
    event.target.classList.add(currentPlayer);

    if (checkWin(currentPlayer)) {
        message.textContent = `${currentPlayer} Wins!`;
        gameActive = false;
        return;
    }

    if (board.every(cell => cell)) {
        message.textContent = 'Draw!';
        gameActive = false;
        return;
    }

    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    message.textContent = `Player ${currentPlayer}'s turn`;

    if (playerVsComputer && currentPlayer === 'O' && gameActive) {
        setTimeout(computerMove, 500); 
    }
}
function checkWin(player) {
    return winningConditions.some(condition =>
        condition.every(index => board[index] === player)
    );
}
function computerMove() {
    const emptyIndices = board.map((cell, index) => cell === null ? index : null).filter(index => index !== null);
    const move = findWinningMove('O') || findWinningMove('X') || emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
    
    if (move !== undefined) {
        board[move] = 'O';
        cells[move].textContent = 'O';
        cells[move].classList.add('O');

        if (checkWin('O')) {
            message.textContent = 'O Wins!';
            gameActive = false;
        } else if (board.every(cell => cell)) {
            message.textContent = 'Draw!';
            gameActive = false;
        } else {
            currentPlayer = 'X';
            message.textContent = `Player ${currentPlayer}'s turn`;
        }
    }
}
function findWinningMove(player) {
    for (let condition of winningConditions) {
        const [a, b, c] = condition;
        if (board[a] === player && board[b] === player && board[c] === null) return c;
        if (board[a] === player && board[c] === player && board[b] === null) return b;
        if (board[b] === player && board[c] === player && board[a] === null) return a;
    }
    return null;
}
function restartGame() {
    board = Array(9).fill(null);
    cells.forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('X', 'O');
    });
    message.textContent = `Player X's turn`;
    currentPlayer = 'X';
    gameActive = true;
}
gameModeSelect.addEventListener('change', () => {
    const selectedMode = gameModeSelect.value;
    playerVsComputer = selectedMode === 'player-vs-computer';
    restartGame();
});

cells.forEach(cell => cell.addEventListener('click', handleCellClick));
restartButton.addEventListener('click', restartGame);
restartGame();

