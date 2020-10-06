let componentsDirectory = '/components/';
let useShadowRoot = true;
const components = {};
const globalStyles = [];

export default class Components
{
    static get componentsDirectory()
    {
        return componentsDirectory;
    }
    static set componentsDirectory(value)
    {
        componentsDirectory = value;
    }

    static get useShadowRoot()
    {
        return useShadowRoot;
    }
    static set useShadowRoot(value)
    {
        useShadowRoot = value;
    }

    static async register(components)
    {
        if(!Array.isArray(components))
        {
            components = [components];
        }
        
        for(let i = 0; i < components.length; i++)
        {
            await register(components[i]);
        }
    }

    static getResource(componenentClassName)
    {
        return components[componenentClassName];
    }

    static setStyle($component)
    {
        let name = $component.constructor.name;

        if(globalStyles.indexOf(name) > -1 && !useShadowRoot)
        {
            return;
        }
        
        let style = document.createElement('style');
        style.classList.add('component');
        let minifiedStyle = components[name].style.replace(/(\r\n?|(\s\s)+)/g,'');
        style.innerText = minifiedStyle;

        if(useShadowRoot)
        {
            $component.shadowRoot.prepend(style);
        }
        else
        {
            document.head.appendChild(style);
            globalStyles.push(name);
        }
    }
}

async function register(componentClassName)
{
    let baseName = toKebabCase(componentClassName);
    let resource = await getResource(baseName);
    
    components[componentClassName] = resource;
    

    customElements.define(baseName, resource.module);
}

function toKebabCase(value)
{
    value = value.replace(/\\.+$/, "") //trim trailing periods
            .replace(/[^\w\d\s]/g, '') //replace symbols
            .replace(/\s+/g, '-') //switch spaces for dashes
            .replace(/[A-Z]+/g, function ($1, offset, string) //replace capitals with dash then character
            {
                if (string.indexOf($1) == 0)
                {
                    return $1;
                }

                if (string.substring(string.indexOf($1) - 1, string.indexOf($1)) == '-')
                {
                    return $1;
                }

                return '-' + $1;
            })
            .toLowerCase(); //make the whole thing lowercase
    
    return value;
}

function request(route, method, body, headers)
{
    if(route == null || Object.prototype.toString.call(route) != "[object String]" || route.trim() == "")
    {
        throw new Error('Cannot request a resource without a route.');
    }

    method = method || (body) ? 'POST' : 'GET';
    headers = headers;

    return fetch(route, { method: method, body: body, headers: headers, referrer: 'no-referrer' })
    .then(function (response)
    {
        // The API call was successful!
        if (response.ok)
        {
            return response;
        }
        else
        {
            return Promise.reject(response);
        }
    })
    .catch(function (error)
    {
        console.error('There was an error requesting the resource.', error);
    });
}

async function getResource(baseName)
{
    let basePath = Components.componentsDirectory + baseName + '/' + baseName;
    let htmlPath = basePath + '.html';
    let stylePath = basePath + '.css';
    let scriptPath = basePath + '.js';

    let htmlResponse = await request(htmlPath);
    let html = await htmlResponse.text();
    let htmlTemplate = new DOMParser().parseFromString(html, 'text/html').querySelector('template');

    let styleResponse = await request(stylePath);
    let css = await styleResponse.text();

    let module = await import(scriptPath);

    return { template: htmlTemplate, style: css, module: module.default };
}