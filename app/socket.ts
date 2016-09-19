/// <reference path="../_all.d.ts" />
//http://brianflove.com/2016/03/29/typescript-express-node-js/

"use strict";

import * as socketio from "socket.io"
import * as http from "http"
import Memory = require("./db/Memory")
var pokemons: IPokemonItem[] = require('./config/pokemons.json')

class SocketServer {
    public server: SocketIO.Server;
    public db : IPogoDatabase;
    public pokemonSettings : IPokemonBasic[]
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

        this.db = Memory
        var mdb = this.db;
        var me = this;
        this.server.on('connection', function (socket) {
            console.log('a user connected');
            //send list data on memory.
            
            socket.on('disconnect', function () {
                console.log('user disconnected');
            });
             socket.on('pokemon', function (msg) {
                delete msg.$type
                let pokemon: IPokemonItem = msg;
                if(mdb.addPokemon(msg)) { 
                    socket.broadcast.emit('pokemon', msg);
                }
            });
            socket.on('pokemons', function () {
                let list = mdb.getActivePokemons();
                socket.emit("pokemons", list)
            });

            socket.on('pokemon-settings', function () {
                socket.emit("pokemon-settings", mdb.getPokemonSettings())
            });
            

            // socket.on('*', function (msg) {
            //     console.log('message 111: ' + msg);
            //     console.log("Session: %j", msg);
            //     this.server.emit('chat message', msg);
            // });

        });
    }
}

export = module.exports = function (http: any) {
    return new SocketServer(http).server
}