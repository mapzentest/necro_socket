"use strict";
const moment = require('moment');
var pokemons = require('../config/pokemons.json');
class Memory {
    constructor() {
        this.data = [];
        this.addPokemon = (p) => {
            let pokemon = pokemons[p.PokemonId];
            if (pokemon) {
                p.Rarity = pokemon.Rarity;
                p.Name = pokemon.Name;
            }
            this.data.push(p);
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
