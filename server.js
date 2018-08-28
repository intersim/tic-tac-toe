// tcp server
const { createServer } = require('net');
const game = require('./game');

const allSockets = [];

const server = createServer(socket => {
    socket.setEncoding('utf8')
});

server.on('error', err => console.log(`ERROR: ${err}`));

server.on('connection', socket => {
    game.numPlayers++;

    if (game.numPlayers == 1) {
        allSockets.push(socket);
        socket.write('You\'re "X"s!\n')
        socket.write('Waiting for another player to join...\n')
    }

    if (game.numPlayers == 2) {
        allSockets.push(socket);
        socket.write('You\'re "O"s!\n')
        allSockets[0].write('Another player has joined!\n');
        allSockets.forEach(socket => socket.write('Let\'s get started...\n'))
        game.playGame(allSockets);
    }

});

server.listen(9876, () => console.log(`tcp server listening to ${server.address().port}`));

