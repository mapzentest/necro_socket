/// <reference path="../_all.d.ts" />
/// <reference path="models/IAppSettings.ts" />

//http://brianflove.com/2016/03/29/typescript-express-node-js/

"use strict";

import * as socketio from "socket.io"
import * as socketioclient from "socket.io-client"
import * as http from "http"
import * as _ from "lodash"
import Memory = require("./db/Memory")

var pokemons: IPokemonItem[] = require('./config/pokemons.json')

class SocketServer {
    private appConfigs : IAppConfigs;
    public server: SocketIO.Server;
    public client : SocketIOClient.Socket;
    public db : IPogoDatabase;
    public pokemonSettings : IPokemonBasic[]
    /**
     * Constructor.
     *
     * @class Server
     * @constructor
     */
    constructor(http: any, settings: IAppConfigs) {

        this.appConfigs = settings;
        this.db = Memory(this.appConfigs)
        
        this.server = socketio(http);
        this.configSocketServer();

        if(this.appConfigs.IsSlaveNode && this.appConfigs.MasterSocketServer) {
            this.client = socketioclient(this.appConfigs.MasterSocketServer);
            this.configSocketClient();
        }

    }
    public sendToMaster(data : IPokemonItem)  {
        console.log('send data to master server, in slaver mode')
        data.ServerToServer =  true;
        this.client.emit('pokemon', data);
        delete data.ServerToServer;   
    }

    private configSocketClient() {
            var mdb = this.db;
            var me = this;
            this.client.on('connect', () => {
                console.log('connected to master server', this.appConfigs.MasterSocketServer)
            });

            this.client.on('pokemon', (data:IPokemonItem) => {
                console.log('data recieved from server');
                data.ServerToServer = true;
                if(mdb.addPokemon(data)) {
                    delete data.ServerToServer;
                    me.server.sockets.emit('pokemon', data)
                }
            });
            this.client.connect();
        }


    private configSocketServer= (): void =>  {

        var mdb = this.db;
        var me = this;
        let clientCount = 0;
        this.server.on('connection', function (socket) {
             console.log('a user connected ===>>>', ++clientCount);
            socket.on('disconnect', function() {
                console.log('user disconnected ===>>> ', --clientCount);
            });

            socket.on('fpm', function (msg:any) {
                console.log('fpm', msg)
                socket.broadcast.emit('fpm', msg)
            });

             socket.on('pokemon', function (msg:IPokemonItem) {
                delete msg.$type
                delete msg.IsRecievedFromSocket;
                
                let pokemon: IPokemonItem = msg;
                if(mdb.addPokemon(msg)) { 
                    if(me.appConfigs.IsSlaveNode){
                        me.sendToMaster(msg);
                    }
                    delete msg.ServerToServer;    
                    socket.broadcast.emit('pokemon', msg);
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
                            me.sendToMaster(msg);
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