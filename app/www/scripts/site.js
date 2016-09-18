class App {
    constructor() {
        this.sortType = "Update";
        this.sortOrder = "asc";
        this.pokemonItemSelector = '.pkm-item-query';
        this.totalPokemon = 0;
        this.counterElement = $('#counter');
        this.notifiers = [];
        this.pokemonListElement = $("#pokemons");
        this.settingsElement = $("#settings");
        this.loadingElement = $("#loading");
        this.run = () => {
            this.socket.emit("pokemons");
            this.updateTimerCount();
        };
        this.onMenuItemClick = (ev) => {
            const menuItem = $(ev.target);
            this.sortType = menuItem.closest('.nav-item').attr('data-sortBy');
            this.menu.find('.active').removeClass('active');
            menuItem.closest('.nav-item').addClass('active');
            menuItem.toggleClass('desc');
            this.sortOrder = menuItem.hasClass('desc') ? 'desc' : 'asc';
            $('#sort-indicator').remove();
            const arrow = $(` <i class="fa fa-sort-${this.sortOrder}" aria-hidden="true" id='sort-indicator'></i>`);
            menuItem.append(arrow);
            this.applySort();
        };
        this.applySort = () => {
            tinysort(this.pokemonItemSelector, { attr: this.sortType, order: this.sortOrder });
        };
        this.setupSettings = () => {
            $('#save-settings').click(this.saveSettings);
        };
        this.saveSettings = () => {
            this.configs = {
                EnableDesktopNotificaiton: $('#desktop-notification-enable').prop('checked')
            };
            this.notifiers = [];
            if (this.configs.EnableDesktopNotificaiton) {
                let destopNotifier = new DesktopNotification(this.configs);
                destopNotifier.requestPermission();
                this.notifiers.push(destopNotifier);
            }
            this.toggleSettingsForm();
        };
        this.setupMenu = () => {
            this.menu = $('#mainNav');
            this.menu.find('.nav-link').click(this.onMenuItemClick);
            this.menu.find("#btn-settings").click(this.toggleSettingsForm);
        };
        this.toggleSettingsForm = () => {
            if (this.settingsElement.hasClass('hidden-xs-up')) {
                this.loadingElement.hide();
                this.pokemonListElement.slideDown(1000, "swing", () => {
                    this.pokemonListElement.addClass('hidden-xs-up');
                    this.settingsElement.removeClass('hidden-xs-up').fadeIn(1000, "swing");
                });
            }
            else {
                if (this.totalPokemon == 0) {
                    this.loadingElement.show();
                }
                this.settingsElement.slideDown(1000, "easing", () => {
                    this.settingsElement.addClass('hidden-xs-up');
                    this.pokemonListElement.removeClass('hidden-xs-up').fadeIn(1000, "swing");
                });
            }
        };
        this.round = (originalNumber, digit) => {
            var p = Math.pow(10, digit);
            return Math.floor(originalNumber * p) / p;
        };
        this.updateTimerCount = () => {
            let me = this;
            $('.timer', "#pokemons").each(function () {
                var el = $(this);
                var now = moment();
                var time = parseFloat(el.attr('expired'));
                var expired = moment.utc(time);
                var diff = moment.duration(expired.diff(now)).format("mm:ss");
                if (now > expired) {
                    el.closest('.pokemon-item').slideUp(1500, 'swing', function () {
                        $(this).remove();
                        me.totalPokemon = me.totalPokemon - 1;
                        me.updateNumber();
                    });
                }
                else
                    el.text(diff);
            });
            setTimeout(this.updateTimerCount, 1000);
        };
        this.addPokemonItem = (data) => {
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
            const endTime = moment.utc(data.ExpireTimestamp);
            const exp = moment.duration(endTime.diff(moment())).format("mm:ss");
            const sniperLink = "msniper://" + data.Name + "/" + data.EncounterId + "/" + data.SpawnPointId + "/" + data.Latitude + "," + data.Longitude + "/" + iv;
            template.find('.card-title').text(`LV${data.Level} - ${data.Name}`);
            template.find('.timer').text(exp).attr('expired', data.ExpireTimestamp);
            template.find('.iv').text(`IV : ${iv}%`);
            template.find('.coordinate').text("[" + this.round(data.Latitude, 5) + "," + this.round(data.Longitude, 5) + "]");
            template.find('.pokemon-image').attr('src', 'https://df48mbt4ll5mz.cloudfront.net/images/pokemon/' + data.PokemonId + '.png');
            template.find('.sniper-links').attr('href', sniperLink);
            template.find('.card').addClass(data.Rarity);
            $('#pokemons').prepend(template);
        };
        this.config = () => {
            this.socket.on('pokemons', this.onPokemonItems);
            this.socket.on('pokemon', this.onPokemonItem);
        };
        this.onPokemonItem = (data) => {
            this.addPokemonItem(data);
            this.applySort();
            this.totalPokemon = this.totalPokemon + 1;
            this.updateNumber();
            _.each(this.notifiers, n => n.sendNotification(data));
        };
        this.updateNumber = () => {
            this.counterElement.text(this.totalPokemon);
            let el = this.counterElement;
        };
        this.onPokemonItems = (msg) => {
            if (msg && msg.length) {
                _.forEach(msg, (s) => {
                    this.totalPokemon = this.totalPokemon + 1;
                    this.updateNumber();
                    this.addPokemonItem(s);
                });
            }
        };
        this.setupMenu();
        this.setupSettings();
        this.socket = io();
        this.socket.connect();
        this.config();
        this.pokemons = [];
    }
}
