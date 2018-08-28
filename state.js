function stringifyBoard (arr) {
  let stringBoard = '';
  arr.each((el, i) => {
    if (el == 0) string += '_'
    if (el == 1) string += 'X'
    if (el == 2) string += 'O'
    if (i % 3 == 0) string += '\n'
  });

  return stringBoard;
}

function checkBoard (arr) {

}

function playGame(players) {
  const [ playerOne, playerTwo ] = players;

}

function playTurn() {
  // print board for player
  // 
}

const state = {
  numPlayers: 0,
  numTurns: 0,
  board: [0,0,0,0,0,0,0,0,0],
  stringifyBoard,
  checkBoard,
  playGame
}

module.exports = state