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
            result = [1, 2, 3].indexOf(4)

            expect(result).to.equal(-1)
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
            const fakeGetHanaService = sinon.replace(CatalogService, "getHanaService",
                sinon.fake.returns({ hana: { host: "https://example.com" } }))

            const { data, status } = await GET`/catalog/Interactions_Items(TEXT_ID='1',INTHeader_ID=1)`

            expect(fakeGetHanaService).to.have.been.calledOnce
            expect(status).to.eql(200)
            expect(data).to.contain({ "INTHeader_ID": 1, "TEXT_ID": "1", "LANGU": "EN" })
        })

        describe('handler of service', function () {
            describe('modifyLOGTEXT()', function () {
                it('should change data properly', async function () {
                    let srv = new CatalogService()
                    await srv.init()

                    // parameters for tested method
                    const data = [{
                        'LOGTEXT': 'Some text.',
                        'LANGU': 'GE',
                        'INTHeader_ID': 1,
                        'TEXT_ID': '1'
                    }]
                    dateTime = '01/1/2000, 00:00:00 AM'

                    // mocking method
                    chai.spy.on(CatalogService.prototype, 'randomIntFrom0to999', () => 0)
                    // mocking db
                    const fakeDbRun = sinon.replace(srv.db, "run", sinon.fake.returns({ LOG_DATE: "2022-01-01T00:00:00Z" }))
                    // mocking static method
                    const fakeStaticMethod = sinon.replace(CatalogService, "randomIntFrom0to999", sinon.fake.returns(0))

                    ret = await CatalogService.prototype.modifyLOGTEXT.apply(srv, [data, dateTime])

                    expect(fakeDbRun).to.have.been.calledOnce
                    expect(fakeDbRun).to.have.been.calledWith(SELECT.one`LOG_DATE`
                        .from('app.interactions.Interactions_Header').where`ID=1`)
                    expect(fakeStaticMethod).to.have.been.calledOnce
                    expect(ret[0].LOGTEXT).to.eql('GE --- 2022-01-01T00:00:00Z --- ' +
                        'Some text. --- Time now: 01/1/2000, 00:00:00 AM --- Random numbers: 0 0 --- ' +
                        'Random fact about cats: testCatFact')
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
