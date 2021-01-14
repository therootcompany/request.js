'use strict';

var net = require('net');
var server = net.createServer(function (socket) {
    socket.on('data', function (chunk) {
        console.info(chunk.toString('utf8'));
    });
});
server.listen(3007, function () {
    console.info('Listening on', this.address());
});
