/// <reference path="IPogoDatabase.ts" />
/// <reference path="../../_all.d.ts" />
/// <reference path="../models/IPokemonItem.ts" />

import * as moment from 'moment'
var node_dropbox = require('node-dropbox')
var configs = require('../config/config.json')
var pokemons = require('../config/pokemons.json')

class Memory implements IPogoDatabase {
    private data: IPokemonItem[] = [];
    private dropbox: any;
    private all: any = [];
    private counter: any = 0;
    private pokemonSettings: IPokemonBasic[];
    constructor() {
        this.pokemonSettings = [];
        let accessToken = '6uT8iPrMZWwAAAAAAAAAJqQ7SxCUIdPkidHXmbTq9PZyKGePBLv4n9c7EG3wcqq_'
        this.dropbox = node_dropbox.api(accessToken);
    }
    public addPokemon = (p: IPokemonItem): boolean => {
        this.counter++;

        if (configs.DropboxSync && this.counter % configs.BatchSize == 0) {
            this.dropbox.createFile(`stat.log`, this.counter, function (err, res, body) {
                // body...
                console.log('dropbox file synced.')
            });
        }

        /*this.all.push(p);

        if(this.all.length == configs.BatchSize) {
            this.dropbox.createFile(`${(new Date()).getTime()}.json`, this.all , function aaa(err, res, body) {
                // body...
                console.log('dropbox file synced.')
            }); // Creates a new file.
            this.all = []
        }
        */
        let pokemon = pokemons[p.PokemonId];

        if (pokemon) {
            p.Rarity = pokemon.Rarity;
            p.Name = pokemon.Name;

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