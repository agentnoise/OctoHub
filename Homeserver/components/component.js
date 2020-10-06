import Components from "./components.js";

export default class BasicComponent extends HTMLElement
{
    static get observedAttributes() { return []; }

    constructor() { super(); }

    async _init() { }

    async connectedCallback()
    {
        let contentTarget = this;
        if(Components.useShadowRoot)
        {
            contentTarget = this.attachShadow({ mode: 'open' });
        }

        let resource = Components.getResource(this.constructor.name);
        contentTarget.appendChild(resource.template.content.cloneNode(true));
        
        Components.setStyle(this);

        await this._init();
        this.__isConnected = true;
        this.dispatchComponentEvent(this, 'onconnect');
    }
    disconnectedCallback()
    {
        this.__isConnected = false;
        this.dispatchComponentEvent(this, 'ondisconnect');
    }
    adoptedCallback() { this.dispatchComponentEvent(this, 'onadopted'); }

    dispatchComponentEvent($target, eventName, data)
    {
        if($target == this)
        {
            let customEvent = (data) ? new CustomEvent(eventName, { detail: data }) : new CustomEvent(eventName); this.dispatchEvent(customEvent);
        }

        let handlerAttributeName = 'on' + eventName;
        let onEvent = $target.getAttribute(handlerAttributeName);
        if(onEvent)
        {
            try
            {
                onEvent = onEvent.split('.').reduce((o,i)=> { return o[i]; }, window);
                onEvent({target: $target, detail: data });
            }
            catch(exception)
            {
                console.error("Unable to execute callback: " + exception.message);
            }
        }
    }
}