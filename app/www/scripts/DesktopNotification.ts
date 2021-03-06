/// <reference path="INotification.ts" />
declare var Notification;

class DesktopNotification implements INotification {

    private config: IAppConfig;
    constructor(cfg: IAppConfig) {
        this.config = cfg;
    }

    public requestPermission = (): void => {
        if (!("Notification" in window)) {
            alert("This browser does not support desktop notification");
            // Let's check whether notification permissions have alredy been granted
        }
        else if (Notification.permission === "granted") {
            // If it's okay let's create a notification
            var notification = new Notification("Hi there!, You will get notification when pokemon display here.");
            return;
        }
        // Otherwise, we need to ask the user for permission
        else if (Notification.permission !== 'denied' || Notification.permission === "default") {
            Notification.requestPermission(function (permission) {
                var notification = new Notification("Hi there!, You will get notification when pokemon display here.");
            });
        }

    }
    public sendNotification = (title:string, body:string): void =>  {

    }
    public sendPokemonNotification = (item: IPokemonItem, url:string): void => {
    if (!this.config ||  !this.config.EnableDesktopNotification) return;

    if(this.config.PokemonFilters) {
        let filters = _.filter(this.config.PokemonFilters, x=> x.PokemonId == item.PokemonId);

        if(filters &&  !filters[0].EnableNotification) return;
    }
    var notification = new Notification(`${item.Name} - ${item.Rarity}`,
        {
            icon: `https://df48mbt4ll5mz.cloudfront.net/images/pokemon/${item.PokemonId}.png`,
            data: url,
            body: `Name: ${item.Name}
                IV: ${Math.round(item.IV)} %
                LV: ${item.Level}`
        });
       notification.onclick = function(e) {
            //window.location.href = e.target.data;
            window.open(e.target.data);
        }
}
}