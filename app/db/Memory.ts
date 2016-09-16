/// <reference path="IPogoDatabase.ts" />
/// <reference path="../../_all.d.ts" />
import * as Moment from 'Moment'

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
        const now =  Moment();
        this.data = this.data.filter((f)=>{
            var exp = Moment(f.ExpireTimestamp);
            return exp > now;
        });
         return this.data;
    }
}
export = module.exports =  new Memory();