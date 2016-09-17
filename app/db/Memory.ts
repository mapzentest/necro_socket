/// <reference path="IPogoDatabase.ts" />
/// <reference path="../../_all.d.ts" />
/// <reference path="../models/IPokemonItem.ts" />

import * as moment from 'moment'

var pokemons = require('../config/pokemons.json')

class Memory implements IPogoDatabase {
    private data: IPokemonItem[] =[];
    constructor() {

    }
    public addPokemon = (p:IPokemonItem) :void => {
        let pokemon = pokemons[p.PokemonId];
        
        if(pokemon) {
            p.Rarity = pokemon.Rarity;
            p.Name = pokemon.Name;
        }

        this.data.push(p);
    }
    public getActivePokemons =() : IPokemonItem[] => {
        const now =  moment();
        this.data = this.data.filter((f)=>{
            var exp = moment(f.ExpireTimestamp);
            return exp > now;
        });
         return this.data;
    }
}
export = module.exports =  new Memory();