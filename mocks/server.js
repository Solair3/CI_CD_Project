const { setupServer } = require('msw/node')
const { rest } = require('msw')

module.exports = setupServer(
    rest.get('https://catfact.ninja/fact', (req, res, ctx) => {
        catFact = { 'fact': 'testFact', 'length': 8 }

        return res(ctx.json(catFact))
    })
)