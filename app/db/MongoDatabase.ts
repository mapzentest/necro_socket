/// <reference path="IPogoDatabase.ts" />
/// <reference path="../../_all.d.ts" />
/// <reference path="../models/IPokemonItem.ts" />

import * as moment from 'moment';
import * as mongoose from "mongoose";
//https://gist.github.com/brennanMKE/ee8ea002d305d4539ef6
//https://gist.github.com/masahirompp/6cfdfd1e007187e61310
// export let Schema = mongoose.Schema;
// export let ObjectId = mongoose.Schema.Types.ObjectId;
// export let Mixed = mongoose.Schema.Types.Mixed;

var pokemons = require('../config/pokemons.json')

class MongoDatabase implements IPogoDatabase {
    private data: IPokemonItem[] =[];
    constructor() {

    }
    public addPokemon = (p:IPokemonItem) :boolean => {
        let pokemon = pokemons[p.PokemonId];
        
        if(pokemon) {
            p.Rarity = pokemon.Rarity;
            p.Name = pokemon.Name;
        }

        this.data.push(p);
        return true;
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
export = module.exports =  new MongoDatabase();