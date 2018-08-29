// How to connect: nc 127.0.0.1 9876
const { createServer } = require('net');
const game = require('./game');

const server = createServer(socket => {
    socket.setEncoding('utf8')
});

server.on('error', err => console.log(`ERROR: ${err}`));

server.on('connection', socket => {
    game.players.push(socket);

    if (game.players.length == 1) {
        socket.write('You\'re "X"s!\n')
        socket.write('Waiting for another player to join...\n')
    }

    if (game.players.length == 2) {
        socket.write('You\'re "O"s!\n')
        game.players[1].write('Another player has joined!\n');
        game.players.forEach(player => player.write(`Let's get started...\n${game.stringifyBoard()}`))
        game.playGame();
    }

});

// handle when people disconnect too

server.listen(9876, () => console.log(`tcp server listening to ${server.address().port}`));

