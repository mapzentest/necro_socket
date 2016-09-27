interface IPokemonStatistic{
    Id:number;
    Count:number;
    Percentage: number;
}
interface IPokemonsStatistic{
    [x:string] : IPokemonStatistic
}
interface IStatistics {
    totals: number;
    pokemons: IPokemonsStatistic 
}