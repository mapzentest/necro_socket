"use strict";
const moment = require('moment');
var configs = require('../config/config.json');
var pokemons = require('../config/pokemons.json');
class Memory {
    constructor() {
        this.data = [];
        this.addPokemon = (p) => {
            let pokemon = pokemons[p.PokemonId];
            if (pokemon) {
                p.Rarity = pokemon.Rarity;
                p.Name = pokemon.Name;
                if (!configs.UseFilter || pokemon.Feed && p.IV >= pokemon.FilteredIV) {
                    var checkexist = this.data.filter((f) => {
                        return p.EncounterId == f.EncounterId;
                    });
                    if (checkexist && checkexist.length > 0)
                        return false;
                    this.data.push(p);
                    return true;
                }
                else {
                    console.log(`Ignored: ${p.Name} | ${p.IV} | ${p.Rarity}`);
                }
            }
            return false;
        };
        this.getActivePokemons = () => {
            const now = moment();
            this.data = this.data.filter((f) => {
                var exp = moment(f.ExpireTimestamp);
                return exp > now;
            });
            return this.data;
        };
    }
}
module.exports = module.exports = new Memory();
