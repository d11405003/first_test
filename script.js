const canvas = document.getElementById('board');
const ctx = canvas.getContext('2d');
const GRID_SIZE = 15;
const CELL_SIZE = canvas.width / (GRID_SIZE + 1);
let currentPlayer = 'black';
let gameBoard = Array(GRID_SIZE).fill().map(() => Array(GRID_SIZE).fill(null));
let gameOver = false;

// 繪製棋盤
function drawBoard() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // 繪製線條
    for (let i = 0; i < GRID_SIZE; i++) {
        // 垂直線
        ctx.beginPath();
        ctx.moveTo(CELL_SIZE * (i + 1), CELL_SIZE);
        ctx.lineTo(CELL_SIZE * (i + 1), CELL_SIZE * GRID_SIZE);
        ctx.stroke();
        
        // 水平線
        ctx.beginPath();
        ctx.moveTo(CELL_SIZE, CELL_SIZE * (i + 1));
        ctx.lineTo(CELL_SIZE * GRID_SIZE, CELL_SIZE * (i + 1));
        ctx.stroke();
    }
    
    // 繪製棋子
    for (let i = 0; i < GRID_SIZE; i++) {
        for (let j = 0; j < GRID_SIZE; j++) {
            if (gameBoard[i][j]) {
                drawPiece(i, j, gameBoard[i][j]);
            }
        }
    }
}

// 繪製棋子
function drawPiece(row, col, color) {
    ctx.beginPath();
    ctx.arc(
        CELL_SIZE * (col + 1),
        CELL_SIZE * (row + 1),
        CELL_SIZE * 0.4,
        0,
        Math.PI * 2
    );
    ctx.fillStyle = color;
    ctx.fill();
    ctx.stroke();
}

// 檢查是否獲勝
function checkWin(row, col) {
    const directions = [
        [[0, 1], [0, -1]],  // 水平
        [[1, 0], [-1, 0]],  // 垂直
        [[1, 1], [-1, -1]], // 對角線
        [[1, -1], [-1, 1]]  // 反對角線
    ];

    for (const direction of directions) {
        let count = 1;
        for (const [dx, dy] of direction) {
            let r = row + dx;
            let c = col + dy;
            while (
                r >= 0 && r < GRID_SIZE &&
                c >= 0 && c < GRID_SIZE &&
                gameBoard[r][c] === gameBoard[row][col]
            ) {
                count++;
                r += dx;
                c += dy;
            }
        }
        if (count >= 5) return true;
    }
    return false;
}

// 處理點擊事件
canvas.addEventListener('click', (e) => {
    if (gameOver) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const col = Math.round(x / CELL_SIZE - 1);
    const row = Math.round(y / CELL_SIZE - 1);

    if (
        row >= 0 && row < GRID_SIZE &&
        col >= 0 && col < GRID_SIZE &&
        !gameBoard[row][col]
    ) {
        gameBoard[row][col] = currentPlayer;
        drawBoard();

        if (checkWin(row, col)) {
            setTimeout(() => {
                alert(`${currentPlayer === 'black' ? '黑子' : '白子'}獲勝！`);
                gameOver = true;
            }, 100);
        } else {
            currentPlayer = currentPlayer === 'black' ? 'white' : 'black';
            document.getElementById('current-player').textContent =
                currentPlayer === 'black' ? '黑子' : '白子';
        }
    }
});

// 重新開始遊戲
document.getElementById('restart').addEventListener('click', () => {
    gameBoard = Array(GRID_SIZE).fill().map(() => Array(GRID_SIZE).fill(null));
    currentPlayer = 'black';
    gameOver = false;
    document.getElementById('current-player').textContent = '黑子';
    drawBoard();
});

// 初始化棋盤
drawBoard();