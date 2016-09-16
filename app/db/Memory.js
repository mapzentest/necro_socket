"use strict";
var pokemons = require('../config/pokemons.json');
class Memory {
    constructor() {
        this.data = [];
        this.addPokemon = (p) => {
            console.log(p);
            var pokemon = pokemons[p.PokemonId];
            if (pokemon) {
                p.Rarity = pokemon.Rarity;
                p.Name = pokemon.Name;
            }
            this.data.push(p);
        };
        this.getActivePokemons = () => {
            return this.data;
        };
    }
}
module.exports = module.exports = new Memory();
