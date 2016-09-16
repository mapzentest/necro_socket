interface IPogoDatabase{
    addPokemon: (p:any) => void;
    getActivePokemons :() => any[];
}