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
    const gameOverString = `Player ${i} wins!`;

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
    });
  })

  // add game logic here!
  // cycle through number of turns; determine which player it is
}

function playTurn(playerNum, move) {
  // update board state
  this.board[move - 1] = playerNum;
}

const game = {
  players: [],
  numTurns: 0,
  board: [0,0,0,0,0,0,0,0,0],
  stringifyBoard,
  checkBoard,
  playGame,
  playTurn
}

module.exports = game