const chai = require('chai')
const expect = chai.expect
const spies = require('chai-spies')
chai.use(spies)
const spy = chai.spy
const cds = require ('@sap/cds/lib')
const impl = require('../srv/interaction_srv.js')


describe('Array', function () {
  describe('#indexOf()', function () {
    it('should return -1 when the value is not present', function () {
      expect([1, 2, 3].indexOf(4)).to.equal(-1)
    })
  })
})

describe('Interaction service', function () {

    const { GET, axios } = cds.test()
    axios.defaults.auth = { username: 'any', password: 'any' }

    describe('service', function() {
        it('should return data', async function() {
            const {data, status} = await GET`/catalog/Interactions_Header/1`
            expect(status).to.eql(200)
            expect(data).to.contain({'ID':1})
        })
    })

    describe('handler', function() {
        afterAll(function() {
            chai.spy.restore()
        })

        it('should return LOGTEXT with language and time now', function() {
            const each = {
                'LOGTEXT': 'Some text.',
                'LANGU': 'GE'
            }
            dateTime = '01/1/2000, 00:00:00 AM'
            spy.on(impl, 'testF', () => 'test')

            ret = impl.modifyLOGTEXT(each, dateTime)

            expect(ret.LOGTEXT).to.eql('GE --- Some text. --- 01/1/2000, 00:00:00 AM --- test')
        })
    })
})
