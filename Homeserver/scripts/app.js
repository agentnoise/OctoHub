import Components from "../components/components.js";
import ColorSwatch from "../assets/libs/color-swatch/color-swatch.js";
import AppViewComponent from "../components/app-view.component.js";

export default class App
{
    constructor()
    {
        this._package = null;
        this.appManifest = null;
        this.appViews = [];
    }
    async init()
    {
        this._package = await _getPackage();
        
        await this._registerComponents();
        this._getStaticElements();
        this._addEventListeners();

        this.$header.$clientName.innerHTML = this._package.clientName;
        if(this._package.clientLogo != null && this._package.clientLogo != null)
        {
            this.$header.$logo.innerHTML = this._package.clientLogo;
        }
        this.$header.$clientDescription.innerHTML = this._package.clientDescription;

        this.updateApps();

        // this.showPage('colors');
    }
    async _registerComponents()
    {
        AppViewComponent.register();
        // // style-guide helper components
        // ColorSwatch.register();

        // // app-building components
        // let components = 
        // [
        //     'TextInput',
        //     'NumberInput',
        //     'TextareaInput',
        // ];
        // Components.register(components);
    }
    _getStaticElements()
    {
        this.$header = document.querySelector('main > header');
        this.$header.$logo = this.$header.querySelector('.logo');
        this.$header.$clientName = this.$header.querySelector('.type .name');
        this.$header.$clientDescription = this.$header.querySelector('.type .description');

        this.$navigation = document.querySelector('nav .apps');
        this.$contextTray = document.querySelector('.context-tray');
        this.$appViews = document.querySelector('.app-views');
    }
    _addEventListeners()
    {
        let menuItems = this.$navigation.querySelectorAll('.menu-item');
        [].map.call(menuItems, ($menuItem) =>
        {
            $menuItem.addEventListener('click', this._menuItem_onClick.bind(this));
        });
    }

    //handlers
    _menuItem_onClick(event)
    {
        let $menuItem = event.currentTarget;
        let target = $menuItem.dataset.id;
        this.showPage(target);
    }

    //functionality
    notify(message, logAttributes)
    {
        //TODO: log, display to user, save to DB, whatever else.
    }

    async startLoading()
    {

    }
    async endLoading()
    {

    }

    showAppView(target)
    {
        // this.hideAppViews();

        // let $page = this.$pages[`$${target}`];
        // if($page != null)
        // {
        //     $page.classList.add('show');
        //     $page.$menuItem.classList.add('selected');
        // }
    }
    hideAppViews()
    {
        // let views = document.querySelectorAll('.app-view');
        // [].map.call(views, ($view) =>
        // {
        //     $view.classList.remove('show');
        // });

        // let menuItems = this.$navigation.querySelectorAll('.menu-item');
        // [].map.call(menuItems, ($menuItem) =>
        // {
        //     $menuItem.classList.remove('selected');
        // });
    }

    findApp(id)
    {
        for(let i = 0; i < this.appViews.length; i++)
        {
            let $appView = this.appViews[i];
            if($appView.recordId === id)
            {
                return $appView;
            }
        }
        return null;
    }
    async updateApps()
    {
        this.appManifest = await _getAppManifest();
        if(this.appManifest == null)
        {
            this.notify("App manifest's value returned as null.");
            return;
        }

        let currentIds = [];
        for(let i = 0; i < this.appManifest.length; i++)
        {
            let appData = this.appManifest[i];
            let $appView = this.updateApp(appData);
            if(currentIds.indexOf($appView.recordId) == -1)
            {
                currentIds.push($appView.recordId);
            }
        }

        for(let i = 0; i < this.appViews.length; i++)
        {
            let $appView = this.appViews[i];
            if(currentIds.indexOf($appView.recordId) == -1)
            {
                this.removeApp($appView);
            }
        }
    }
    updateApp(appData)
    {
        let $existingApp = this.findApp(appData.id);
        if($existingApp == null)
        {
            $existingApp = this.addApp();
        }
        
        $existingApp.update(appData);

        return $existingApp;
    }
    addApp()
    {
        let $newApp = new AppViewComponent();
        this.appViews.push($newApp);
        this.$appViews.appendChild($newApp);
        this.$navigation.appendChild($newApp.$menuItem);

        $newApp.$menuItem.addEventListener('click', this._menuItem_onClick.bind(this));

        return $newApp;
    }
    removeAppById(id)
    {
        let $appView = this.findApp(id);
        this.removeApp($appView);
    }
    removeApp($appView)
    {
        $appView.remove();
        $appView.$menuItem.remove();
        
        let index = this.appViews.indexOf($appView);
        if(index > -1)
        {
            this.appViews.splice(index, 1);
        }
    }
}

async function _getPackage()
{
    let payload = await fetch('./package.json');
    if(payload == null)
    {
        throw new Error('Unable to find package file.');
    }

    return await payload.json();
}

async function _getAppManifest()
{
    let payload = await fetch('./apps.manifest');
    if(payload == null)
    {
        throw new Error('Unable to find package file.');
    }

    return await payload.json();
}