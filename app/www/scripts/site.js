class App {
    constructor() {
        this.sortType = "Update";
        this.sortOrder = "asc";
        this.pokemonItemSelector = '.pkm-item-query';
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
            tinysort(this.pokemonItemSelector, { attr: this.sortType, order: this.sortOrder });
        };
        this.applySort = () => {
        };
        this.setupMenu = () => {
            this.menu = $('#mainNav');
            this.menu.find('.nav-link').click(this.onMenuItemClick);
        };
        this.round = (originalNumber, digit) => {
            var p = Math.pow(10, digit);
            return Math.floor(originalNumber * p) / p;
        };
        this.updateTimerCount = () => {
            $('.timer', "#pokemons").each(function () {
                var el = $(this);
                var now = moment();
                var time = parseFloat(el.attr('expired'));
                var expired = moment.utc(time);
                var diff = moment.duration(expired.diff(now)).format("mm:ss");
                if (now > expired) {
                    el.closest('.pokemon-item').fadeOut().remove();
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
            template.find('.iv').text("IV : " + iv + "%");
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
            this.pokemons.push(data);
            this.addPokemonItem(data);
        };
        this.onPokemonItems = (msg) => {
            if (msg && msg.length) {
                _.forEach(msg, (s) => {
                    this.pokemons.push(s);
                    this.addPokemonItem(s);
                });
            }
        };
        this.setupMenu();
        this.socket = io();
        this.socket.connect();
        this.config();
        this.pokemons = [];
    }
}
