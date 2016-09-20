/// <reference path="IPogoDatabase.ts" />
/// <reference path="../../_all.d.ts" />
/// <reference path="../models/IPokemonItem.ts" />

import * as moment from 'moment'
var node_dropbox = require('node-dropbox')
var configs = require('../config/config.json')
var pokemons = require('../config/pokemons.json')
var Dropbox = require('dropbox');


class Memory implements IPogoDatabase {
    private rarePokemons: IPokemonItem[] = [];
    private dropbox: any;
    private all: any = [];
    private counter: any = 0;
    private stats: any = {}
    private pokemonSettings: IPokemonBasic[];
    constructor() {
        this.pokemonSettings = [];
        this.dropbox = new Dropbox({ accessToken: configs.DropboxKey });
        this.loadSyncedData()
    }

    public storeSyncedData = (obj: any): void => {
        if (obj) {
            this.dropbox.filesUpload(
                {
                    path: '/' + configs.StatsFile,
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
                path: '/' + configs.StatsFile,
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

    public addStatistics = (pkm: IPokemonItem): void => {
        this.counter++;
        if (this.stats && pkm.Name) {
            if (!this.stats.pokemons[pkm.Name]) this.stats.pokemons[pkm.Name] = {
                Id: pkm.PokemonId,
                Count: 0
            };
            this.stats.pokemons[pkm.Name].Count = this.stats.pokemons[pkm.Name].Count + 1;
            this.stats.totals = this.stats.totals + 1;
        }

        if (configs.DropboxSync && (this.counter == configs.BatchSize)) {
            this.counter = 0;
            this.storeSyncedData(this.stats)
        }
    }
    public addPokemon = (p: IPokemonItem): boolean => {
        let pokemon = pokemons[p.PokemonId];
        if (!pokemon) return;
        p.Rarity = pokemon.Rarity;
        p.Name = pokemon.Name;

        if (!configs.UseFilter || pokemon.Feed && p.IV >= pokemon.FilteredIV) {
            var checkexist = this.rarePokemons.filter((f) => {
                return p.EncounterId == f.EncounterId;
            });

            if (checkexist && checkexist.length > 0) {
                return false;
            }

            this.rarePokemons.push(p);
            this.addStatistics(p);
            return true;
        }
        else {
            this.addStatistics(pokemon);
            console.log(`Ignored: ${p.Name} | ${p.IV} | ${p.Rarity}`)
        }
        return false;
    }

    public getActivePokemons = (): IPokemonItem[] => {
        const now = moment();
        this.rarePokemons = this.rarePokemons.filter((f) => {
            var exp = moment(f.ExpireTimestamp);
            return exp > now;
        });
        return this.rarePokemons;
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