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
  const stringBoard = this.board.toString(2).padStart(18, '0');
  let stringSquareBoard = '';

  for (let i = 0; i < stringBoard.length; i+=2) {
    let space = stringBoard[i] + stringBoard[i+1];
    if (space == '00') stringSquareBoard += `| ${Math.floor(i/2) + 1} |`;
    if (space == '01') stringSquareBoard += '| X |';
    if (space == '11') stringSquareBoard += '| O |';
    if ((i + 2) % 3 == 0) stringSquareBoard += '\n';
  }

  return stringSquareBoard;
}

function checkBoard () {
  const horizontals = [
    this.board >> 12,
    (this.board << 6) >> 12,
    (this.board << 6) >> 12
  ];

  for (let i = 0; i < horizontals.length; i++) {
    if (!(horizontals[i] ^ parseInt('010101',2))) return getGameOverString(1)
    if (!(horizontals[i] ^ parseInt('111111', 2))) return getGameOverString(2);
  }

  const verticals = [
    this.board & parseInt('110000110000110000', 2),
    this.board & parseInt('001100001100001100', 2),
    this.board & parseInt('000011000011000011', 2)
  ];

  for (let i = 0; i < verticals.length; i++) {
    if (!(verticals[i] ^ parseInt('010000010000010000', 2))) return getGameOverString(1);
    if (!(verticals[i] ^ parseInt('000100000100000100', 2))) return getGameOverString(1);
    if (!(verticals[i] ^ parseInt('000001000001000001', 2))) return getGameOverString(1);
    if (!(verticals[i] ^ parseInt('110000110000110000', 2))) return getGameOverString(2);
    if (!(verticals[i] ^ parseInt('001100001100001100', 2))) return getGameOverString(2);
    if (!(verticals[i] ^ parseInt('000011000011000011', 2))) return getGameOverString(2);
  }

  const diagonals = [
    this.board & parseInt('110000001100000011', 2),
    this.board & parseInt('000011001100110000', 2)
  ];

  for (let i = 0; i < diagonals.length; i++) {
    if (!(diagonals[i] ^ parseInt('010000000100000001', 2))) return getGameOverString(1);
    if (!(diagonals[i] ^ parseInt('000001000100010000', 2))) return getGameOverString(1);
    if (!(diagonals[i] ^ parseInt('110000001100000011', 2))) return getGameOverString(2);
    if (!(diagonals[i] ^ parseInt('000011001100110000', 2))) return getGameOverString(2);
  }
}

function getGameOverString(playerNum) {
  return `Player ${playerNum} wins!\n`;
}

function playGame(players) {
  this.players.forEach(player => player.write(`It's player 1's turn!\n`));

  this.players.forEach((player, i) => {
    player.on('data', move => {
      let currentPlayerNum = this.currentPlayer ? 1 : 2;
      let otherPlayerNum = currentPlayerNum == 1 ? 2 : 1;

      if ((i + 1) !== currentPlayerNum) return;
      this.updateBoard(currentPlayerNum, move);
      
      // send updated board
      const newBoard = this.stringifyBoard();
      this.players[currentPlayerNum - 1].write(`You played:\n` + newBoard);
      this.players[otherPlayerNum - 1].write(`Player ${currentPlayerNum} played:\n` + newBoard);
      
      const isGameOver = this.checkBoard();
      if (isGameOver) {
        // end game
        this.players.forEach(player => player.end(isGameOver));
        this.players = [];
        this.board = 0;
      } else {
        // set up next turn
        this.players.forEach(player => player.write(`It's player ${otherPlayerNum}'s turn!\n`));
        this.currentPlayer = !this.currentPlayer
      }
    });
  });
}
    
function updateBoard(playerNum, move) {
  let binaryOffset = playerNum == 2 ? 3 : 1;
  let binaryMove = binaryOffset << ((9 - move) * 2);
  
  // check if spot is open
  if ((this.board & binaryMove)) {
    // if taken...
    this.players[playerNum - 1].write("That spot's taken, nice try...\n");
  } else {
    // if not, claim it!
    // set new board state
    this.board = this.board | binaryMove;
  }
}

const game = {
  players: [],
  currentPlayer: true,
  board: 0,
  stringifyBoard,
  checkBoard,
  playGame,
  updateBoard,
  getGameOverString
}

module.exports = game