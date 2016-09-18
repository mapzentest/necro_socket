/// <reference path="./ILocalStorage.ts" />

interface IAppConfig extends IStorageItem{
    EnableDesktopNotification:boolean;
    EnableToastNotification:boolean;
    UseMSniper:boolean;
    UsePokesnipers :boolean;
    UseCustomSniper:boolean;
    CustomSniperLink?: string;
    ToastPosition?: string;
}