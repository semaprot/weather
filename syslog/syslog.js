var StringDecoder = require('string_decoder').StringDecoder;
/**
 *  echo server
 *
 */

var address,
    ifaces = require('os').networkInterfaces();
for (var dev in ifaces) {
    ifaces[dev].filter((details) => details.family === 'IPv4' && details.internal === false ? address = details.address: undefined);
}

console.log(address);


var net = require('net'),
    host = address,
    port = 5005,
    unixsocket = '/tmp/workers-logs.sock';

var log = function(who, what) {
  return function() {
    var args = Array.prototype.slice.call(arguments);
    console.log('[%s on %s]', who, what, args);
  };
};

var echo = function(socket) {
  /**
   *  net.Socket (http://nodejs.org/api/net.html#net_class_net_socket)
   *  events: end, data, end, timeout, drain, error, close
   *  methods:
   */
  socket.on('end', function() {
    // exec'd when socket other end of connection sends FIN packet
    console.log('[socket on end]');
  });
  var decoder = new StringDecoder('utf8');
  socket.on('data', function(data) {
    // data is a Buffer object
    var textChunk = decoder.write(data);
    console.log('[socket on data]', textChunk);
  });
  socket.on('end', function() {
    // emitted when the other end sends a FIN packet
  });

  socket.on('timeout', log('socket', 'timeout'));

  socket.on('drain', function() {
    // emitted when the write buffer becomes empty
    console.log('[socket on drain]');
  });
  socket.on('error', log('socket', 'error'));
  socket.on('close', log('socket', 'close'));
  socket.pipe(socket);
};

/**
 *  net.Server (http://nodejs.org/api/net.html#net_class_net_server)
 *  events: listening, connections, close, err
 *  methods: listen, address, getConnections,
 */
var server = net.createServer(echo);
server.listen(port, host); // port or unix socket, cannot listen on both with one server

server.on('listening', function() {
  var ad = server.address();
  if (typeof ad === 'string') {
    console.log('[server on listening] %s', ad);
  } else {
    console.log('[server on listening] %s:%s using %s', ad.address, ad.port, ad.family);
  }
});

server.on('connection', function(socket) {
  server.getConnections(function(err, count) {
    console.log('%d open connections!', count);
  });
});

server.on('close', function() { console.log('[server on close]'); });
server.on('err', function(err) {
  console.log(err);
  server.close(function() { console.log("shutting down the server!"); });
});
