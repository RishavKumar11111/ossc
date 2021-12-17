var mongo = require('../../mongo/mongo');
var newMongo = require('../../mongo/newMongo')
var moment = require('moment')


exports.getAllDistricts = function (data, callback) {
    var aggrigation = [{
        $match: {
            "all_Spo.spoCd": data
        }
    }
    ]
    mongo.queryWithAggregator(aggrigation, 'spoMaster', function (response) {
        if(response.length>0){
            callback(response[0]);
        }
        else{
            callback([])
        }
    })
}

exports.getAllGodowns = function (data, callback) {
    mongo.findOne('godownMaster', { 'districtName': data }, function (response) {
        callback(response);
    })
}

// exports.loadCrop = function (godown_ID, callback) {
//     // mongo.findAll('cropMaster', function (response) {
//     //     callback(response)
//     // })
//     console.log(godown_ID);
//     let aggrigate = [
//         {
//             '$sort': {
//                 'Crop_Name': 1
//             }
//         }
//     ]
//     mongo.queryWithAggregator(aggrigate, 'cropMaster', function (response) {
//         callback(response)
//     })
// }

exports.loadCrop = async function (godown_ID, callback) {
    try {
        let db = await newMongo.mongoConnection();
        let aggr = [
            {
                '$match': {
                    '$or': [
                        {
                            'receiver_ID': godown_ID
                        }, {
                            'source_ID': godown_ID
                        }
                    ]
                }
            }, {
                '$group': {
                    '_id': '$crop'
                }
            }
        ]

        let response = await newMongo.queryWithAggregator(aggr, 'seedData', db)
        let cropCodes = []
        let count = 0
        response.forEach(async e => {
            cropCodes.push(e._id)
            count++
            if (response.length == count) {
                let aggr1 = [
                    {
                        '$match': {
                            'Crop_Code': {
                                '$in': cropCodes
                            }
                        }
                    }, {
                        '$sort': {
                            'Crop_Name': 1
                        }
                    }
                ]
                let response1 = await newMongo.queryWithAggregator(aggr1, 'cropMaster', db)
                callback(response1)
                newMongo.mongoClose(db)
            }
        })
        if (response.length == 0) {
            callback([])
            newMongo.mongoClose(db)
        }

    } catch (e) {

    }
}

// exports.loadVariety = function (cropCode, callback) {
//     // mongo.queryFindAll({ Crop_Code: cropCode }, 'varietyMaster', function (response) {
//     //     callback(response)
//     // })
//     let aggregate = [
//         {
//             '$match': {
//                 'Crop_Code': cropCode
//             }
//         }, {
//             '$sort': {
//                 'Variety_Name': 1
//             }
//         }
//     ]
//     mongo.queryWithAggregator(aggregate, 'varietyMaster', function (response) {
//         callback(response)
//     })
// }

exports.loadVariety = async function (data, callback) {
    try {
        let db = await newMongo.mongoConnection();
        let aggr = [
            {
                '$match': {
                    '$or': [
                        {
                            'receiver_ID': data.godownId
                        }, {
                            'source_ID': data.godownId
                        }
                    ]
                }
            }, {
                '$group': {
                    '_id': '$variety'
                }
            }
        ]

        let response = await newMongo.queryWithAggregator(aggr, 'seedData', db)
        let varietyCodes = []
        let count = 0
        response.forEach(async e => {
            varietyCodes.push(e._id)
            count++
            if (response.length == count) {
                let aggr1 = [
                    {
                        '$match': {
                            'Variety_Code': {
                                '$in': varietyCodes
                            },
                            'Crop_Code': data.cropCode
                        }
                    }, {
                        '$sort': {
                            'Variety_Name': 1
                        }
                    }
                ]
                let response1 = await newMongo.queryWithAggregator(aggr1, 'varietyMaster', db)
                callback(response1)
                newMongo.mongoClose(db)
            }
        })
        if(response.length==0){
            callback([])
            newMongo.mongoClose(db)
        }
    } catch (e) {

    }
}

