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

function checkBinaryFlags () {
  for (let playerIdx = 0; playerIdx < 2; playerIdx++) {
    for (let conditionIdx = 0; conditionIdx < this.winConditions[playerIdx].length; conditionIdx++) {
      let winCondition = this.winConditions[playerIdx][conditionIdx]
      
      if ((this.boardFlags & winCondition) == winCondition) {
        console.log(this.boardFlags.toString(2))
        console.log(this.winConditions[playerIdx][conditionIdx].toString(2))
        console.log((this.boardFlags & winCondition) == winCondition)
        
        console.log(this.getGameOverString(playerIdx + 1));
        return;
      }
    }
  }
}

function checkBoard () {
  const board = this.board;
  
  // bitshifting:
  // take current state of the board, & with num that represents winning condition
  // if result is the same as the winning condition, then someone wins!

  // e.g. if (this.boardFlags & 86016 == 86016) return getGameOverString(1);
  checkBinaryFlags.call(this);

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

function getGameOverString(playerNum) {
  return `Player ${playerNum} wins!`;
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
  winConditions: [
    [86016, 1344, 21, 66576, 16644, 4161, 65793, 4368], 
    [258048, 4032, 63, 199728, 49932, 12483, 197379, 13104]
  ],
  stringifyBoard,
  checkBoard,
  playGame,
  playTurn,
  getGameOverString
}

module.exports = game

// Player 1 wins:
// Horizontals:
// 010101000000000000 - 86016
// 000000010101000000 - 1344
// 000000000000010101 - 21 
// Verticals:
// 010000010000010000 - 66576
// 000100000100000100 - 16644
// 000001000001000001 - 4161
// Diagonals:
// 010000000100000001 - 65793
// 000001000100010000 - 4368

// Player 2 wins:
// Horizontals:
// 111111000000000000 - 258048
// 000000111111000000 - 4032
// 000000000000111111 - 63
// Verticals:
// 110000110000110000 - 199728
// 001100001100001100 - 49932
// 000011000011000011 - 12483
// Diagonals:
// 110000001100000011 - 197379
// 000011001100110000 - 13104