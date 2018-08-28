// tcp server
var net = require('net');

var server = net.createServer();  
server.on('connection', handleConnection);

server.listen(9876, function() {  
  console.log('tcp server listening to %j', server.address());
});

// sockets, continued
var io = require('./sockets');

function handleConnection(conn) {  
  
  io.sockets.emit('join');

  var remoteAddress = conn.remoteAddress + ':' + conn.remotePort;
  console.log('new client connection from %s', remoteAddress);

  conn.on('data', onConnData);
  conn.on('close', onConnClose);
  conn.on('error', onConnError);

  function onConnData(d) {
    console.log('connection data from %s: %j', remoteAddress, d);
    io.sockets.emit('said', {message: d.toString().slice(0, d.length-1)});
  }

  function onConnClose() {
    console.log('connection from %s closed', remoteAddress);
    io.sockets.emit('left');
  }

  function onConnError(err) {
    console.log('Connection %s error: %s', remoteAddress, err.message);
    io.sockets.emit('error');
  }
}
