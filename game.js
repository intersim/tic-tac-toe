function stringifyBoard () {
  const board = this.board;
  let stringBoard = '';
  board.forEach((space, i) => {
    if (space == 0) stringBoard += `| ${i + 1} |`
    if (space == 1) stringBoard += '| X |'
    if (space == 2) stringBoard += '| O |'
    if ((i + 1) % 3 == 0) stringBoard += '\n'
  });

  return stringBoard;
}

function checkBoard () {
  const board = this.board;
  
  for (let i = 1; i <= 2; i++) {
    const gameOverString = `Player ${i} wins!\n`;

    //horizonals
    if (board[0] == i && board[1] == i && board[2] == i) return gameOverString;
    if (board[3] == i && board[4] == i && board[5] == i) return gameOverString;
    if (board[6] == i && board[7] == i && board[8] == i) return gameOverString;
    // verticals
    if (board[0] == i && board[3] == i && board[6] == i) return gameOverString;
    if (board[1] == i && board[4] == i && board[7] == i) return gameOverString;
    if (board[2] == i && board[5] == i && board[8] == i) return gameOverString;
    // diagonals
    if (board[0] == i && board[4] == i && board[8] == i) return gameOverString;
    if (board[2] == i && board[4] == i && board[6] == i) return gameOverString;
  }
}

function playGame(players) {
  this.players.forEach((player, i) => {
    player.on('data', data => {
      this.playTurn(i + 1, data);
      const newBoard = this.stringifyBoard();
      
      this.players.forEach(player => player.write(`Player ${i+1}'s move:\n` + newBoard));
      const isGameOver = this.checkBoard();

      if (isGameOver) this.players.forEach(player => player.end(isGameOver));
    });
  })

  // determine whose turn it is, cycle through number of turns
}

function playTurn(playerNum, move) {
  // update board state
  this.board[move - 1] = playerNum;
  console.log(this.board)
  // check if spot is open
  // if not, claim it!

  // trying bit shifting stuff
  let binaryOffset = playerNum == 2 ? 3 : 1;
  let binaryNum = binaryOffset << ((9 - move) * 2)
  this.boardFlags = this.boardFlags | binaryNum;
  // to check if spot is open:
  // shift other player to same spot
  // XOR that num with the board? and if it's zero...?
}

const game = {
  players: [],
  numTurns: 0,
  board: [0,0,0,0,0,0,0,0,0],
  boardFlags: 0,
  stringifyBoard,
  checkBoard,
  playGame,
  playTurn
}

module.exports = game

// Beginning state:
//    00 00 00 00 00 00 00 00 00


// 1: 010000000000000000 
// 2: 000100000000000000
// 3: 000001000000000000 
// 4: 000000010000000000 
// 5: 000000000100000000 
// 6: 000000000001000000 
// 7: 000000000000010000 
// 8: 000000000000000100 
// 9: 000000000000000001 

// Player 1 wins:
// Horizontals:
// 01 01 01 00 00 00 00 00 00
// 00 00 00 01 01 01 00 00 00
// 00 00 00 00 00 00 01 01 01
// Verticals:
// 01 00 00 01 00 00 01 00 00
// 00 01 00 00 01 00 00 01 00
// 00 00 01 00 00 01 00 00 01
// Diagonals:
// 01 00 00 00 01 00 00 00 01
// 00 00 01 00 01 00 01 00 00

// Player 2 wins:
// Horizontals:
// 11 11 11 00 00 00 00 00 00
// 00 00 00 11 11 11 00 00 00
// 00 00 00 00 00 00 11 11 11
// Verticals:
// 11 00 00 11 00 00 11 00 00
// 00 11 00 00 11 00 00 11 00
// 00 00 11 00 00 11 00 00 11
// Diagonals:
// 11 00 00 00 11 00 00 00 11
// 00 00 11 00 11 00 11 00 00