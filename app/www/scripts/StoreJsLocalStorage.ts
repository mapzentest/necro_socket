/// <reference path="./ILocalStorage.ts" />
declare var store; //using store.js as local stogare.

class StoreJsLocalStorage implements ILocalStorage {
    public save<T extends IStorageItem> (key:string,obj: T) {
        if(!store.enabled) {
            console.log('your browser doesn\'t support local stogare');
            return;
        }        
        store.set(key, obj)
        
    }
    public read<T extends IStorageItem>(key:string):T  {
        return store.get(key);
    }
}