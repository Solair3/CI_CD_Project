const cds = require('@sap/cds')
const xsenv = require('@sap/xsenv')
xsenv.loadEnv()
var request = require('request')

class CatalogService extends cds.ApplicationService {
    async init() {
        this.db = await cds.connect.to('db')
        const { Interactions_Items } = cds.entities

        this.on("READ", "Interactions_Items", async (req, next) => {
            let data = await next()

            let dateTime = new Date().toLocaleString()
            data = await this.modifyLOGTEXT(data, dateTime)

            // Just to use xsenv
            console.log("Hana service host: ", this.constructor.getHanaService().hana.host)

            return data
        })

        await super.init()
    }

    async modifyLOGTEXT(data, dateTime) {
        this.catFact = JSON.parse(await this.getBody('https://catfact.ninja/fact'))
    
        if (Array.isArray(data)) {
            await Promise.all(
                data.map(async (each) => {
                    await this.modifyOneItem(each, dateTime)
                })
            )
        } else {
            data = await this.modifyOneItem(data, dateTime)
        }
        return data
    }

    async modifyOneItem(each, dateTime) {
        const { Interactions_Header } = this.db.entities
        const header = await this.db.run(SELECT.one `LOG_DATE` .from(Interactions_Header) .where `ID=${each.INTHeader_ID}`)
        
        each.LOGTEXT = each.LANGU + ` --- ${header?.LOG_DATE} --- ` + each.LOGTEXT + " --- Time now: " +
            dateTime + ` --- Random numbers: ${this.randomIntFrom0to999()} ${this.constructor.randomIntFrom0to999()}` +
            " --- Random fact about cats: " + this.catFact.fact

        return each
    }
    
    randomIntFrom0to999() {
        return this.getRandomInt(1000)
    }

    static randomIntFrom0to999() {
        return this.getRandomInt(1000)
    }
    
    getRandomInt(max) {
        return Math.floor(Math.random() * max)
    }

    static getRandomInt(max) {
        return Math.floor(Math.random() * max)
    }
    
    async getBody(url) {
        const options = {
            url: url,
            method: 'GET',
        };
    
        return new Promise(function (resolve, reject) {
            request.get(options, function (err, resp, body) {
                if (err) {
                    reject(err);
                } else {
                    resolve(body);
                }
            })
        })
    }

    static getHanaService() {
        return xsenv.getServices({ hana: {tag: "hana"} })
    }
}

module.exports = { CatalogService }

function logAllProperties(obj) {
    let keys = []
    for (var key in obj) {
        keys.push(key)
    }
    console.log("Found properties: ", keys)
}