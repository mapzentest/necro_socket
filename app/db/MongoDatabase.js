"use strict";
const moment = require('moment');
var pokemons = require('../config/pokemons.json');
class MongoDatabase {
    constructor() {
        this.data = [];
        this.addPokemon = (p) => {
            let pokemon = pokemons[p.PokemonId];
            if (pokemon) {
                p.Rarity = pokemon.Rarity;
                p.Name = pokemon.Name;
            }
            this.data.push(p);
            return true;
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
module.exports = module.exports = new MongoDatabase();