exports.getAllLot = function (data, callback) {
    let aggrigate = [
        {
            '$match': {
                'receiver_ID': data.godownId,
                'crop': data.crop,
                'variety': data.variety,
                'transitStatus': 'Received',
                'lotExpired': {
                    '$ne': true
                },
                'cert_Status': 'Pass'
            }
        }, {
            '$group': {
                '_id': {
                    'lot_Number': '$lot_Number',
                    'variety': '$variety',
                    'varietyName': '$varietyName'
                }
            }
        }
    ]
    mongo.queryWithAggregator(aggrigate, 'seedData', function (response) {
        var lotData = []
        let count = 0
        response.forEach(element => {
            count = count + 1
            lotData.push(element._id);
            if (count == response.length) {
                callback(lotData)
            }
        })
        if(response.length<1){
            callback([])
        }
        //callback(response);
    })
}

// exports.getAllLot1 = async (data, callback) => {
//     try {
//         let aggrigate = [
//             {
//                 '$match': {
//                     'receiver_ID': data.godownId,
//                     'crop': data.crop,
//                     'variety': data.variety,
//                     'transitStatus': 'Received',
//                     'lotExpired': {
//                         '$ne': true
//                     },
//                     'cert_Status': 'Pass'
//                 }
//             }, {
//                 '$group': {
//                     '_id': {
//                         'lot_Number': '$lot_Number',
//                         'variety': '$variety',
//                         'varietyName': '$varietyName'
//                     }
//                 }
//             }
//         ]

//         let db = await newMongo.mongoConnection()
//         let response = await newMongo.queryWithAggregator(aggrigate, 'seedData', db);
//         let lotData = []
//         response.forEach(element => {
//             lotData.push(element._id);
//             let finalLotData = []

//             if (response.length == lotData.length) {
//                 lotData.forEach(async (elem, idx, array) => {
//                     let checkBagSize = {}
//                     checkBagSize.lotNo = elem.lot_Number
//                     checkBagSize.godownId = data.godownId
//                     checkBagSize.variety = data.variety
//                     checkBagSize.lotAddedBagSize = 0
//                     let responsee = await bagSizeForLot(checkBagSize)
//                     if (responsee.availableBagg != 0) {
//                         finalLotData.push(elem)
//                     }
//                     // if (lotData.length == count12) {
//                     //     callback(finalLotData)
//                     //     newMongo.mongoClose(db);
//                     // }
//                     if (idx === array.length - 1) {
//                         callback(finalLotData)
//                         newMongo.mongoClose(db);
//                     }
//                 })


//             }
//         })

//         if(response.length==0){
//             callback([])
//             newMongo.mongoClose(db)
//         }

//     } catch (e) {
//         console.log(e.message);
//     }
// }

// // Below function is used not to show lot which is already sold while transfer
// var bagSizeForLot = function (data) {
//     return new Promise(callback => {
//         let y = data.lotNo
//         let zzz = y.slice(4)
//         var availableBagg = 0
//         var aggrigate = [{
//             $match: {
//                 'lot_Number': { $regex: zzz },
//                 'receiver_ID': data.godownId,
//                 'variety': data.variety,
//                 'transitStatus': 'Received'
//             }
//         }, {
//             $group: {
//                 _id: null,
//                 rcvTotal: { "$sum": '$no_of_Bag' },
//                 bagPerKg: { $first: "$qty_Per_Bag_Kg" }
//             }
//         }]

//         var aggr = [{
//             $match: {
//                 'lot_Number': { $regex: zzz },
//                 'source_ID': data.godownId,
//                 'variety': data.variety,
//                 transitStatus: { $ne: 'Deleted' }
//             }
//         }, {
//             $group: {
//                 _id: null,
//                 disTotal: { "$sum": '$no_of_Bag' }
//             }
//         }]
//         mongo.queryWithAggregator(aggrigate, 'seedData', function (response) {
//             mongo.queryWithAggregator(aggr, 'seedData', function (responsee) {
//                 try {
//                     if (responsee.length == 0) {
//                         availableBagg = response[0].rcvTotal
//                         let bagSizePerKg = response[0].bagPerKg
//                         let loadBagData = {}
//                         loadBagData.availableBagg = availableBagg - data.lotAddedBagSize
//                         loadBagData.bagSizePerKg = bagSizePerKg

