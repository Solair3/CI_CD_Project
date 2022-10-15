const cds = require('@sap/cds')
const xsenv = require('@sap/xsenv')
xsenv.loadEnv()
var request = require('request')

class CatalogService extends cds.ApplicationService { async init(){
    const { Interactions_Items } = cds.entities

    this.on("READ", "Interactions_Items", async (req, next) => {
        let data = await next()
    
        let dateTime = new Date().toLocaleString()
        data = await modifyLOGTEXT(data, dateTime)

        return data
    })

    await super.init()
}}

async function modifyLOGTEXT(data, dateTime) {
    catFact = JSON.parse(await getBody('https://catfact.ninja/fact'))

    data.forEach(each => {
        each.LOGTEXT = each.LANGU + " --- " + each.LOGTEXT + " --- " +
            dateTime + " --- " + module.exports.randomIntFrom0to999() + " --- " + catFact.fact
    });
    
    return data
}

function randomIntFrom0to999() {
    return getRandomInt(1000)
}

function getRandomInt(max) {
    return Math.floor(Math.random() * max)
}

async function getBody(url) {
    const options = {
        url: url,
        method: 'GET',
    };

    return new Promise(function(resolve, reject) {
        request.get(options, function(err, resp, body) {
        if (err) {
            reject(err);
        } else {
            resolve(body);
        }
        })
    })
}

module.exports = { CatalogService, modifyLOGTEXT, randomIntFrom0to999 }