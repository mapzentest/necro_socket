interface IPokemonBasic {
    PokemonId:number;
    Name:string;
    Rarity:string;
}

interface IPokemonItem  extends IPokemonBasic{
    Latitude: number;
    Longitude:number;
    EncounterId: string;
    ExpireTimestamp:number;
    Expires: Date;
    SpawnPointId:string;
    Level:number;
    IV:number
}