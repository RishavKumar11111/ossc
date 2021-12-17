
var mongo = require('../../mongo/mongo')
var newMongo = require('../../mongo/newMongo')

exports.insertSellData = (data, callback) => {
    var aggri = [
        {
            '$match': {
                '$or': [
                    // {
                    //     'all_Godowns.godown_ID': data.source_ID
                    // }, 
                    {
                        'all_Godowns.godown_ID': data.source_ID
                    }
                ]
            }
        }, {
            '$unwind': {
                'path': '$all_Godowns'
            }
        }, {
            '$match': {
                '$or': [
                    // {
                    //     'all_Godowns.godown_ID': data.source_ID
                    // }, 
                    {
                        'all_Godowns.godown_ID': data.source_ID
                    }
                ]
            }
        }
    ]
    mongo.queryWithAggregator(aggri, 'godownMaster', async function (response) {
        try {
            data.sourceGodownName = await response[0].all_Godowns.godown_Name
            data.sourceDist = await response[0].districtName
            data.sourceDistCode = await response[0].districtCode
            data.destinGodownName = await response[0].all_Godowns.godown_Name
            data.destinDist = await response[0].districtName
            data.destinDistCode = await response[0].districtCode

            mongo.insertDocument(data, 'seedData', (responsee) => {
                callback(responsee)
            })
        } catch (e) {

        }


    })
}

exports.rejectSisSoldLot = async (data, callback) => {
    try {
        data.BAG_SIZE_KG = parseInt(data.BAG_SIZE_KG)
        data.SALE_NO_OF_BAG = parseInt(data.SALE_NO_OF_BAG)
        var db = await newMongo.mongoConnection();
        var response = await newMongo.findOne('seedData', { sellData: true, info: 'sisStockSale', lot_Number: data.LOT_NUMBER, source_ID: data.GODOWN_ID, receiver_ID: data.SALE_TO, qty_Per_Bag_Kg: data.BAG_SIZE_KG, no_of_Bag: data.SALE_NO_OF_BAG, instrumentNo: data.DD_NUMBER }, db)
        let response2 = await newMongo.insertDocument(response, 'sisSaleDeletedData', db)
        if (response2.insertedCount == 1) {
            var response3 = await newMongo.removeDocument(response, 'seedData', db)
        }

        if (response3) {
            // let source_ID = response.source_ID
            // response.source_ID = response.receiver_ID
            // response.receiver_ID = source_ID

            // response.date_Intake = new Date()
            // response.pr_Number = response.instrumentNo
            // response.info = 'sisStockSaleCancelled'
            // response.pushedDateToBs = new Date()

            // let sourceType = response.SourceType
            // response.SourceType = response.receiverType
            // response.receiverType = sourceType

            // let x1 = response.sourceGodownName
            // let x2 = response.sourceDist
            // let x3 = response.sourceDistCode
            // response.sourceGodownName = response.destinGodownName
            // response.sourceDist = response.destinDist
            // response.sourceDistCode = response.destinDistCode
            // response.destinGodownName = x1
            // response.destinDist = x2
            // response.destinDistCode = x3

            // delete response['_id']
            // delete response['partyName']
            // delete response['date_sale']
            // delete response['challan_Number']
            // delete response['challan_Date']
            // delete response['sellDataPushDate']
            // delete response['sellData']

            // let response4 = await newMongo.insertDocument(response, 'seedData', db)
            callback(response2.insertedCount)
            newMongo.mongoClose(db)
        }

    } catch (e) {

    }
}

