function stringifyBoard () {
  const board = this.board;
  let stringBoard = '';
  board.forEach((space, i) => {
    if (space == 0) stringBoard += '_'
    if (space == 1) stringBoard += 'X'
    if (space == 2) stringBoard += 'O'
    if ((i + 1) % 3 == 0) stringBoard += '\n'
  });

  return stringBoard;
}

function checkBoard () {

}

function playGame(players) {
  const [ playerOne, playerTwo ] = players;
  players.forEach((player, i) => {
    player.on('data', data => console.log(`Player ${i+1}: ${data}`));
  })

  // add game logic here!
  // cycle through number of turns; determine which player it is
  playerOne.write(this.stringifyBoard())
}

function playTurn() {
  // print board for player
  // 
}

const game = {
  numPlayers: 0,
  numTurns: 0,
  board: [0,0,0,0,0,0,0,0,0],
  stringifyBoard,
  checkBoard,
  playGame
}

module.exports = game