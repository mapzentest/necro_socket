/// <reference path="./ILocalStorage.ts" />

interface IAppConfig extends IStorageItem{
    EnableDesktopNotificaiton:boolean;
    EnableToastNotification:boolean;
    UseMSniper:boolean;
    UsePokesnipers :boolean;
    UseCustomSniper:boolean;
    CustomSniperLink?: string;
}