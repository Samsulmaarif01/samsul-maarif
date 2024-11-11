// Get DOM elements
const canvas = document.getElementById('tetris');
const context = canvas.getContext('2d');
const startBtn = document.getElementById('startBtn');
const scoreElement = document.getElementById('score');
const levelElement = document.getElementById('level');
const linesElement = document.getElementById('lines');

// Game constants
const BLOCK_SIZE = 20;
const COLS = 12;
const ROWS = 20;
const COLORS = [
    '#00ffff', // cyan
    '#ffff00', // yellow
    '#ff00ff', // purple
    '#ff8800', // orange
    '#0000ff', // blue
    '#00ff00', // green
    '#ff0000'  // red
];

// Tetromino shapes
const SHAPES = [
    [[1, 1, 1, 1]],  // I
    [[1, 1], [1, 1]], // O
    [[1, 1, 1], [0, 1, 0]], // T
    [[1, 1, 1], [1, 0, 0]], // L
    [[1, 1, 1], [0, 0, 1]], // J
    [[1, 1, 0], [0, 1, 1]], // S
    [[0, 1, 1], [1, 1, 0]]  // Z
];

// Game state
let score = 0;
let level = 1;
let lines = 0;
let gameOver = true;
let dropCounter = 0;
let dropInterval = 1000;
let lastTime = 0;
let grid = [];
let currentPiece = null;
let gameLoop = null;

// Initialize grid
function createGrid() {
    grid = Array.from({ length: ROWS }, () => Array(COLS).fill(0));
    return grid;
}

// Create new piece
function createPiece() {
    const shapeIndex = Math.floor(Math.random() * SHAPES.length);
    return {
        shape: JSON.parse(JSON.stringify(SHAPES[shapeIndex])), // Deep copy
        color: COLORS[shapeIndex],
        pos: {
            x: Math.floor(COLS / 2) - Math.floor(SHAPES[shapeIndex][0].length / 2),
            y: 0
        }
    };
}

// Enhanced collision detection
function collide() {
    const [m, o] = [currentPiece.shape, currentPiece.pos];
    for (let y = 0; y < m.length; ++y) {
        for (let x = 0; x < m[y].length; ++x) {
            if (m[y][x] !== 0) {
                // Check canvas boundaries
                if (y + o.y >= ROWS || x + o.x < 0 || x + o.x >= COLS || y + o.y < 0) {
                    return true;
                }
                // Check collision with other blocks
                if (grid[y + o.y] && grid[y + o.y][x + o.x] !== 0) {
                    return true;
                }
            }
        }
    }
    return false;
}

// Improved merge function
function merge() {
    currentPiece.shape.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value !== 0) {
                if (y + currentPiece.pos.y >= 0 && y + currentPiece.pos.y < ROWS &&
                    x + currentPiece.pos.x >= 0 && x + currentPiece.pos.x < COLS) {
                    grid[y + currentPiece.pos.y][x + currentPiece.pos.x] = currentPiece.color;
                }
            }
        });
    });
}

// Enhanced piece rotation
function rotatePiece() {
    // Save the original position and shape
    const originalPos = { ...currentPiece.pos };
    const originalShape = JSON.parse(JSON.stringify(currentPiece.shape));
    
    // Perform rotation
    const rotated = currentPiece.shape[0].map((_, i) =>
        currentPiece.shape.map(row => row[i]).reverse()
    );
    
    currentPiece.shape = rotated;
    
    // Wall kick - try different positions if rotation causes collision
    const kicks = [0, 1, -1, 2, -2];
    let kickSuccessful = false;
    
    for (let kick of kicks) {
        currentPiece.pos.x += kick;
        if (!collide()) {
            kickSuccessful = true;
            break;
        }
        currentPiece.pos.x -= kick;
    }
    
    // If no kick worked, revert the rotation
    if (!kickSuccessful) {
        currentPiece.pos = originalPos;
        currentPiece.shape = originalShape;
    }
}

// Improved line clearing
function clearLines() {
    let linesCleared = 0;
    
    for (let y = ROWS - 1; y >= 0; y--) {
        let isLineFull = true;
        
        for (let x = 0; x < COLS; x++) {
            if (!grid[y][x]) {
                isLineFull = false;
                break;
            }
        }
        
        if (isLineFull) {
            linesCleared++;
            // Remove the full line
            const row = grid.splice(y, 1)[0];
            // Add empty line at top
            grid.unshift(new Array(COLS).fill(0));
            y++; // Check the same row again as lines above have dropped
        }
    }
    
    if (linesCleared > 0) {
        lines += linesCleared;
        score += linesCleared * 100 * level;
        level = Math.floor(lines / 10) + 1;
        dropInterval = Math.max(50, 1000 - (level - 1) * 50);
        updateScore();
    }
}

// Update score display
function updateScore() {
    scoreElement.textContent = score;
    levelElement.textContent = level;
    linesElement.textContent = lines;
}

