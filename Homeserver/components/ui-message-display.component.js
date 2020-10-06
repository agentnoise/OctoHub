import { BaseComponent } from "./base.js";
import Common from "../assets/libs/common.js";

export default class UiMessageDisplayComponent extends BaseComponent(HTMLUListElement)
{
    static get observedAttributes() { return []; }
    static register() { if(!customElements.get('ui-message-display')) { customElements.define('ui-message-display', UiMessageDisplayComponent, { extends: 'ul' }); } }

    constructor()
    {
        super();
    }

    //functionality
    showInfo(messageHTML)
    {

    }
    showSuccess(messageHTML)
    {
        
    }
    showWarning(messageHTML)
    {

    }
    showError(messageHTML)
    {

    }

    showMessage(type, messageHTML, delay)
    {

    }

    handleError(error)
    {
        let message;
        if(!(error instanceof Common.UIError))
        {
            message = "An internal app error has occurred. Please save what you are working on and refresh the app.";
            console.error(error);
        }
        else
        {
            message = error.message;
        }

        this.showError(message);
    }
}