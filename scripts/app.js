export default class App
{
    constructor(call)
    {

    }
    async init()
    {
        const bob="alice";
        let myInit = await this.initMyPromise();
        console.log(myInit);
    }

    async initMyPromise() 
    {
        return new Promise(function (resolve, reject) 
        {
            resolve("Another Test");    
        });
    }
}