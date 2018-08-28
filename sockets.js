// express app and http server
var app = require('express')();

var server = app.listen(9999, function () {
    console.log('http server on port 9999');
});

app.get('/', function(req, res, next) {
    res.sendFile(__dirname + '/index.html');
});

// sockets!
var socketIo = require('socket.io');
var io = socketIo(server);

module.exports = io;