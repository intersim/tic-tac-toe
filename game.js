// https://github.com/uxitten/polyfill/blob/master/string.polyfill.js
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/padStart
if (!String.prototype.padStart) {
  String.prototype.padStart = function padStart(targetLength, padString) {
    targetLength = targetLength >> 0; //truncate if number or convert non-number to 0;
    padString = String((typeof padString !== 'undefined' ? padString : ' '));
    if (this.length > targetLength) {
      return String(this);
    }
    else {
      targetLength = targetLength - this.length;
      if (targetLength > padString.length) {
        padString += padString.repeat(targetLength / padString.length); //append to original to ensure we are longer than needed
      }
      return padString.slice(0, targetLength) + String(this);
    }
  };
}

function stringifyBoard () {
  const { board } = this;
  let stringBoard = board.toString(2).padStart(18, '0');
  let stringSquareBoard = '';

  for (let i = 0; i < stringBoard.length; i+=2) {
    let space = stringBoard[i] + stringBoard[i+1];
    if (space == '00') stringSquareBoard += `| _ |`
    if (space == '01') stringSquareBoard += '| X |'
    if (space == '11') stringSquareBoard += '| O |'
    if ((i + 2) % 3 == 0) stringSquareBoard += '\n'
  }

  return stringSquareBoard;
}

function checkBoard () {
  const horizontals = [
    this.board >> 12,
    (this.board << 6) >> 12,
    (this.board << 6) >> 12
  ]

  for (let i = 0; i < horizontals.length; i++) {
    if (!(horizontals[i] ^ parseInt('010101',2))) return "Player one wins!"
    if (!(horizontals[i] ^ parseInt('111111', 2))) return "Player two wins!";
  }

  const verticals = [
    this.board & parseInt('110000110000110000', 2),
    this.board & parseInt('001100001100001100', 2),
    this.board & parseInt('000011000011000011', 2)
  ]

  for (let i = 0; i < verticals.length; i++) {
    if (!(verticals[i] ^ parseInt('010000010000010000', 2))) return "Player one wins!"
    if (!(verticals[i] ^ parseInt('000100000100000100', 2))) return "Player one wins!"
    if (!(verticals[i] ^ parseInt('000001000001000001', 2))) return "Player one wins!"
    if (!(verticals[i] ^ parseInt('110000110000110000', 2))) return "Player two wins!"
    if (!(verticals[i] ^ parseInt('001100001100001100', 2))) return "Player two wins!"
    if (!(verticals[i] ^ parseInt('000011000011000011', 2))) return "Player two wins!"
  }

  const diagonals = [
    this.board & parseInt('110000001100000011', 2),
    this.board & parseInt('000011001100110000', 2)
  ]

  for (let i = 0; i < diagonals.length; i++) {
    if (!(diagonals[i] ^ parseInt('010000000100000001', 2))) return "Player one wins!"
    if (!(diagonals[i] ^ parseInt('000001000100010000', 2))) return "Player one wins!"
    if (!(diagonals[i] ^ parseInt('110000001100000011', 2))) return "Player two wins!"
    if (!(diagonals[i] ^ parseInt('000011001100110000', 2))) return "Player two wins!"
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
  // check if spot is open
  // if not, claim it!

  // set new board state
  let binaryOffset = playerNum == 2 ? 3 : 1;
  let binaryNum = binaryOffset << ((9 - move) * 2)
  this.board = this.board | binaryNum;
}

const game = {
  players: [],
  numTurns: 0,
  board: 0,
  stringifyBoard,
  checkBoard,
  playGame,
  playTurn,
  getGameOverString
}

module.exports = game