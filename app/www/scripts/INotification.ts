/// <reference path="../../models/IPokemonItem.ts" />

interface INotification {
    requestPermission:() => void;
    sendPokemonNotification : (item : IPokemonItem ,url:string) =>  void;
    sendNotification: (title:string, body:string) => void;
}