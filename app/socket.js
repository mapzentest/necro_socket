"use strict";
const socketio = require("socket.io");
const Memory = require("./db/Memory");
class SocketServer {
    constructor(http) {
        this.server = socketio(http);
        this.config();
    }
    config() {
        this.db = Memory;
        var mdb = this.db;
        this.server.on('connection', function (socket) {
            console.log('a user connected');
            socket.on('disconnect', function () {
                console.log('user disconnected');
            });
            socket.on('pokemon', function (msg) {
                mdb.addPokemon(msg);
                socket.broadcast.emit('pokemon', msg);
            });
            socket.on('pokemons', function () {
                let list = mdb.getActivePokemons();
                socket.emit("pokemons", list);
            });
        });
    }
}
module.exports = module.exports = function (http) {
    return new SocketServer(http).server;
};
