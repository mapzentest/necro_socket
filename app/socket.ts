/// <reference path="../_all.d.ts" />
/// <reference path="models/IAppSettings.ts" />

//http://brianflove.com/2016/03/29/typescript-express-node-js/

"use strict";

import * as socketio from "socket.io"
import * as http from "http"
import * as _ from "lodash"
import Memory = require("./db/Memory")
var pokemons: IPokemonItem[] = require('./config/pokemons.json')

class SocketServer {
    private appConfigs : IAppConfigs;
    public server: SocketIO.Server;
    public client : any;
    public db : IPogoDatabase;
    public pokemonSettings : IPokemonBasic[]
    public sendToMaster(data : IPokemonItem)  {}
    /**
     * Constructor.
     *
     * @class Server
     * @constructor
     */
    constructor(http: any, settings: IAppConfigs) {
        //create expressjs application
        this.appConfigs = settings;
        this.server = socketio(http);
        this.config();
    }

    private config() {

        this.db = Memory(this.appConfigs)
        var mdb = this.db;
        var me = this;
        let clientCount = 0;
        this.server.on('connection', function (socket) {
             console.log('a user connected ===>>>', ++clientCount);
            socket.on('disconnect', function() {
                console.log('user disconnected ===>>> ', --clientCount);
            });

             socket.on('pokemon', function (msg) {
                delete msg.$type
                delete msg.IsRecievedFromSocket;
                
                let pokemon: IPokemonItem = msg;
                if(mdb.addPokemon(msg)) { 
                    socket.broadcast.emit('pokemon', msg);
                    if(me.appConfigs.IsSlaveNode){
                        //send this to master server.
                        me.client.sendToMaster(msg);
                    }
                }
            });
            socket.on('active-pokemons', function () {
                let list = mdb.getActivePokemons();
                socket.emit("pokemons", list)
            });

            socket.on('pokemons', function (data:any) {
                if(!data ) return;
                _.forEach(data.$values, (msg)=> {
                    delete msg.$type
                    delete msg.IsRecievedFromSocket
                    let pokemon: IPokemonItem = msg;
                    if(mdb.addPokemon(msg)) { 
                        socket.broadcast.emit('pokemon', msg);
                        if(me.appConfigs.IsSlaveNode){
                            //send this to master server.
                            me.client.sendToMaster(msg);
                        }
                    }
                });
                

            });

            socket.on('pokemon-settings', function () {
                socket.emit("pokemon-settings", mdb.getPokemonSettings())
            });
            
        });
    }

    public onPokemonRequest = (socket:any, pokemon :IPokemonItem) : void => {

    }

}

export = module.exports = function (http: any, settings :IAppConfigs) {
    return new SocketServer(http, settings)
}