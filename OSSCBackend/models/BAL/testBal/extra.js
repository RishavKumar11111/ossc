var mongo = require('../../mongo/mongo')
var newMongo = require('../../mongo/newMongo')

var db
mongo.mongoConnection(function(resp){
    db=resp
});
exports.getMinusBalance = async (req, res) => {
    try {
        // var db = await newMongo.mongoConnection()
        let response = await newMongo.findAll('sisOpeningStockDommy', db);
        response.forEach(async (element, idx, array) => {
            element.lotNo = element.Lot_No
            element.godownId = element.Godown_ID
            element.lotAddedBagSize = 0
            let response1 = await bagSizeForLot(element)
            if (response1.availableBagg < 0) {
                console.log(1, element.Lot_No, ' ', response1.availableBagg);
            } else {
                console.log('av:', response1.availableBagg);
            }
            if (idx === array.length - 1) {
                // newMongo.mongoClose(db);
                mongo.mongoClose(db)
            }
        });
        res.send({ message: 'success' })
    } catch (e) {
        console.log(555, e.message);
    }
}

var bagSizeForLot1 = function (data) {
    return new Promise(callback => {
        let y = data.lotNo
        let zzz = y.slice(4)
        var availableBagg = 0
        var aggrigate = [{
            $match: {
                'lot_Number': { $regex: zzz },
                'receiver_ID': data.godownId,
                'transitStatus': 'Received'
            }
        }, {
            $group: {
                _id: null,
                rcvTotal: { "$sum": '$no_of_Bag' },
                bagPerKg: { $first: "$qty_Per_Bag_Kg" }
            }
        }]

        var aggr = [{
            $match: {
                'lot_Number': { $regex: zzz },
                'source_ID': data.godownId,
                transitStatus: { $ne: 'Deleted' }
            }
        }, {
            $group: {
                _id: null,
                disTotal: { "$sum": '$no_of_Bag' }
            }
        }]
        mongo.queryWithAggregator(aggrigate, 'seedData', function (response) {
            mongo.queryWithAggregator(aggr, 'seedData', function (responsee) {
                try {
                    if (responsee.length == 0) {
                        availableBagg = response[0].rcvTotal
                        let bagSizePerKg = response[0].bagPerKg
                        let loadBagData = {}
                        loadBagData.availableBagg = availableBagg - data.lotAddedBagSize
                        loadBagData.bagSizePerKg = bagSizePerKg

                        callback(loadBagData)
                    } else {

                        availableBagg = response[0].rcvTotal - responsee[0].disTotal
                        let bagSizePerKg = response[0].bagPerKg
                        let loadBagData = {}
                        loadBagData.availableBagg = availableBagg - data.lotAddedBagSize
                        loadBagData.bagSizePerKg = bagSizePerKg
                        callback(loadBagData)
                    }
                } catch (e) {

                }


            })

        })
    })
}

var bagSizeForLot = function (data) {
    return new Promise(async callback => {
        try {
            let y = data.lotNo
            let zzz = y.slice(16)
            var availableBagg = 0
            var aggrigate = [{
                $match: {
                    'lot_Number': { $regex: zzz },
                    'receiver_ID': data.godownId,
                    'transitStatus': 'Received'
                }
            }, {
                $group: {
                    _id: null,
                    rcvTotal: { "$sum": '$no_of_Bag' },
                    bagPerKg: { $first: "$qty_Per_Bag_Kg" }
                }
            }]

            var aggr = [{
                $match: {
                    'lot_Number': { $regex: zzz },
                    'source_ID': data.godownId,
                    transitStatus: { $ne: 'Deleted' }
                }
            }, {
                $group: {
                    _id: null,
                    disTotal: { "$sum": '$no_of_Bag' }
                }
            }]
            // var db = await newMongo.mongoConnection()
            let response = await newMongo.queryWithAggregator(aggrigate, 'seedData', db)
            let responsee = await newMongo.queryWithAggregator(aggr, 'seedData', db)

            if (responsee.length == 0) {
                console.log('lot check',data.lotNo);
                availableBagg = response[0].rcvTotal
                let bagSizePerKg = response[0].bagPerKg
                let loadBagData = {}
                loadBagData.availableBagg = availableBagg - data.lotAddedBagSize
                loadBagData.bagSizePerKg = bagSizePerKg
                // db.close()
                callback(loadBagData)
            } else {

                availableBagg = response[0].rcvTotal - responsee[0].disTotal
                let bagSizePerKg = response[0].bagPerKg
                let loadBagData = {}
                loadBagData.availableBagg = availableBagg - data.lotAddedBagSize
                loadBagData.bagSizePerKg = bagSizePerKg
                // db.close()
                callback(loadBagData)
            }
        } catch (e) {
            console.log(666, e.message);
        }

    })
}