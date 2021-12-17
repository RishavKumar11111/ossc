var mongo = require('../../mongo/mongo');



// exports.pushDataFromSisToBs = function (data, callback) {
//     mongo.insertDocument(data, "seedData", function (responsee) {
//         callback(responsee);
//     })
// }


exports.pushDataFromSisToBs = function (data, callback) {

    var aggri = [
        {
            '$match': {
                '$or': [
                    // {
                    //     'all_Godowns.godown_ID': data.source_ID
                    // }, 
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
                    // {
                    //     'all_Godowns.godown_ID': data.source_ID
                    // }, 
                    {
                        'all_Godowns.godown_ID': data.receiver_ID
                    }
                ]
            }
        }
    ]
    mongo.queryWithAggregator(aggri, 'godownMaster', async function (response) {
        try {
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

            // data.destinDist=await response[0].districtName
            // data.destinDistCode=await response[0].districtCode
            // data.destinGodownName = await response[0].all_Godowns.godown_Name
            // data.sourceDist=await response[0].districtName
            // data.sourceDistCode=await data.dist_Code
            // data.sourceGodownName = await response[0].all_Godowns.godown_Name


            mongo.insertDocument(data, "seedData", function (responsee) {
                callback(responsee);
            })
        } catch (e) {

        }


    })



}

//--------------------------------- Error Handling Test ---------------------------------


exports.pushDataFromSisToBssss = function (data) {
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
                            'all_Godowns.godown_ID': data.source_ID
                        }, {
                            'all_Godowns.godown_ID': data.receiver_ID
                        }
                    ]
                }
            }
        ]

        mongo.queryWithAggregatorrrr(aggri, 'godownMaster', async (error, response) => {
            if (error) reject(error)
            if (response.length > 1) {
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
                mongo.insertDocumentt(data, "seedData", function (err, responsee) {
                    if (err) reject(err)
                    resolve(responsee);
                })
            } else {
                reject({ "error": "Not inserted" })
            }

        })
    })



}