// Drawing functions
function drawBlock(x, y, color) {
    context.fillStyle = color;
    context.fillRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE - 1, BLOCK_SIZE - 1);
    context.strokeStyle = '#fff';
    context.strokeRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE - 1, BLOCK_SIZE - 1);
}

function drawPiece() {
    currentPiece.shape.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value !== 0) {
                drawBlock(
                    x + currentPiece.pos.x,
                    y + currentPiece.pos.y,
                    currentPiece.color
                );
            }
        });
    });
}

function drawGrid() {
    grid.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value !== 0) {
                drawBlock(x, y, value);
            }
        });
    });
}

function draw() {
    // Clear canvas
    context.fillStyle = '#000';
    context.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw grid lines
    context.strokeStyle = '#333';
    for (let i = 0; i <= COLS; i++) {
        context.beginPath();
        context.moveTo(i * BLOCK_SIZE, 0);
        context.lineTo(i * BLOCK_SIZE, canvas.height);
        context.stroke();
    }
    for (let i = 0; i <= ROWS; i++) {
        context.beginPath();
        context.moveTo(0, i * BLOCK_SIZE);
        context.lineTo(canvas.width, i * BLOCK_SIZE);
        context.stroke();
    }
    
    drawGrid();
    if (currentPiece) {
        drawPiece();
    }
}

// Improved game loop
function update(time = 0) {
    if (gameOver) return;
    
    const deltaTime = time - lastTime;
    lastTime = time;
    dropCounter += deltaTime;
    
    if (dropCounter > dropInterval) {
        currentPiece.pos.y++;
        if (collide()) {
            currentPiece.pos.y--;
            merge();
            
            // Add small delay before creating new piece
            setTimeout(() => {
                clearLines();
                currentPiece = createPiece();
                if (collide()) {
                    gameOver = true;
                    showGameOver();
                    return;
                }
                dropCounter = 0;
            }, 100);
        }
        dropCounter = 0;
    }
    
    draw();
    gameLoop = requestAnimationFrame(update);
}

// Movement controls
function movePiece(dir) {
    currentPiece.pos.x += dir;
    if (collide()) {
        currentPiece.pos.x -= dir;
        return false;
    }
    return true;
}

// Improved drop piece function
function dropPiece() {
    let dropped = false;
    while (!collide()) {
        currentPiece.pos.y++;
        dropped = true;
    }
    
    if (dropped) {
        currentPiece.pos.y--;
        merge();
        setTimeout(() => {
            clearLines();
            currentPiece = createPiece();
            if (collide()) {
                gameOver = true;
                showGameOver();
            }
            dropCounter = 0;
        }, 100);
    }
}

// Game over display
function showGameOver() {
    context.fillStyle = 'rgba(0, 0, 0, 0.75)';
    context.fillRect(0, canvas.height / 2 - 30, canvas.width, 60);
    
    context.fillStyle = '#ff0000';
    context.font = '20px "Press Start 2P", Arial';
    context.textAlign = 'center';
    context.fillText('GAME OVER', canvas.width / 2, canvas.height / 2);
    
    context.font = '12px "Press Start 2P", Arial';
    context.fillStyle = '#00ff00';
    context.fillText('Press START', canvas.width / 2, canvas.height / 2 + 25);
    
    startBtn.disabled = false;
}

// Start new game
function startGame() {
    grid = createGrid();
    currentPiece = createPiece();
    gameOver = false;
    score = 0;
    lines = 0;
    level = 1;
    dropInterval = 1000;
    updateScore();
    startBtn.disabled = true;
    if (gameLoop) {
        cancelAnimationFrame(gameLoop);
    }
    update();
}

// Event listeners
document.addEventListener('keydown', event => {
    if (gameOver) return;
    
    switch (event.keyCode) {
        case 37: // Left
            movePiece(-1);
            break;
        case 39: // Right
            movePiece(1);
            break;
        case 40: // Down
            dropPiece();
            break;
        case 38: // Up (Rotate)
            rotatePiece();
            break;
        case 32: // Space (Hard drop)
            dropPiece();
            break;
    }
    draw();
});

// Mobile controls
document.getElementById('leftBtn').addEventListener('click', () => {
    if (!gameOver) {
        movePiece(-1);
        draw();
    }
});

document.getElementById('rightBtn').addEventListener('click', () => {
    if (!gameOver) {
        movePiece(1);
        draw();
    }
});

document.getElementById('rotateBtn').addEventListener('click', () => {
    if (!gameOver) {
        rotatePiece();
        draw();
    }
});

document.getElementById('dropBtn').addEventListener('click', () => {
    if (!gameOver) {
        dropPiece();
        draw();
    }
});

startBtn.addEventListener('click', startGame);

// Set canvas size
canvas.width = COLS * BLOCK_SIZE;
canvas.height = ROWS * BLOCK_SIZE;

// Initial draw
draw();