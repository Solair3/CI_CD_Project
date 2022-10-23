const cds = require('@sap/cds')
const xsenv = require('@sap/xsenv')
xsenv.loadEnv()
var request = require('request')

class CatalogService extends cds.ApplicationService {
    async init() {
        const { Interactions_Items } = cds.entities

        this.on("READ", "Interactions_Items", async (req, next) => {
            let data = await next()

            let dateTime = new Date().toLocaleString()
            data = await this.modifyLOGTEXT(data, dateTime)

            return data
        })

        await super.init()
    }

    async modifyLOGTEXT(data, dateTime) {
        this.catFact = JSON.parse(await this.getBody('https://catfact.ninja/fact'))
    
        if (Array.isArray(data)) {
            data.forEach(each => {
                each = this.modifyOneItem(each, dateTime)
            });
        } else {
            data = this.modifyOneItem(data, dateTime)
        }
        return data
    }

    modifyOneItem(each, dateTime) {
        each.LOGTEXT = each.LANGU + " --- " + each.LOGTEXT + " --- Time now: " +
            dateTime + " --- Random number: " + this.randomIntFrom0to999() +
            " --- Random fact about cats: " + this.catFact.fact

        return each
    }
    
    randomIntFrom0to999() {
        return this.getRandomInt(1000)
    }
    
    getRandomInt(max) {
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
}

module.exports = { CatalogService }