"use strict";
const socketio = require("socket.io");
var middleware = require('socketio-wildcard')();

//io.use(middleware);

class SocketServer {
    constructor(http) {
        this.server = socketio(http);
        this.server.use(middleware);

        this.config();
    }
    config() {
        this.server.on('connection', function (socket) {
            console.log('a user connected');
            socket.on('disconnect', function () {
                console.log('user disconnected');
            });
            socket.on('pokemon', function (msg) {
                console.log(msg)
                //console.log(eval(msg));
                this.server.emit('chat message', msg);
            });

            // socket.on('*', function (msg) {
            //     console.log('message 111: ' + msg);
            //     console.log("Session: %j", msg);
            //     this.server.emit('chat message', msg);
            // });
        });
    }
}
module.exports = module.exports = function (http) {
    return new SocketServer(http).server;
};
