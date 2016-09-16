/// <reference path="IPogoDatabase.ts" />
var pokemons = require('../config/pokemons.json')

class Memory implements IPogoDatabase {
    private data: any[] =[];
    constructor() {

    }
    public addPokemon = (p:any) :void => {
        console.log(p)
        var pokemon = pokemons[p.PokemonId];
        if(pokemon) {
            p.Rarity = pokemon.Rarity;
            p.Name = pokemon.Name;
        }

        this.data.push(p);
    }
    public getActivePokemons =() :any[] => {
         return this.data;
    }
}
export = module.exports =  new Memory();