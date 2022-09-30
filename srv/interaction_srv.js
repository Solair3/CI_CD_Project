module.exports = cds.service.impl(async function () {
    const { Interactions_Items } = cds.entities

    this.after("READ", "Interactions_Items", each => {
        let dateTime = new Date().toLocaleString()
        each.LOGTEXT = each.LANGU + " --- " + each.LOGTEXT + " --- " + dateTime 
        return each
    })
})