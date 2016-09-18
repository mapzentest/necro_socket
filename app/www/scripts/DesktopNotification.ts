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

    public sendNotification = (item: IPokemonItem): void => {
    if (!this.config && this.config.EnableDesktopNotificaiton) return;

    var notification = new Notification(`${item.Name} - ${item.Rarity}`,
        {
            icon: `https://df48mbt4ll5mz.cloudfront.net/images/pokemon/${item.PokemonId}.png`,
            data: item,
            body: `Name: ${item.Name}
                IV: ${Math.round(item.IV)} %
                LV: ${item.Level}`
        });
}
}