/// <reference path="../_all.d.ts" />
/// <reference path="models/IAppSettings.ts" />
import * as DiscordIO from 'discord.io';

class Discord implements ISubscribler {

    public bot: DiscordIO.Client;
    public token:string;
    public channels:string;

    constructor(token: string, channel: string) {
        this.channels = channel;
        this.token = token;

        this.bot = new DiscordIO.Client({
            token: token,
            autorun: true
        });
        var mybot =this.bot;

        mybot.on('ready', function () {
            console.log(mybot.username + " - (" + mybot.id + ")");
        });

        // bot.on('message', function (user, userID, channelID, message, event) {
        //     if (message === "ping") {
        //         bot.sendMessage({
        //             to: channelID,
        //             message: "pong"
        //         });
        //     }
        // });
    }
    public onPokemon = (pkm: IPokemonItem): void => {
        const iv = Math.round(pkm.IV * 100) / 100

        this.bot.sendMessage({
            to:this.channels,
            message:`**${pkm.Name}**    __${pkm.Latitude}, ${pkm.Longitude}__     IV: ${iv}%     expired: ${pkm.ExpireTimestamp}` 
        })
    }
}

export = module.exports = function (token: string, channels: string) {
    return new Discord(token, channels)
}
