const chai = require('chai')
const expect = chai.expect
const spies = require('chai-spies')
chai.use(spies)
const spy = chai.spy
const cds = require('@sap/cds/lib')
const impl = require('../srv/interaction_srv.js')
const serverMSW = require('../mocks/server.js')

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
                    spy.on(impl, 'randomIntFrom0to999', () => 0)

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


})
