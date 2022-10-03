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
    each.LOGTEXT = each.LANGU + " --- " + each.LOGTEXT + " --- " + dateTime
    return each
}

module.exports = { CatalogService, modifyLOGTEXT }