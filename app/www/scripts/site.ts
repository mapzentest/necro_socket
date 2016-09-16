/// <reference path="./../../../_all.d.ts" />
declare module moment {
    interface Duration {
        format(template?: string | Function, precision?: number, settings?: Object): string;
    }
}

class App {
    private socket: SocketIOClient.Socket;
    constructor() {
        this.socket = io();
        this.socket.connect()
        this.config();
    }
    public run = (): void => {
        this.socket.emit("pokemons");
        this.updateTimerCount();
    }
    private round = (originalNumber: number, digit: number): number => {
        var p = Math.pow(10, digit);
        return Math.floor(originalNumber * p) / p
    }
    private updateTimerCount = (): void => {
        $('.timer', "#pokemons").each(function () {
            var el = $(this);
            var now = moment();
            var time = parseFloat(el.attr('expired'));
            var expired = moment.utc(time)
            var diff = moment.duration(expired.diff(now)).format("mm:ss");
            if (now > expired) {
                el.closest('.pokemon-item').fadeOut().remove();
            } else
                el.text(diff);
        })

        setTimeout("updateTimerCount", 1000)
    }
    private addPokemonItem = (data: any): void => {
        $('#loading').remove();
        var template = $("#template").clone().attr('id', data.SpawnPointId);
        var iv = Math.floor(data.IV * 100) / 100;
        var endTime = moment.utc(data.ExpireTimestamp)
        var exp = moment.duration(endTime.diff(moment())).format("mm:ss");
        template.find('.card-title').text("#" + data.PokemonId + " " + data.Name)
        template.find('.timer').text(exp).attr('expired', data.ExpireTimestamp)
        template.find('.iv').text("IV : " + iv + "%")
        template.find('.coordinate').text("[" + this.round(data.Latitude, 5) + "," + this.round(data.Longitude, 5) + "]")
        template.find('.pokemon-image').attr('src', 'https://df48mbt4ll5mz.cloudfront.net/images/pokemon/' + data.PokemonId + '.png')
        var sniperLink = "msniper://" + data.Name + "/" + data.EncounterId + "/" + data.SpawnPointId + "/" + data.Latitude + "," + data.Longitude + "/" + iv;
        console.log(sniperLink);
        template.find('.sniper-links').attr('href', sniperLink)
        template.find('.card').addClass(data.Rarity);
        $('#pokemons').prepend(template);


    }
    private config = (): void => {
        this.socket.on('pokemons', this.onPokemonItems)
        this.socket.on('pokemon', this.onPokemonItem);
    }
    private onPokemonItem = (msg: any): void => {
        var data = eval(msg);
        this.addPokemonItem(data)
    }

    private onPokemonItems = (msg: any): void => {
        if (msg && msg.length) {
            _.forEach(msg, (s) => {
                this.addPokemonItem(s);
            })
        }

    }
}