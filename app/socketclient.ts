/// <reference path="../_all.d.ts" />
/// <reference path="models/IAppSettings.ts" />
///// <reference path="socket.ts" />

//http://brianflove.com/2016/03/29/typescript-express-node-js/

"use strict";

import * as socketioclient from "socket.io-client"
import * as socketio from "socket.io"
import * as http from "http"
import * as _ from "lodash"
import Memory = require("./db/Memory")
var pokemons: IPokemonItem[] = require('./config/pokemons.json')

class SocketClient {
    private appConfigs : IAppConfigs;
    public client: SocketIOClient.Socket;
    public server : SocketIO.Server;
    public db : IPogoDatabase;
    public pokemonSettings : IPokemonBasic[]
    /**
     * Constructor.
     *
     * @class Server
     * @constructor
     */
    constructor(socketServer:any, settings: IAppConfigs) {
        this.server = socketServer.server;
        socketServer.client = this;
        this.appConfigs = settings;
        if(this.appConfigs.IsSlaveNode && this.appConfigs.MasterSocketServer) {
            this.client = socketioclient(this.appConfigs.MasterSocketServer);
            this.config();
        }
    }
    public sendToMaster(data : IPokemonItem)  {

        //console.log(this)
        console.log('send data to master server, in slaver mode')
        this.client.emit('pokemon', data);
    }
    private config() {

        this.db = Memory(this.appConfigs)
        var mdb = this.db;
        var me = this;
        let clientCount = 0;
        this.client.on('connect', () => {
            console.log('connected to master server')
        });

        this.client.on('pokemon', (data) => {
            console.log('data recieved from server', data)
            me.server.sockets.emit('pokemon', data)
        });
        this.client.connect();
    }


}

export = module.exports = function (server: any, settings :IAppConfigs) {
    var socketClient =  new SocketClient(server, settings);
    server.client = socketClient;
    console.log(server)
    return socketClient;
}