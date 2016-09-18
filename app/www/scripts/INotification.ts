/// <reference path="../../models/IPokemonItem.ts" />

interface INotification {
    requestPermission:() => void;
    sendNotification : (item : IPokemonItem ) =>  void;
}