//                         callback(loadBagData)
//                     } else {

//                         availableBagg = response[0].rcvTotal - responsee[0].disTotal
//                         let bagSizePerKg = response[0].bagPerKg
//                         let loadBagData = {}
//                         loadBagData.availableBagg = availableBagg - data.lotAddedBagSize
//                         loadBagData.bagSizePerKg = bagSizePerKg
//                         callback(loadBagData)
//                     }
//                 } catch (e) {

//                 }


//             })

//         })
//     })
// }

exports.getAllSPOs = function (callback) {
    mongo.findAll('spoMaster', function (response) {
        callback(response);
    })
}

exports.getAllSpoByIntra = function (spoCode, callback) {
    var aggrigatation = [
        {
            '$match': {
                'all_Spo.spoCd': spoCode
            }
        }
    ]
    mongo.queryWithAggregator(aggrigatation, "spoMaster", function (response) {
        callback(response)
    })
}

exports.getAllSpoByInter = function (data, callback) {
    var aggrigatation = [
        {
            '$match': {
                'all_Spo.spoCd': {
                    '$ne': '26'
                }
            }
        }
    ]
    mongo.queryWithAggregator(aggrigatation, 'spoMaster', function (response) {
        callback(response)
    })
}

exports.getToSPOId = function (data, callback) {
    var aggrigate = [
        {
            '$unwind': {
                'path': '$all_Spo'
            }
        }, {
            '$match': {
                'all_Spo.dist': data
            }
        }
    ]
    mongo.queryWithAggregator(aggrigate, "spoMaster", function (response) {
        callback(response[0].all_Spo.spoCd)
    })
}

exports.getAllToGowns = function (data, callback) {
    mongo.findOne('godownMaster', { 'districtName': data }, function (response) {
        callback(response);
    })
}

