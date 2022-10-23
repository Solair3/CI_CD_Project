const chai = require('chai')
const expect = chai.expect
const spies = require('chai-spies')
chai.use(spies)
var sinon = require("sinon");
var sinonChai = require("sinon-chai");
chai.use(sinonChai);
const cds = require('@sap/cds/lib')
const CatalogService = require('../srv/interaction_srv.js').CatalogService
const serverMSW = require('../mocks/server.js')

before('MSW: Establish API mocking before all tests.', () => serverMSW.listen({ onUnhandledRequest: 'bypass' }))
afterEach('MSW: Reset any request handlers that we may add during the tests', () => serverMSW.resetHandlers())
after('MSW: Clean up after the tests are finished.', () => serverMSW.close())
afterEach(() => sinon.restore());


describe('Array', function () {
    describe('#indexOf()', function () {
        it('should return -1 when the value is not present', function () {
            expect([1, 2, 3].indexOf(4)).to.equal(-1)
        })
    })
})

describe('CDS services', async function () {
    const cds_test = cds.test()
    const { GET, axios } = cds_test
    axios.defaults.auth = { username: 'any', password: 'any' }

    afterEach(() => chai.spy.restore())

    describe('CatalogService', function () {
        it('should return Interactions_Header data', async function () {
            const { data, status } = await GET`/catalog/Interactions_Header/1`
            expect(status).to.eql(200)
            expect(data).to.contain({ 'ID': 1 })
        })

        it('should return Interactions_Items data', async function () {
            const { data, status } = await GET`/catalog/Interactions_Items(TEXT_ID='1',INTHeader_ID=1)`
            expect(status).to.eql(200)
            expect(data).to.contain({"INTHeader_ID":1,"TEXT_ID":"1","LANGU":"EN"})
        })

        describe('handler of service', function () {
            describe('modifyLOGTEXT()', function () {
                it('should change data properly', async function () {
                    const data = [{
                        'LOGTEXT': 'Some text.',
                        'LANGU': 'GE'
                    }]
                    dateTime = '01/1/2000, 00:00:00 AM'
                    chai.spy.on(CatalogService.prototype, 'randomIntFrom0to999', () => 0)
                    let srv = new CatalogService()
                    await srv.init()

                    ret = await CatalogService.prototype.modifyLOGTEXT.apply(srv, [data, dateTime])

                    expect(ret[0].LOGTEXT).to.eql('GE --- 2022-01-01T00:00:00Z --- Some text. --- Time now: 01/1/2000, 00:00:00 AM --- Random number: 0 --- Random fact about cats: testCatFact')
                })
            })

            describe('randomIntFrom0to999()', function () {
                it('should return int from 0 to 999', function () {
                    a = CatalogService.prototype.randomIntFrom0to999()

                    expect(a).to.be.within(0, 999)
                })
            })
        })
    })

    describe('Service which connects to an external service', function () {
        // Now let's pretend that service cannot (or we don't want it to) connect to 
        // an external service during tests.
        // We will spy on cds.connect.to to mock external service when it is being connected to
        (function () {
            var cds_connect_to = cds.connect.to
            chai.spy.on(cds.connect, 'to', async function (nameOfModule) {
                if (nameOfModule === 'NorthWind') {
                    return require('../mocks/NorthWind_mock.js')
                } else {
                    return await cds_connect_to(nameOfModule)
                }
            })
        })()

        it('should return data', async function () {
            // expect(implementationOfNorthWindService.cds.connect.to).to.be.spy; 
            // Doesn't seem to work although it is a spy as I understand

            const { data, status } = await GET`/north-wind-catalog/Products/0`

            expect(status).to.eql(200)
            // should be not real data but mocked one:
            expect(data).to.contain({ ID: 0, Name: 'Very tasty test bread' })
        })
    })
})

function logAllProperties(obj) {
    let keys = []
    for (var key in obj) {
        keys.push(key)
    }
    console.log("Found properties: ", keys)
}
