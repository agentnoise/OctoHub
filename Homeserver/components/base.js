export const BaseComponent = (htmlElementClass = HTMLElement) => class extends htmlElementClass
{
    // Basic component scaffolding
    static get observedAttributes() { return []; }
    async connectedCallback() { await this._init(); this.__isConnected = true; this.dispatchComponentEvent(this, 'onconnect'); }
    disconnectedCallback() { this.__isConnected = false; this.dispatchComponentEvent(this, 'ondisconnect'); }
    adoptedCallback() { this.dispatchComponentEvent(this, 'onadopted'); }

    // component definition
    constructor(attributes)
    {
        super();
        
        if(attributes != null)
        {
            for(let property in attributes)
            {
                if(attributes.hasOwnProperty(property))
                {
                    this.setAttribute(property, attributes[property]);
                }
            }
        }
    }
    _init(){}

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