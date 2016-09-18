/// <reference path="INotification.ts" />
/// <reference path="IAppConfig.ts" />
class ToastNotification implements INotification {
    private config: IAppConfig;
    constructor(cfg: IAppConfig) {
        this.config = cfg;
    }

    public requestPermission = (): void => {
    }

    public sendNotification = (item: IPokemonItem, url:string): void => {
        if (!this.config || !this.config.EnableToastNotification) return;
        
        let options:ToastrOptions = {
            "closeButton": false,
            "debug": false,
            "newestOnTop": false,
            "progressBar": false,
            "positionClass": this.config.ToastPosition,
            toastClass: item.Rarity,
            "preventDuplicates": true,
            "showDuration": 300,
            "hideDuration": 1000,
            "timeOut": 5000,
            "extendedTimeOut": 1000,
            "showEasing": "swing",
            "hideEasing": "linear",
            "showMethod": "fadeIn",
            "hideMethod": "fadeOut",
            "onclick": () => {
                window.open(url,'_blank')   
            },
            
            }
        let htmlBody =`<div class="pokemon-toast-body">
            <img src="https://df48mbt4ll5mz.cloudfront.net/images/pokemon/${item.PokemonId}.png" width="60" />   
        </div> 
        `
         toastr.info(htmlBody,`${item.Name} IV ${Math.round(item.IV)}%`, options)   
    }
}