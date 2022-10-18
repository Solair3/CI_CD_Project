const cds = require('@sap/cds');

class NorthWindCatalogService extends cds.ApplicationService { 
    async init() {
        const { Products } = this.entities
        const service = await cds.connect.to('NorthWind')

        this.on('READ', Products, request => {
            return service.tx(request).run(request.query)
        });
    }
}

module.exports = { NorthWindCatalogService }