"use strict";
class Memory {
    constructor() {
        this.data = [];
        this.addPokemon = (p) => {
            console.log(p);
            this.data.push(p);
        };
        this.getActivePokemons = () => {
            return this.data;
        };
    }
}
module.exports = module.exports = new Memory();
