/// <reference path="../_all.d.ts" />
//http://brianflove.com/2016/03/29/typescript-express-node-js/

"use strict";

import * as socketio from "socket.io"
import * as http from "http"

class SocketServer {
    public server: SocketIO.Server;

    /**
     * Constructor.
     *
     * @class Server
     * @constructor
     */
    constructor(http: any) {
        //create expressjs application
        this.server = socketio(http);
        this.config();

    }
    private config() {
        this.server.on('connection', function (socket) {
            console.log('a user connected');
            socket.on('disconnect', function () {
                console.log('user disconnected');
            });
            socket.on('chat message', function (msg) {
                console.log('message: ' + msg);
                this.server.emit('chat message', msg);
            });
             socket.on('pokemon', function (msg) {
                console.log(msg)
                //console.log(eval(msg));
                this.server.broadcast.emit('pokemon', msg);
            });

        });
    }
}

export = module.exports = function (http: any) {
    return new SocketServer(http).server
}