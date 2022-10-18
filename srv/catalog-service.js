const cds = require('@sap/cds');

module.exports = { cds }

class NorthWindCatalogService extends module.exports.cds.ApplicationService { 
    async init() {
        const { Products } = this.entities
        const service = await module.exports.cds.connect.to('NorthWind')

        this.on('READ', Products, request => {
            return service.tx(request).run(request.query)
        });
    }
}

module.exports = { NorthWindCatalogService, ...module.exports }