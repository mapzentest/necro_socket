interface IPogoDatabase{
    addPokemon: (p:IPokemonItem) => boolean;
    getActivePokemons :() => IPokemonItem[];
    getPokemonSettings :() => IPokemonBasic[];
}