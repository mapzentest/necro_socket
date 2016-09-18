interface IStorageItem {
}
interface ILocalStorage{
    save<T extends IStorageItem>(key:string,obj:T) :void;
    read<T extends IStorageItem>(key) : T;
}