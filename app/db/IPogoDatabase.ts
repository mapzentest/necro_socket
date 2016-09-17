interface IPogoDatabase{
    addPokemon: (p:IPokemonItem) => void;
    getActivePokemons :() => IPokemonItem[];
}