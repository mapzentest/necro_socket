/// <reference path="./../../../_all.d.ts" />
/// <reference path="../../models/IPokemonItem.ts" />
/// <reference path="./IMenuItem.ts" />
/// <reference path=".//enums.ts" />
/// <reference path="INotification.ts" />
/// <reference path="DesktopNotification.ts" />
/// <reference path="IAppConfig.ts" />
/// <reference path="./StoreJsLocalStorage.ts" />

//I hate this, Love angular so much, I will change to AngularJS 2.0 later.

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
    private notifiers : INotification [] = []
    private pokemonListElement : JQuery = $("#pokemons");
    private settingsElement : JQuery = $("#settings");
    private loadingElement : JQuery = $("#loading");
    private configs : IAppConfig;
    private localStogare :ILocalStorage = new StoreJsLocalStorage();

    constructor() {

        this.setupMenu();
        this.setupSettings();
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
    
    private displayConfigData = () : void => {
        $('#desktop-notification-enable').prop('checked', this.configs && this.configs.EnableDesktopNotificaiton)
        $('#toast-notification-enable').prop('checked', this.configs && this.configs.EnableToastNotification)
        $('#use-msniper').prop('checked', this.configs && this.configs.UseMSniper)
        $('#use-pokesnipers').prop('checked', this.configs && this.configs.UsePokesnipers)
        $('#use-custom-sniper').prop('checked', this.configs && this.configs.UseCustomSniper)
        $('#custom-sniper-command').val(this.configs.CustomSniperLink)
        
    }
    private setupSettings = () : void => {
        //load setting from memory or local stogare
        this.configs = this.localStogare.read<IAppConfig>("app-settings");
        
        if(!this.configs) {
            this.configs = {
                EnableDesktopNotificaiton : false,
                EnableToastNotification : true,
                UseCustomSniper:false,
                UseMSniper:true,
                UsePokesnipers:false
            };    
        }
        $('#save-settings').click(this.saveSettings);
        $('#close-settings').click(this.toggleSettingsForm);
        this.displayConfigData();
        this.initNotifiers();
    }
    private initNotifiers = () :void => {
        if(!this.configs) return;

        this.notifiers =[];
        if(this.configs.EnableDesktopNotificaiton) {
            let destopNotifier = new DesktopNotification(this.configs);
            destopNotifier.requestPermission();
            this.notifiers.push(destopNotifier);
        }
    }

    private saveSettings = () : void => {
        this.configs = {
            EnableDesktopNotificaiton : $('#desktop-notification-enable').prop('checked'),
            EnableToastNotification : $('#toast-notification-enable').prop('checked'),
            UseCustomSniper:$('#use-custom-sniper').prop('checked'),
            UseMSniper:$('#use-msniper').prop('checked'),
            UsePokesnipers:$('#use-pokesnipers').prop('checked'),
            CustomSniperLink: $('#custom-sniper-command').val()
        };
        console.log(this.configs);
        this.initNotifiers();
        this.localStogare.save<IAppConfig>("app-settings", this.configs)
        //close setting form
        this.toggleSettingsForm();

    }

    private setupMenu = (): void => {
        this.menu = $('#mainNav');
        this.menu.find('.nav-link').click(this.onMenuItemClick);
        this.menu.find("#btn-settings").click(this.toggleSettingsForm);
    }

    private toggleSettingsForm = () : void => {
        if(this.settingsElement.hasClass('hidden-xs-up')) {
            this.loadingElement.hide();
            
            this.pokemonListElement.slideDown(1000, "swing", ()=>{
                this.pokemonListElement.addClass('hidden-xs-up'); 
                this.settingsElement.removeClass('hidden-xs-up').fadeIn(1000,"swing");
            });
            this.displayConfigData();
            //fill up value from this.configs....
        }   
        else{     
            if(this.totalPokemon == 0) {
                this.loadingElement.show();
            }

            this.settingsElement.slideDown(1000, "easing", ()=>{
                this.settingsElement.addClass('hidden-xs-up')
                this.pokemonListElement.removeClass('hidden-xs-up').fadeIn(1000,"swing");
            });

        }
    }

    private round = (originalNumber: number, digit: number): number => {
        var p = Math.pow(10, digit);
        return Math.floor(originalNumber * p) / p
    }
    private updateTimerCount = (): void => {
        let me = this;
        $('.timer', "#pokemons").each(function () {
            var el = $(this);
            var now = moment();
            var time = parseFloat(el.attr('expired'));
            var expired = moment.utc(time)
            var diff = moment.duration(expired.diff(now)).format("mm:ss");
            if (now > expired) {
                
                el.closest('.pokemon-item').slideUp(1500, 'swing', function () {
                    $(this).remove();
                    me.totalPokemon = me.totalPokemon - 1;
                    me.updateNumber();

                });

            } else
                el.text(diff);
        });
        
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

        template.find('.card-title').text(`LV${data.Level} - ${data.Name}`)
        template.find('.timer').text(exp).attr('expired', data.ExpireTimestamp)
        template.find('.iv').text(`IV : ${iv}%`)
        template.find('.coordinate').text("[" + this.round(data.Latitude, 5) + "," + this.round(data.Longitude, 5) + "]")
        template.find('.pokemon-image').attr('src', 'https://df48mbt4ll5mz.cloudfront.net/images/pokemon/' + data.PokemonId + '.png')
        template.find('.sniper-links').attr('href', this.buildSnipeLink(data))
        template.find('.card').addClass(data.Rarity);

        $('#pokemons').prepend(template);
    }

    private buildSnipeLink = (data: IPokemonItem ) :string => {
        let pattern = 'msniper://{Name}/{EncounterId}';
        if(this.configs.UseMSniper) {
            pattern = 'msniper://{Name}/{EncounterId}/{SpawnPointId}/{Latitude},{Longitude}/{IV}';
        }
        else if(this.configs.UsePokesnipers){
            pattern = 'pokesniper2://{Name}/{Latitude},{Longitude}';
        }
        else{
            pattern = this.configs.CustomSniperLink || pattern;
        }
        for (var prop in data) {
            var propValue = data[prop];
            if(prop == "IV") propValue = this.round(propValue,2);

            pattern = pattern.replace('{'+prop +'}', propValue);
        }

        //const sniperLink = "msniper://" + data.Name + "/" + data.EncounterId + "/" + data.SpawnPointId + "/" + data.Latitude + "," + data.Longitude + "/" + iv;
        return pattern;        
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

        _.each(this.notifiers, n=>n.sendNotification(data));
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