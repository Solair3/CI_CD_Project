var expect = require('chai').expect
const cds = require ('@sap/cds/lib')

describe('Array', function () {
  describe('#indexOf()', function () {
    it('should return -1 when the value is not present', function () {
      expect([1, 2, 3].indexOf(4)).to.equal(-1)
    })
  })
})

describe('Interaction service handler', function () {

    const { GET, axios } = cds.test()
    axios.defaults.auth = { username: 'any', password: 'any' }

    describe('Items', function() {
        it('should return data', async function() {
            const {data, status} = await GET`/catalog/Interactions_Header/1`
            expect(status).to.eql(200)
            expect(data).to.contain({"ID":1})
        })
    })
})
