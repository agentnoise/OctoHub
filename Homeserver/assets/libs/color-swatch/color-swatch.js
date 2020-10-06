export default class ColorSwatch extends HTMLElement
{
    // Basic component scaffolding
    static get observedAttributes() { return ['color', 'description']; }
    static register() { if(!customElements.get('color-swatch')) { customElements.define('color-swatch', ColorSwatch); } }
    async connectedCallback() { await this._init(); this.__isConnected = true; this.dispatchComponentEvent(this, 'onconnect'); }
    disconnectedCallback() { this.__isConnected = false; this.dispatchComponentEvent(this, 'ondisconnect'); }
    adoptedCallback() { this.dispatchComponentEvent(this, 'onadopted'); }

    // component definition
    get color() { return this._color; }
    set color(val) { this._color = val; if(this.$swatch) { this.$swatch.style.backgroundColor = val; } if(this.$hex) { this.$hex.innerText = val; } }
    get description() { return this._description; }
    set description(val) { this._description = val; if(this.$description) { this.$description.innerText = val; } }

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
    attributeChangedCallback(name, oldValue, newValue)
    {
        if(!this.__isConnected)
        {
            return;
        }

        if(ColorSwatch.observedAttributes.indexOf(name) > -1)
        {
            this[name] = newValue;
        }
        
        this.dispatchComponentEvent(this, 'onattributechanged', { name: name, oldValue: oldValue, newValue: newValue });
    }

    async _init()
    {
        await this._createStaticElements();

        let colorAttribute = this.getAttribute('color') || '#000000';
        this.color = colorAttribute;

        let descriptionAttribute = this.getAttribute('description') || '';
        this.description = descriptionAttribute;
    }
    async _createStaticElements()
    {
        this.attachShadow({ mode: 'open' });

        this.shadowRoot.innerHTML = `<div class="swatch"></div>
        <div class="display">
            <div class="hex"></div>
            <div class="description"></div>
        </div>`;

        let styleResponse = await fetch('/assets/libs/color-swatch/color-swatch.css');
        let css = await styleResponse.text();
        let minifiedStyle = css.replace(/(\r\n?|(\s\s)+)/g,'');
        let style = document.createElement('style');
        style.innerText = minifiedStyle;
        this.shadowRoot.prepend(style);

        this.$swatch = this.shadowRoot.querySelector('.swatch');
        this.$display = this.shadowRoot.querySelector('.display');
        this.$hex = this.shadowRoot.querySelector('.hex');
        this.$description = this.shadowRoot.querySelector('.description');
    }
    
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
