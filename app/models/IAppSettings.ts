interface IAppConfigs {
    UseFilter: boolean,
    BatchSize: number,
    SyncByTimes : number,
    DropboxKey: string
    DropboxSync :boolean,
    StatsFile : string;
    MasterSocketServer?:string;
    IsSlaveNode?:boolean;
}