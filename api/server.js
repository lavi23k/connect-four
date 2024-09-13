const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');
const app = express();

app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true
}));

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST'],
        credentials: true
    }
});

let gameState = {
  board: Array(6).fill(null).map(() => Array(7).fill('')),
  currPlayer: 'R',
  gameOver: false,
  currColumns: [5, 5, 5, 5, 5, 5, 5]
};

let players = {};
let playerCount = 0;

io.on('connection', (socket) => {
  if (playerCount === 0) {
    players[socket.id] = 'R';
    socket.emit('colorAssignment', 'R');
    playerCount++;
  } else if (playerCount === 1) {
    players[socket.id] = 'Y';
    socket.emit('colorAssignment', 'Y');
    playerCount++;
  }

  socket.emit('gameState', gameState);

  function checkWinner(board, row, col, player) {
    return checkDirection(board, row, col, player, 1, 0) ||  
           checkDirection(board, row, col, player, 0, 1) ||  
           checkDirection(board, row, col, player, 1, 1) ||  
           checkDirection(board, row, col, player, 1, -1);   
  }
  
  function checkDirection(board, row, col, player, rowDir, colDir) {
    let count = 0;
    for (let i = -3; i <= 3; i++) {
      const newRow = row + i * rowDir;
      const newCol = col + i * colDir;
      if (newRow >= 0 && newRow < 6 && newCol >= 0 && newCol < 7 && board[newRow][newCol] === player) {
        count++;
        if (count === 4) return true;
      } else {
        count = 0;
      }
    }
    return false;
  }

  socket.on('move', (col) => {
    const playerColor = players[socket.id];
    if (playerColor !== gameState.currPlayer || gameState.gameOver) return;

    const row = gameState.currColumns[col];
    if (row < 0) return;

    gameState.board[row][col] = playerColor;
    gameState.currColumns[col]--;

    if (checkWinner(gameState.board, row, col, playerColor)) {
      gameState.gameOver = true;
      io.emit('gameOver', playerColor);
    } else {
      gameState.currPlayer = gameState.currPlayer === 'R' ? 'Y' : 'R';
    }

    io.emit('gameState', gameState);
  });

  socket.on('disconnect', () => {
    delete players[socket.id];
    playerCount--;
  });
});

server.listen(3001, () => {
  console.log('listening on *:3001');
});
