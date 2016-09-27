/// <reference path="./ILocation.ts" />

interface IPokemonBasic {
    PokemonId:number;
    Name:string;
    Rarity:string;
}
interface ISocketDataTransfer{
    ServerToServer?:boolean;
    $type?:string;
    IsRecievedFromSocket?:boolean;
}
interface IPokemonItem  extends IPokemonBasic, ILocation, ISocketDataTransfer{
    Move1?:string;
    Move2?:string;
    EncounterId: string;
    ExpireTimestamp:number;
    Expires: Date;
    SpawnPointId:string;
    Level:number;
    IV:number,
}