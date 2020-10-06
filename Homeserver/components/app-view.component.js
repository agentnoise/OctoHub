import { BaseComponent } from "./base.js";

export default class AppViewComponent extends BaseComponent(HTMLLIElement)
{
    static get observedAttributes() { return []; }
    static register() { if(!customElements.get('app-view')) { customElements.define('ui-message-display', AppViewComponent, { extends: 'li' }); } }

    constructor()
    {
        super();

        this.setAttribute('is', 'li');
        
        this._createElements();
    }
    _createElements()
    {
        let literal = `<iframe></iframe>`;
        this.innerHTML = literal;
        
        this.$iframe = this.querySelector('iframe');

        let menuItemLiteral = `<span class="icon"></span><span class="title"></span>`;
        this.$menuItem = document.createElement('li');
        this.$menuItem.classList.add('menu-item', 'app');
        this.$menuItem.innerHTML = menuItemLiteral;

        this.$menuItem.$icon = this.$menuItem.querySelector('.icon');
        this.$menuItem.$title = this.$menuItem.querySelector('.title');
    }

    //handlers

    //functionality
    update(updatedData)
    {
        this.recordId = updatedData.id; //dont want to set this as the html element's id; can cause issues with css/queries/etc;
        delete updatedData.id;
        Object.assign(this, updatedData);

        this.$iframe.src = this.indexPath;
        this.$menuItem.$title.innerHTML = this.name;
        this.$menuItem.$icon.innerHTML = this.icon || '';
    }
}