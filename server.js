// How to connect: nc 127.0.0.1 9876
const { createServer } = require('net');
const game = require('./game');

const server = createServer(socket => socket.setEncoding('utf8'));

server.on('error', err => console.log(`ERROR: ${err}`));

server.on('connection', socket => {
  socket.on('error', err => console.log(`ERROR: ${err}`));

  if (game.players.length < 2) game.players.push(socket);

  // when player 1 joins
  if (game.players.length == 1) {
    socket.write('Hello, player 1!\nYou\'re "X"s.\n')
    socket.write('Waiting for another player to join...\n')
  }

  // when player 2 joins
  if (game.players.length == 2) {
    game.players[1].write('Hello, player 2!\nYou\'re "O"s.\n')
    game.players[0].write('Another player has joined!\n');
    game.players.forEach(player => player.write(`Let's get started...\n${game.stringifyBoard()}`))
    game.playGame();
  }
});

server.listen(process.env.PORT || 9876, () => console.log(`tcp server listening to ${server.address().port}`));

