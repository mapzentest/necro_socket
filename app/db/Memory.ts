/// <reference path="IPogoDatabase.ts" />

class Memory implements IPogoDatabase {
    private data: any[] =[];
    constructor() {

    }
    public addPokemon = (p:any) :void => {
        console.log(p)
        this.data.push(p);
    }
    public getActivePokemons =() :any[] => {
         return this.data;
    }
}
export = module.exports =  new Memory();