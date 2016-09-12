"use strict";
const socketio = require("socket.io");
class SocketServer {
    constructor(http) {
        this.server = socketio(http);
        this.config();
    }
    config() {
        this.server.on('connection', function (socket) {
            console.log('a user connected');
            socket.on('disconnect', function () {
                console.log('user disconnected');
            });
            socket.on('chat message', function (msg) {
                console.log('message: ' + msg);
                this.server.emit('chat message', msg);
            });
        });
    }
}
module.exports = module.exports = function (http) {
    return new SocketServer(http).server;
};
