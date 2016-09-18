class DesktopNotification {
    constructor(cfg) {
        this.requestPermission = () => {
            if (!("Notification" in window)) {
                alert("This browser does not support desktop notification");
            }
            else if (Notification.permission === "granted") {
                var notification = new Notification("Hi there!, You will get notification when pokemon display here.");
                return;
            }
            else if (Notification.permission !== 'denied' || Notification.permission === "default") {
                Notification.requestPermission(function (permission) {
                    var notification = new Notification("Hi there!, You will get notification when pokemon display here.");
                });
            }
        };
        this.sendNotification = (item) => {
            if (!this.config && this.config.EnableDesktopNotificaiton)
                return;
            var notification = new Notification(`${item.Name} - ${item.Rarity}`, {
                icon: `https://df48mbt4ll5mz.cloudfront.net/images/pokemon/${item.PokemonId}.png`,
                data: item,
                body: `Name: ${item.Name}
                IV: ${Math.round(item.IV)} %
                LV: ${item.Level}`
            });
        };
        this.config = cfg;
    }
}
