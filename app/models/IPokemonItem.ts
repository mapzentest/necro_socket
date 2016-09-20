interface IPokemonBasic {
    PokemonId:number;
    Name:string;
    Rarity:string;
}

interface IPokemonItem  extends IPokemonBasic{
    Latitude: number;
    Longitude:number;
    Move1?:string;
    Move2?:string;
    EncounterId: string;
    ExpireTimestamp:number;
    Expires: Date;
    SpawnPointId:string;
    Level:number;
    IV:number
}