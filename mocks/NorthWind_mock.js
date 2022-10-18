module.exports = {
    tx: function (request) {
        return {
            run: function (query) {
                console.log("##################################################### called mocked NorthWind.tx.run()")
                return { ID: 0, Name: 'Bread' }
            }
        }
    }
}