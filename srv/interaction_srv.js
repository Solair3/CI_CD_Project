const cds = require('@sap/cds')

class CatalogService extends cds.ApplicationService { async init(){
    const { Interactions_Items } = cds.entities

    this.after("READ", "Interactions_Items", each => {
        let dateTime = new Date().toLocaleString()
        each = modifyLOGTEXT(each, dateTime)
        return each
    })

    await super.init()
}}

function modifyLOGTEXT(each, dateTime) {
    each.LOGTEXT = each.LANGU + " --- " + each.LOGTEXT + " --- " + dateTime + " --- " + module.exports.testF()
    return each
}

function testF() {
    return new Date().toLocaleString()
}

module.exports = { CatalogService, modifyLOGTEXT, testF }