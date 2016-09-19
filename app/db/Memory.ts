/// <reference path="IPogoDatabase.ts" />
/// <reference path="../../_all.d.ts" />
/// <reference path="../models/IPokemonItem.ts" />

import * as moment from 'moment'
var node_dropbox = require('node-dropbox')
var configs = require('../config/config.json')
var pokemons = require('../config/pokemons.json')
var Dropbox = require('dropbox');


class Memory implements IPogoDatabase {
    private data: IPokemonItem[] = [];
    private dropbox: any;
    private all: any = [];
    private counter: any = 0; //current value....
    private stats: any = {}
    private pokemonSettings: IPokemonBasic[];
    constructor() {
        this.pokemonSettings = [];
        let accessToken = '6uT8iPrMZWwAAAAAAAAAJqQ7SxCUIdPkidHXmbTq9PZyKGePBLv4n9c7EG3wcqq_'
        this.dropbox = new Dropbox({ accessToken: accessToken });
        this.loadSyncedData()
    }

    public storeSyncedData = (obj: any): void => {
        if (obj) {
            this.dropbox.filesUpload(
                {
                    path: '/stats.txt',
                    contents: JSON.stringify(obj),
                    mode: {
                        '.tag': 'overwrite'
                    }
                })
                .then(function (response) {
                    console.log('data file stored on dropbox');
                })
                .catch(function (error) {
                    console.log("error dropbox write");
                });

        }
    }
    public loadSyncedData = (): void => {
        let me = this;
        this.dropbox.filesDownload(
            {
                path: '/stats.txt',
                '.tag': 'path'
            })
            .then(function (response) {
                me.stats = JSON.parse(response.fileBinary);
            })
            .catch(function (error) {
                me.stats = {
                    totals: 0,
                    pokemons: {}
                }
            });

    }
    public addPokemon = (p: IPokemonItem): boolean => {
        let pokemon = pokemons[p.PokemonId];
        if (!pokemon) return;
        p.Rarity = pokemon.Rarity;
        p.Name = pokemon.Name;

        this.counter++;
        if (this.stats) {
            if (!this.stats.pokemons[p.Name]) this.stats.pokemons[p.Name] = {
                Id: p.PokemonId,
                Count: 0
            };
            this.stats.pokemons[p.Name].Count = this.stats.pokemons[p.Name].Count + 1;
            this.stats.totals = this.stats.totals + 1;
        }

        if (configs.DropboxSync && (this.counter == configs.BatchSize)) {
            this.counter = 0;
            this.storeSyncedData(this.stats)
        }

        if (!configs.UseFilter || pokemon.Feed && p.IV >= pokemon.FilteredIV) {
            var checkexist = this.data.filter((f) => {
                return p.EncounterId == f.EncounterId;
            });
            if (checkexist && checkexist.length > 0) return false;

            this.data.push(p);
            return true;
        }
        else {
            console.log(`Ignored: ${p.Name} | ${p.IV} | ${p.Rarity}`)
        }
        return false;
    }
    public getActivePokemons = (): IPokemonItem[] => {
        const now = moment();
        this.data = this.data.filter((f) => {
            var exp = moment(f.ExpireTimestamp);
            return exp > now;
        });
        return this.data;
    }
    public getPokemonSettings = (): IPokemonBasic[] => {
        if (!this.pokemonSettings || this.pokemonSettings.length == 0) {
            this.pokemonSettings = [];
            for (var p in pokemons) {
                if (parseInt(p, 10) > 151) break;

                const element = pokemons[p];
                this.pokemonSettings.push({
                    PokemonId: element.Id,
                    Name: element.Name,
                    Rarity: element.Rarity
                });
            }
        }
        return this.pokemonSettings;
    }
}
export = module.exports = new Memory();