exports.loadMaxBagNo = function (data, callback) {
    let y = data.lotNo
    let zzz = y.slice(4)
    var availableBagg = 0
    var aggrigate = [{
        $match: {
            'lot_Number': { $regex: zzz },
            'receiver_ID': data.godownId,
            'variety': data.variety,
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
            'variety': data.variety,
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
}

// let x = moment().format("YYYY-MM-DD")
// console.log('x', x);
// let y = moment('2021-02-23T16:28:55.0966375+05:30').add(9,'months').format("YYYY-MM-DD")
// console.log('y', y);
// if (moment(x).isBefore(y)) {
//     console.log('pass');
// }
// else {
//     console.log('fail');
// }
// exports.stockTransData = function (data, callback) {
//     callBackArray = []
//     let dataForCommonChallanNo = {
//         lot_Number: data[0].fromLot,
//         source_ID: data[0].fromGodown,
//         no_of_Bag: data[0].noOfBags
//     }

//     mongo.autoIncrement(dataForCommonChallanNo, 'seedData', function (resp1) {
//         let commonChallanNo = data[0].sourceSPO + "/" + data[0].fromGodown + "/" + data[0].toGodown + "/" + resp1


//         for (let i = 0; i < data.length; i++) {
//             mongo.findOne('seedData', { 'lot_Number': data[i].fromLot, 'receiver_ID': data[i].fromGodown }, function (response) {
//                 // if (response.testing_Date) {
//                 // Checking if the seed has been expired or not
//                 // let todayDate = moment().format("YYYY-MM-DD")
//                 // let testingDate = moment(response.testing_Date).add(9, 'months').format("YYYY-MM-DD")
//                 // if (moment(todayDate).isBefore(testingDate)) {
//                 try {
//                     if (response) {
//                         var date = new Date();
//                         var transitData = {
//                             dist_Code: response.dist_Code,
//                             lot_Number: data[i].fromLot,
//                             source_ID: data[i].fromGodown,
//                             receiver_ID: data[i].toGodown,
//                             qty_Per_Bag_Kg: response.qty_Per_Bag_Kg,
//                             no_of_Bag: data[i].noOfBags,
//                             date_Intake: '',
//                             year: response.year,
//                             UserID: response.UserID,
//                             UserIP: response.UserIP,
//                             CropCatg_ID: response.CropCatg_ID,
//                             season: response.season,
//                             pr_Number: response.pr_Number || response.challan_Number,
//                             crop: response.crop,
//                             cropName: response.cropName,
//                             variety: response.variety,
//                             varietyName: response.varietyName,
//                             class: response.class,
//                             SourceType: response.SourceType,
//                             receiverType: response.receiverType,
//                             cert_Status: response.cert_Status,
//                             spoToReceive: data[i].toSPO,
//                             sourceSPO: data[i].sourceSPO,
//                             vehicleNO: data[i].vehicleNo,
//                             transitStatus: "In Transit",
//                             stockTrnsDate: new Date(data[i].transferDate),
//                             transferDataPushedDate: date,
//                             info: 'godownTransferByBS',
//                             commonChallanForGodownTrns: commonChallanNo
//                         }
//                         mongo.autoIncrement(transitData, 'seedData', function (resp) {
//                             transitData.ref_No = transitData.sourceSPO + "/" + transitData.source_ID + "/" + transitData.year + "/" + resp
//                             transitData.instrumentNo = transitData.ref_No
//                             // Added below for source godown name and destination name
//                             var aggri = [
//                                 {
//                                     '$match': {
//                                         '$or': [
//                                             {
//                                                 'all_Godowns.godown_ID': transitData.source_ID
//                                             }, {
//                                                 'all_Godowns.godown_ID': transitData.receiver_ID
//                                             }
//                                         ]
//                                     }
//                                 }, {
//                                     '$unwind': {
//                                         'path': '$all_Godowns'
//                                     }
//                                 }, {
//                                     '$match': {
//                                         '$or': [
//                                             {
//                                                 'all_Godowns.godown_ID': transitData.source_ID
//                                             }, {
//                                                 'all_Godowns.godown_ID': transitData.receiver_ID
//                                             }
//                                         ]
//                                     }
//                                 }
//                             ]
//                             mongo.queryWithAggregator(aggri, 'godownMaster', async function (respo) {
//                                 if (respo[0].all_Godowns.godown_ID == transitData.source_ID) {
//                                     transitData.destinDist = await respo[1].districtName
//                                     transitData.destinDistCode = await respo[1].districtCode
//                                     transitData.destinGodownName = await respo[1].all_Godowns.godown_Name
//                                     transitData.sourceDist = await respo[0].districtName
//                                     transitData.sourceDistCode = await respo[0].districtCode
//                                     transitData.sourceGodownName = await respo[0].all_Godowns.godown_Name
//                                     transitData.dist_Code = transitData.destinDistCode

//                                 } else {
//                                     transitData.destinDist = await respo[0].districtName
//                                     transitData.destinDistCode = await respo[0].districtCode
//                                     transitData.destinGodownName = await respo[0].all_Godowns.godown_Name
//                                     transitData.sourceGodownName = await respo[1].all_Godowns.godown_Name
//                                     transitData.sourceDist = await respo[1].districtName
//                                     transitData.sourceDistCode = await respo[1].districtCode
//                                     transitData.dist_Code = transitData.destinDistCode

//                                 }

//                                 mongo.insertDocument(transitData, "seedData", function (responsee) {
//                                     if (responsee) {
//                                         mongo.findOne('osscConfigData', { department: "OSSC" }, function (response1) {
//                                             if (response1) {
//                                                 mongo.findOne('spoMaster', { 'all_Spo.spoCd': transitData.sourceSPO }, function (response2) {
//                                                     transitData.respStatus = responsee.insertedCount
//                                                     transitData.dist_Code = transitData.sourceDistCode
//                                                     transitData.panNo = response1.panNo
//                                                     transitData.gstinNo = response1.gstinNo
//                                                     transitData.zonalOffice = response2.spo_Name
//                                                     // callback(transitData)
//                                                     callBackArray.push(transitData)
//                                                     if (data.length == callBackArray.length) {
//                                                         callback(callBackArray)
//                                                     }
//                                                 })
//                                             }

//                                         })

//                                     }
//                                 })

//                             })
//                             // mongo.insertDocument(transitData, 'seedData', function (respo) {
//                             //     if (respo) {
//                             //         callback(transitData);
//                             //     }
//                             // })
//                         })

//                     }
//                 } catch (e) {

//                 }
//             })
//         }

//         // else {
//         //     callback({ respStatus: "seedExpired" })
//         // }

//         // }else{

//         // }
//     })




// }

exports.stockTransData = async (data, callback) => {
    try {
        callBackArray = []
        dataInsertArray = []
        let dataForCommonChallanNo = {
            lot_Number: data[0].fromLot,
            source_ID: data[0].fromGodown,
            no_of_Bag: data[0].noOfBags
        }

        let db = await newMongo.mongoConnection();
        let resp1 = await newMongo.autoIncrement(dataForCommonChallanNo, 'seedData', db);
        let commonChallanNo = data[0].sourceSPO + "/" + data[0].fromGodown + "/" + data[0].toGodown + "/" + resp1
        for (let i = 0; i < data.length; i++) {
            let response = await newMongo.findOne('seedData', { 'lot_Number': data[i].fromLot, 'receiver_ID': data[i].fromGodown }, db);

            if (response) {
                var date = new Date();
                var transitData = {
                    dist_Code: response.dist_Code,
                    lot_Number: data[i].fromLot,
                    source_ID: data[i].fromGodown,
                    receiver_ID: data[i].toGodown,
                    qty_Per_Bag_Kg: response.qty_Per_Bag_Kg,
                    no_of_Bag: data[i].noOfBags,
                    date_Intake: '',
                    year: response.year,
                    UserID: response.UserID,
                    UserIP: response.UserIP,
                    CropCatg_ID: response.CropCatg_ID,
                    season: response.season,
                    pr_Number: response.pr_Number || response.challan_Number,
                    crop: response.crop,
                    cropName: response.cropName,
                    variety: response.variety,
                    varietyName: response.varietyName,
                    class: response.class,
                    SourceType: response.SourceType,
                    receiverType: response.receiverType,
                    cert_Status: response.cert_Status,
                    spoToReceive: data[i].toSPO,
                    sourceSPO: data[i].sourceSPO,
                    vehicleNO: data[i].vehicleNo,
                    transitStatus: "In Transit",
                    stockTrnsDate: new Date(data[i].transferDate),
                    transferDataPushedDate: date,
                    info: 'godownTransferByBS',
                    commonChallanForGodownTrns: commonChallanNo
                }

                let resp = await newMongo.autoIncrement(transitData, 'seedData', db)
                transitData.ref_No = transitData.sourceSPO + "/" + transitData.source_ID + "/" + transitData.year + "/" + resp
                transitData.instrumentNo = transitData.ref_No

                let aggri = [
                    {
                        '$match': {
                            '$or': [
                                {
                                    'all_Godowns.godown_ID': transitData.source_ID
                                }, {
                                    'all_Godowns.godown_ID': transitData.receiver_ID
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
                                    'all_Godowns.godown_ID': transitData.source_ID
                                }, {
                                    'all_Godowns.godown_ID': transitData.receiver_ID
                                }
                            ]
                        }
                    }
                ]

                let respo = await newMongo.queryWithAggregator(aggri, 'godownMaster', db)
                if (respo[0].all_Godowns.godown_ID == transitData.source_ID) {
                    transitData.destinDist = respo[1].districtName
                    transitData.destinDistCode = respo[1].districtCode
                    transitData.destinGodownName = respo[1].all_Godowns.godown_Name
                    transitData.sourceDist = respo[0].districtName
                    transitData.sourceDistCode = respo[0].districtCode
                    transitData.sourceGodownName = respo[0].all_Godowns.godown_Name
                    transitData.dist_Code = transitData.destinDistCode

                } else {
                    transitData.destinDist = respo[0].districtName
                    transitData.destinDistCode = respo[0].districtCode
                    transitData.destinGodownName = respo[0].all_Godowns.godown_Name
                    transitData.sourceGodownName = respo[1].all_Godowns.godown_Name
                    transitData.sourceDist = respo[1].districtName
                    transitData.sourceDistCode = respo[1].districtCode
                    transitData.dist_Code = transitData.destinDistCode

                }

                dataInsertArray.push(transitData);

                let responsee
                if (data.length == dataInsertArray.length) {
                    responsee = await newMongo.insertManyDocuments(dataInsertArray, 'seedData', db)
                }

                let response1 = await newMongo.findOne('osscConfigData', { department: "OSSC" }, db);
                let response2 = await newMongo.findOne('spoMaster', { 'all_Spo.spoCd': transitData.sourceSPO }, db);
                // transitData.respStatus = responsee.insertedCount

                transitData.dist_Code = transitData.sourceDistCode
                transitData.panNo = response1.panNo
                transitData.gstinNo = response1.gstinNo
                transitData.zonalOffice = response2.spo_Name
                // callback(transitData)

                callBackArray.push(transitData)

                if (data.length == callBackArray.length) {
                    if (responsee.insertedCount > 0) {
                        callBackArray[0].respStatus = responsee.insertedCount
                        callback(callBackArray)
                        newMongo.mongoClose(db);
                    }
                }


            }
        }

    } catch (e) {
        console.log('stock trans bal error,' + e.message);
    }
}


exports.failedSeedPushToSis = function (data, callback) {
    mongo.insertManyDocuments(data, "failedPushToSIS", function (response) {
        callback(response)
    })
}

exports.manualPrint=async(req,res)=>{
    try{
        let commonChallanNo=req.body.commonChallanNo
        let db=await newMongo.mongoConnection()
        let response=await newMongo.queryFindAll({commonChallanForGodownTrns:commonChallanNo},'seedData',db)
        res.send(response)
        db.close()
    }catch(e){

    }
}


// exports.stockTransData = function (data, callback) {
//     callBackArray = []
//     let dataForCommonChallanNo = {
//         lot_Number: data[0].fromLot,
//         source_ID: data[0].fromGodown,
//         no_of_Bag: data[0].noOfBags
//     }

//     mongo.autoIncrement(dataForCommonChallanNo, 'seedData', function (resp1) {
//         let commonChallanNo = data[0].sourceSPO + "/" + data[0].fromGodown + "/" + data[0].toGodown + "/" + resp1

//         let transferArray = []
//         let count = 0

//         for (let i = 0; i < data.length; i++) {
//             mongo.findOne('seedData', { 'lot_Number': data[i].fromLot, 'receiver_ID': data[i].fromGodown }, function (response) {
//                 // if (response.testing_Date) {
//                 // Checking if the seed has been expired or not
//                 // let todayDate = moment().format("YYYY-MM-DD")
//                 // let testingDate = moment(response.testing_Date).add(9, 'months').format("YYYY-MM-DD")
//                 // if (moment(todayDate).isBefore(testingDate)) {
//                 try {
//                     if (response) {
//                         var date = new Date();
//                         var transitData = {
//                             dist_Code: response.dist_Code,
//                             lot_Number: data[i].fromLot,
//                             source_ID: data[i].fromGodown,
//                             receiver_ID: data[i].toGodown,
//                             qty_Per_Bag_Kg: response.qty_Per_Bag_Kg,
//                             no_of_Bag: data[i].noOfBags,
//                             date_Intake: '',
//                             year: response.year,
//                             UserID: response.UserID,
//                             UserIP: response.UserIP,
//                             CropCatg_ID: response.CropCatg_ID,
//                             season: response.season,
//                             pr_Number: response.pr_Number || response.challan_Number,
//                             crop: response.crop,
//                             cropName: response.cropName,
//                             variety: response.variety,
//                             varietyName: response.varietyName,
//                             class: response.class,
//                             SourceType: response.SourceType,
//                             receiverType: response.receiverType,
//                             cert_Status: response.cert_Status,
//                             spoToReceive: data[i].toSPO,
//                             sourceSPO: data[i].sourceSPO,
//                             vehicleNO: data[i].vehicleNo,
//                             transitStatus: "In Transit",
//                             stockTrnsDate: new Date(data[i].transferDate),
//                             transferDataPushedDate: date,
//                             info: 'godownTransferByBS',
//                             commonChallanForGodownTrns: commonChallanNo
//                         }
//                         mongo.autoIncrement(transitData, 'seedData', function (resp) {
//                             transitData.ref_No = transitData.sourceSPO + "/" + transitData.source_ID + "/" + transitData.year + "/" + resp
//                             transitData.instrumentNo = transitData.ref_No
//                             // Added below for source godown name and destination name
//                             var aggri = [
//                                 {
//                                     '$match': {
//                                         '$or': [
//                                             {
//                                                 'all_Godowns.godown_ID': transitData.source_ID
//                                             }, {
//                                                 'all_Godowns.godown_ID': transitData.receiver_ID
//                                             }
//                                         ]
//                                     }
//                                 }, {
//                                     '$unwind': {
//                                         'path': '$all_Godowns'
//                                     }
//                                 }, {
//                                     '$match': {
//                                         '$or': [
//                                             {
//                                                 'all_Godowns.godown_ID': transitData.source_ID
//                                             }, {
//                                                 'all_Godowns.godown_ID': transitData.receiver_ID
//                                             }
//                                         ]
//                                     }
//                                 }
//                             ]
//                             mongo.queryWithAggregator(aggri, 'godownMaster', async function (respo) {
//                                 if (respo[0].all_Godowns.godown_ID == transitData.source_ID) {
//                                     transitData.destinDist = await respo[1].districtName
//                                     transitData.destinDistCode = await respo[1].districtCode
//                                     transitData.destinGodownName = await respo[1].all_Godowns.godown_Name
//                                     transitData.sourceDist = await respo[0].districtName
//                                     transitData.sourceDistCode = await respo[0].districtCode
//                                     transitData.sourceGodownName = await respo[0].all_Godowns.godown_Name
//                                     transitData.dist_Code = transitData.destinDistCode

//                                 } else {
//                                     transitData.destinDist = await respo[0].districtName
//                                     transitData.destinDistCode = await respo[0].districtCode
//                                     transitData.destinGodownName = await respo[0].all_Godowns.godown_Name
//                                     transitData.sourceGodownName = await respo[1].all_Godowns.godown_Name
//                                     transitData.sourceDist = await respo[1].districtName
//                                     transitData.sourceDistCode = await respo[1].districtCode
//                                     transitData.dist_Code = transitData.destinDistCode

//                                 }

//                                 count++
//                                 transferArray.push(transitData)


//                                 mongo.findOne('osscConfigData', { department: "OSSC" }, function (response1) {
//                                     if (response1) {
//                                         mongo.findOne('spoMaster', { 'all_Spo.spoCd': transitData.sourceSPO }, function (response2) {
//                                             transitData.respStatus = responsee.insertedCount
//                                             transitData.dist_Code = transitData.sourceDistCode
//                                             transitData.panNo = response1.panNo
//                                             transitData.gstinNo = response1.gstinNo
//                                             transitData.zonalOffice = response2.spo_Name
//                                             // callback(transitData)
//                                             callBackArray.push(transitData)
//                                             if (data.length == callBackArray.length) {
//                                                 callback(callBackArray)
//                                             }
//                                         })
//                                     }

//                                 })

//                                 if (count == data.length) {
//                                     mongo.insertManyDocuments(transferArray, "seedData", function (responsee) {

//                                     })
//                                 }



//                             })
//                         })

//                     }
//                 } catch (e) {

//                 }
//             })
//         }

//     })




// }