const chai = require('chai')
const expect = chai.expect
const spies = require('chai-spies')
chai.use(spies)
const cds = require('@sap/cds/lib')
const impl = require('../srv/interaction_srv.js')
const implNorthWind = require('../srv/catalog-service.js')
const serverMSW = require('../mocks/server.js')

module.exports = { cds }

before('MSW: Establish API mocking before all tests.', () => serverMSW.listen({ onUnhandledRequest: 'bypass' }))
afterEach('MSW: Reset any request handlers that we may add during the tests', () => serverMSW.resetHandlers())
after('MSW: Clean up after the tests are finished.', () => serverMSW.close())

describe('Array', function () {
    describe('#indexOf()', function () {
        it('should return -1 when the value is not present', function () {
            expect([1, 2, 3].indexOf(4)).to.equal(-1)
        })
    })
})

describe('CDS services', function () {
    const { GET, axios } = cds.test()
    axios.defaults.auth = { username: 'any', password: 'any' }

    afterEach(function () {
        chai.spy.restore()
    })

    describe('CatalogService', function () {
        it('should return data', async function () {
            const { data, status } = await GET`/catalog/Interactions_Header/1`
            expect(status).to.eql(200)
            expect(data).to.contain({ 'ID': 1 })
        })

        describe('handler of service', function () {
            afterEach(function () {
                chai.spy.restore()
            })

            describe('modifyLOGTEXT()', function () {
                it('should change data properly', async function () {
                    const data = [{
                        'LOGTEXT': 'Some text.',
                        'LANGU': 'GE'
                    }]
                    dateTime = '01/1/2000, 00:00:00 AM'
                    chai.spy.on(impl, 'randomIntFrom0to999', () => 0)

                    ret = await impl.modifyLOGTEXT(data, dateTime)

                    expect(ret[0].LOGTEXT).to.eql('GE --- Some text. --- Time now: 01/1/2000, 00:00:00 AM --- Random number: 0 --- Random fact about cats: testCatFact')
                })
            })

            describe('randomIntFrom0to999()', function () {
                it('should return int from 0 to 999', function () {
                    a = impl.randomIntFrom0to999()

                    expect(a).to.be.within(0, 999)
                })
            })
        })
    })

    describe('Service which connects to an external service', function () {
        (function() {
            var cds_connect_to = implNorthWind.cds.connect.to
            chai.spy.on(implNorthWind.cds.connect, 'to', async function (nameOfModule) {
                if (nameOfModule === 'NorthWind') {
                    console.log("##################################################### mocking cds.connect.to")
                    return require('../mocks/NorthWind_mock.js')
                } else {
                    console.log("##################################################### calling original cds.connect.to")
                    return await cds_connect_to(nameOfModule)
                }
            })
        })()

        after(function () {
            chai.spy.restore()
        })

        it.skip('should return data', async function () {
            const { data, status } = await GET`/north-wind-catalog/Products/0`
            expect(status).to.eql(200)
            expect(data).to.contain({ ID: 0, Name: 'Bread' })
        })

        // Now let's pretend that service cannot (or we don't want it to) connect to 
        // an external service during tests.
        // We will mock external service.
        it('should return data. Same test as above but with mocked external service', async function () {
            // expect(implNorthWind.cds.connect.to).to.be.spy; // Doesn't seem to work although it is a spy as I understand

            const { data, status } = await GET`/north-wind-catalog/Products/0`

            console.log(data)
            expect(status).to.eql(200)
            // should be not real data but mocked one:
            expect(data).to.contain({ ID: 0, Name: 'Very tasty test bread' })
        })
    })
})
