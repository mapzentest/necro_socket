/// <reference path="./../../../_all.d.ts" />
/// <reference path="../../models/IPokemonItem.ts" />
/// <reference path="./IMenuItem.ts" />
/// <reference path=".//enums.ts" />
declare module moment {
    interface Duration {
        format(template?: string | Function, precision?: number, settings?: Object): string;
    }
}
declare var tinysort: any;

class App {
    private socket: SocketIOClient.Socket;
    private menu: JQuery;
    private pokemons: IPokemonItem[];
    private sortType: string = "Update";
    private sortOrder: string = "asc";
    private pokemonItemSelector: string = '.pkm-item-query';
    private totalPokemon: number = 0;
    private counterElement: JQuery = $('#counter');
    constructor() {

        this.setupMenu();
        this.socket = io();
        this.socket.connect()
        this.config();
        this.pokemons = [];

    }
    public run = (): void => {
        this.socket.emit("pokemons");
        this.updateTimerCount();
    }

    private onMenuItemClick = (ev: JQueryEventObject): void => {
        const menuItem = $(ev.target);
        this.sortType = menuItem.closest('.nav-item').attr('data-sortBy');
        this.menu.find('.active').removeClass('active');
        menuItem.closest('.nav-item').addClass('active');
        menuItem.toggleClass('desc');
        this.sortOrder = menuItem.hasClass('desc') ? 'desc' : 'asc';
        $('#sort-indicator').remove();

        const arrow = $(` <i class="fa fa-sort-${this.sortOrder}" aria-hidden="true" id='sort-indicator'></i>`)
        menuItem.append(arrow)
        this.applySort();
    }

    private applySort = (): void => {
        tinysort(this.pokemonItemSelector, { attr: this.sortType, order: this.sortOrder });
    };

    private setupMenu = (): void => {
        this.menu = $('#mainNav');
        this.menu.find('.nav-link').click(this.onMenuItemClick);
    }

    private round = (originalNumber: number, digit: number): number => {
        var p = Math.pow(10, digit);
        return Math.floor(originalNumber * p) / p
    }
    private updateTimerCount = (): void => {
        let hasRemoveItem = false;
        $('.timer', "#pokemons").each(function () {
            var el = $(this);
            var now = moment();
            var time = parseFloat(el.attr('expired'));
            var expired = moment.utc(time)
            var diff = moment.duration(expired.diff(now)).format("mm:ss");
            if (now > expired) {
                this.totalPokemon = this.totalPokemon - 1;
                hasRemoveItem = true;
                
                el.closest('.pokemon-item').slideUp(1500,'swing', function() {
                    $(this).remove();
                });

            } else
                el.text(diff);
        });
        if(hasRemoveItem) {
            this.updateNumber();
        }

        setTimeout(this.updateTimerCount, 1000)
    }
    private addPokemonItem = (data: IPokemonItem): void => {

        $('#loading').remove();
        var template = $("#template")
            .clone()
            .addClass(this.pokemonItemSelector.replace('.', ''))
            .attr('id', data.SpawnPointId)
            .attr('Level', data.Level)
            .attr('Expires', data.ExpireTimestamp)
            .attr('PokemonName', data.Name)
            .attr('IV', data.IV)
            .attr('Rarity', PokemonRarities[data.Rarity])
            .attr('Update', (new Date().getTime()));

        const iv = this.round(data.IV, 2);
        const endTime = moment.utc(data.ExpireTimestamp)
        const exp = moment.duration(endTime.diff(moment())).format("mm:ss");
        const sniperLink = "msniper://" + data.Name + "/" + data.EncounterId + "/" + data.SpawnPointId + "/" + data.Latitude + "," + data.Longitude + "/" + iv;

        template.find('.card-title').text(`LV${data.Level} - ${data.Name}`)
        template.find('.timer').text(exp).attr('expired', data.ExpireTimestamp)
        template.find('.iv').text(`IV : ${iv}%`)
        template.find('.coordinate').text("[" + this.round(data.Latitude, 5) + "," + this.round(data.Longitude, 5) + "]")
        template.find('.pokemon-image').attr('src', 'https://df48mbt4ll5mz.cloudfront.net/images/pokemon/' + data.PokemonId + '.png')
        template.find('.sniper-links').attr('href', sniperLink)
        template.find('.card').addClass(data.Rarity);

        $('#pokemons').prepend(template);
    }

    private config = (): void => {
        this.socket.on('pokemons', this.onPokemonItems)
        this.socket.on('pokemon', this.onPokemonItem);
    }

    private onPokemonItem = (data: IPokemonItem): void => {
        //this.pokemons.push(data);
        this.addPokemonItem(data)
        this.applySort();
        this.totalPokemon = this.totalPokemon + 1;
        this.updateNumber();
    }
    private updateNumber = (): void => {
        this.counterElement.text(this.totalPokemon);
        let el = this.counterElement;

        // $({ someValue: Math.max(this.totalPokemon-3,0) }).animate({ someValue: this.totalPokemon }, {
        //     duration: 1000,
        //     easing: 'swing', // can be anything
        //     step: function () { // called on every step
        //         // Update the element's text with rounded-up value:
        //         el.text(Math.ceil(this.someValue));
        //     }
        // });

    }
    private onPokemonItems = (msg: IPokemonItem[]): void => {
        if (msg && msg.length) {
            _.forEach(msg, (s) => {
                //this.pokemons.push(s);
                this.totalPokemon = this.totalPokemon + 1;
                this.updateNumber();

                this.addPokemonItem(s);
            })
        }

    }
}