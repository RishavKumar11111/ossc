
var mongo = require('../../mongo/mongo');

//  exports.imsNewSeedDetails=function(data,callback){
//     mongo.insertDocument(data, "seedData", function (responsee) {
//                     callback(responsee);
//                 })
//  }


exports.imsNewSeedDetails = function (data, callback) {
    var aggri = [
        {
            '$match': {
                '$or': [
                    {
                        'all_Godowns.godown_ID': data.receiver_ID
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
                    {
                        'all_Godowns.godown_ID': data.receiver_ID
                    }
                ]
            }
        },
    ]
    mongo.queryWithAggregator(aggri, 'godownMaster', async function (response) {
        if (response[0].all_Godowns.godown_ID == data.source_ID) {
            data.destinDist = await response[1].districtName
            data.destinDistCode = await response[1].districtCode
            data.destinGodownName = await response[1].all_Godowns.godown_Name
            data.sourceDist = await response[1].districtName
            data.sourceDistCode = await response[1].districtCode
            data.sourceGodownName = await response[1].all_Godowns.godown_Name
        } else {
            data.destinDist = await response[0].districtName
            data.destinDistCode = await response[0].districtCode
            data.destinGodownName = await response[0].all_Godowns.godown_Name
            data.sourceGodownName = await response[0].all_Godowns.godown_Name
            data.sourceDist = await response[0].districtName
            data.sourceDistCode = await response[0].districtCode
        }

        mongo.insertDocument(data, "seedData", function (responsee) {
            callback(responsee);
        })

    })
    //    mongo.insertDocument(data,"seedData",function(response){
    //        callback(response);
    //    })

}


exports.imsNewSeedDetailssss = function (data) {
    return new Promise((resolve, reject) => {
        var aggri = [
            {
                '$match': {
                    '$or': [
                        {
                            'all_Godowns.godown_ID': data.source_ID
                        }, {
                            'all_Godowns.godown_ID': data.receiver_ID
                        }
                    ],
                    transitStatus:{$ne:'Deleted'}
                }
            }, {
                '$unwind': {
                    'path': '$all_Godowns'
                }
            }, {
                '$match': {
                    '$or': [
                        {
                            'all_Godowns.godown_ID': data.source_ID
                        }, {
                            'all_Godowns.godown_ID': data.receiver_ID
                        }
                    ]
                }
            }
        ]
        mongo.queryWithAggregatorrrr(aggri, 'godownMaster', async (err, response) => {
            if (err) reject(err)

            if (response[0].all_Godowns.godown_ID == data.source_ID) {
                data.destinDist = await response[1].districtName
                data.destinDistCode = await response[1].districtCode
                data.destinGodownName = await response[1].all_Godowns.godown_Name
                data.sourceDist = await response[0].districtName
                data.sourceDistCode = await response[0].districtCode
                data.sourceGodownName = await response[0].all_Godowns.godown_Name
            } else {
                data.destinDist = await response[0].districtName
                data.destinDistCode = await response[0].districtCode
                data.destinGodownName = await response[0].all_Godowns.godown_Name
                data.sourceGodownName = await response[1].all_Godowns.godown_Name
                data.sourceDist = await response[1].districtName
                data.sourceDistCode = await response[1].districtCode
            }

            mongo.insertDocument(data, "seedData", function (error, responsee) {
                if (error) reject(error)
                resolve(responsee)
            })

        })
    })

    //    mongo.insertDocument(data,"seedData",function(response){
    //        callback(response);
    //    })

}