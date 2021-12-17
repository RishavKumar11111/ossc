
var mongo = require('../../mongo/mongo')
var newMongo = require('../../mongo/newMongo')
var moment = require('moment')


// exports.getLotAccSPO1 = function (data, callback) {
//     mongo.findOne('spoMaster', { 'all_Spo.spoCd': data }, function (response) {
//         if (response) {
//             let aggrigate = [
//                 {
//                     '$match': {
//                         'spoCode': response.spo_Code

//                     }
//                 }, {
//                     '$group': {
//                         '_id': null,
//                         'godownIds': {
//                             '$push': '$all_Godowns.godown_ID'
//                         }
//                     }
//                 }
//             ]
//             mongo.queryWithAggregator(aggrigate, 'godownMaster', function (response2) {
//                 if (response2) {
//                     if (response2[0]) {
//                         var merged = [].concat.apply([], response2[0].godownIds);
//                         let aggrigate2 = [
//                             {
//                                 '$match': {
//                                     '$or': [
//                                         {
//                                             'receiver_ID': {
//                                                 '$in': merged
//                                             }
//                                         }
//                                     ],
//                                     transitStatus: { $ne: 'Deleted' },
//                                     lotExpired: { $ne: true },
//                                     'sellData': { $ne: true }
//                                 }
//                             }, {
//                                 '$group': {
//                                     '_id': {
//                                         'lot_Number': '$lot_Number'
//                                     }
//                                 }
//                             }
//                         ]
//                         mongo.queryWithAggregator(aggrigate2, 'seedData', function (response3) {
//                             if (response3) {
//                                 callback(response3)
//                             }
//                         })
//                     }
//                 }

//             })
//         }
//     })
// }

exports.getLotAccSPO = async (data, callback) => {
    try {
        let db = await newMongo.mongoConnection()
        let aggregate1 = [
            {
                '$match': {
                    'all_Spo.spoCd': data
                }
            }, {
                '$unwind': {
                    'path': '$all_Spo'
                }
            }, {
                '$match': {
                    'all_Spo.spoCd': data
                }
            }
        ]
        let response = await newMongo.queryWithAggregator(aggregate1, 'spoMaster', db)
        let aggregate2 = [
            {
                '$match': {
                    'districtName': response[0].all_Spo.dist
                }
            }, {
                '$group': {
                    '_id': null,
                    'godowns': {
                        '$push': '$all_Godowns.godown_ID'
                    }
                }
            }
        ]
        let response1 = await newMongo.queryWithAggregator(aggregate2, 'godownMaster', db)
        // console.log(response1[0].godowns[0]);
        let aggregate3 = [
            {
                '$match': {
                    '$or': [
                        {
                            'receiver_ID': {
                                '$in': response1[0].godowns[0]
                            }
                        }
                    ],
                    transitStatus: { $ne: 'Deleted' },
                    lotExpired: { $ne: true },
                    'sellData': { $ne: true },
                    cert_Status: 'Pass'
                }
            }, {
                '$group': {
                    '_id': {
                        'lot_Number': '$lot_Number'
                    }
                }
            }
        ]
        let response2 = await newMongo.queryWithAggregator(aggregate3, 'seedData', db)
        callback(response2)
        newMongo.mongoClose(db)
    } catch (e) {

    }
}


// exports.getDataAccLot1 = function (data, callback) {
//     mongo.findOne('spoMaster', { 'all_Spo.spoCd': data.spoId }, function (response) {
//         if (response) {
//             let aggrigate = [
//                 {
//                     '$match': {
//                         'spoCode': response.spo_Code,
//                         'sellData': { $ne: true }
//                     }
//                 }, {
//                     '$group': {
//                         '_id': null,
//                         'godownIds': {
//                             '$push': '$all_Godowns.godown_ID'
//                         }
//                     }
//                 }
//             ]
//             mongo.queryWithAggregator(aggrigate, 'godownMaster', function (response2) {
//                 // console.log(response2[0].godownIds);
//                 if (response2) {
//                     console.log(data);
//                     if (data.testing_Date) {
//                         // Checking if the seed has been expired or not
//                         let todayDate = moment().format("YYYY-MM-DD")
//                         let testingDate = moment(data.testing_Date).add(9, 'months').format("YYYY-MM-DD")
//                         if (moment(todayDate).isBefore(testingDate)) {

//                             mongo.mongoConnection(function (db) {
//                                 var merged = [].concat.apply([], response2[0].godownIds);
//                                 let aggrigate2 = [
//                                     {
//                                         '$match': {
//                                             'lot_Number': data.lotNumber,
//                                             'cert_Status': "Pass",
//                                             '$or': [
//                                                 // {
//                                                 //     'source_ID': {
//                                                 //         '$in': merged
//                                                 //     }
//                                                 // },
//                                                 {
//                                                     'receiver_ID': {
//                                                         '$in': merged
//                                                     }
//                                                 }

//                                             ],
//                                             transitStatus: { $ne: 'Deleted' },
//                                             lotExpired: { $ne: true }
//                                         }
//                                     }, {
//                                         '$group': {
//                                             '_id': {
//                                                 'lot_Number': '$lot_Number'
//                                             },
//                                             'doc': {
//                                                 '$first': '$$ROOT'
//                                             }
//                                         }
//                                     }
//                                 ]

//                                 mongo.queryWithAggregatorLoop(aggrigate2, 'seedData', db, function (response3) {
//                                     if (response3) {
//                                         // callback(response3)
//                                         let count = 0
//                                         var finalData = []
//                                         response3.forEach(element => {
//                                             count++
//                                             let aggrigation = [
//                                                 {
//                                                     '$match': {
//                                                         'lot_Number': element.doc.lot_Number,
//                                                         'receiver_ID': element.doc.receiver_ID,
//                                                         'transitStatus': 'Received',
//                                                         'lotExpired': { $ne: true }
//                                                     }
//                                                 }, {
//                                                     '$group': {
//                                                         '_id': {
//                                                             'lot_Number': element.doc.lot_Number,
//                                                             'receiver_ID': element.doc.receiver_ID
//                                                         },
//                                                         'bagsReceived': {
//                                                             '$sum': '$no_of_Bag'
//                                                         }
//                                                     }
//                                                 }
//                                             ]

//                                             mongo.queryWithAggregatorLoop(aggrigation, 'seedData', db, function (responsee) {
//                                                 if (responsee) {
//                                                     let aggrigation2 = [
//                                                         {
//                                                             '$match': {
//                                                                 'lot_Number': element.lot_Number,
//                                                                 'source_ID': element.receiver_ID,
//                                                                 'transitStatus': 'Received',
//                                                                 'lotExpired': { $ne: true }
//                                                             }
//                                                         }, {
//                                                             '$group': {
//                                                                 '_id': {
//                                                                     'lot_Number': element.lot_Number,
//                                                                     'source_ID': element.receiver_ID
//                                                                 },
//                                                                 'bagsDispatched': {
//                                                                     '$sum': '$no_of_Bag'
//                                                                 }
//                                                             }
//                                                         }
//                                                     ]

//                                                     mongo.queryWithAggregatorLoop(aggrigation2, 'seedData', db, function (response4) {

//                                                         if (response4.length != 0) {
//                                                             let availableBags = responsee[0].bagsReceived - response4[0].bagsDispatched
//                                                             // callback({'availableBags':availableBags})
//                                                             element.availableBags = availableBags
//                                                             finalData.push(element)
//                                                         } else {
//                                                             let availableBags = responsee[0].bagsReceived
//                                                             // callback({'availableBags':availableBags})
//                                                             element.availableBags = availableBags
//                                                             finalData.push(element)
//                                                         }
//                                                         if (response3.length == count) {
//                                                             mongo.mongoClose(db, callback);
//                                                             callback(finalData)
//                                                         }

//                                                     })
//                                                 }
//                                             })


//                                         })

//                                     }
//                                 })
//                             })

//                         } else {
//                             callback({ respStatus: "seedExpired" })

//                         }
//                     }
//                     // FIXME: remove below portion after fixing testing date issue with OSSC
//                     else {

//                         mongo.mongoConnection(function (db) {
//                             var merged = [].concat.apply([], response2[0].godownIds);
//                             let aggrigate2 = [
//                                 {
//                                     '$match': {
//                                         'lot_Number': data.lotNumber,
//                                         'cert_Status': "Pass",
//                                         '$or': [
//                                             // {
//                                             //     'source_ID': {
//                                             //         '$in': merged
//                                             //     }
//                                             // },
//                                             {
//                                                 'receiver_ID': {
//                                                     '$in': merged
//                                                 }
//                                             }

//                                         ],
//                                         transitStatus: { $ne: 'Deleted' },
//                                         lotExpired: { $ne: true }
//                                     }
//                                 }, {
//                                     '$group': {
//                                         '_id': {
//                                             'lot_Number': '$lot_Number'
//                                         },
//                                         'doc': {
//                                             '$first': '$$ROOT'
//                                         }
//                                     }
//                                 }
//                             ]

//                             mongo.queryWithAggregatorLoop(aggrigate2, 'seedData', db, function (response3) {
//                                 if (response3) {
//                                     // callback(response3)
//                                     let count = 0
//                                     var finalData = []
//                                     response3.forEach(element => {
//                                         count++
//                                         let aggrigation = [
//                                             {
//                                                 '$match': {
//                                                     'lot_Number': element.doc.lot_Number,
//                                                     'receiver_ID': element.doc.receiver_ID,
//                                                     'transitStatus': 'Received',
//                                                     'lotExpired': { $ne: true }
//                                                 }
//                                             }, {
//                                                 '$group': {
//                                                     '_id': {
//                                                         'lot_Number': element.doc.lot_Number,
//                                                         'receiver_ID': element.doc.receiver_ID
//                                                     },
//                                                     'bagsReceived': {
//                                                         '$sum': '$no_of_Bag'
//                                                     }
//                                                 }
//                                             }
//                                         ]

//                                         mongo.queryWithAggregatorLoop(aggrigation, 'seedData', db, function (responsee) {
//                                             if (responsee) {
//                                                 let aggrigation2 = [
//                                                     {
//                                                         '$match': {
//                                                             'lot_Number': element.lot_Number,
//                                                             'source_ID': element.receiver_ID,
//                                                             'transitStatus': 'Received',
//                                                             'lotExpired': { $ne: true }
//                                                         }
//                                                     }, {
//                                                         '$group': {
//                                                             '_id': {
//                                                                 'lot_Number': element.lot_Number,
//                                                                 'source_ID': element.receiver_ID
//                                                             },
//                                                             'bagsDispatched': {
//                                                                 '$sum': '$no_of_Bag'
//                                                             }
//                                                         }
//                                                     }
//                                                 ]

//                                                 mongo.queryWithAggregatorLoop(aggrigation2, 'seedData', db, function (response4) {

//                                                     if (response4.length != 0) {
//                                                         let availableBags = responsee[0].bagsReceived - response4[0].bagsDispatched
//                                                         // callback({'availableBags':availableBags})
//                                                         element.availableBags = availableBags
//                                                         finalData.push(element)
//                                                     } else {
//                                                         let availableBags = responsee[0].bagsReceived
//                                                         // callback({'availableBags':availableBags})
//                                                         element.availableBags = availableBags
//                                                         finalData.push(element)
//                                                     }
//                                                     if (response3.length == count) {
//                                                         mongo.mongoClose(db, callback);
//                                                         callback(finalData)
//                                                     }

//                                                 })
//                                             }
//                                         })


//                                     })

//                                 }
//                             })
//                         })


//                     }


//                 }

//             })
//         }
//     })

// }
exports.getDataAccLot = async (data, callback) => {
    try {
        let splitLot = data.lotNumber.slice(5)
        let db = await newMongo.mongoConnection()
        let response1 = await newMongo.findOne('seedData', { lot_Number: { $regex: splitLot }, testing_Date: { $exists: true } }, db);
        let todayDate = moment().format("YYYY-MM-DD")
        let testingDate = moment(response1.testing_Date).add(9, 'months').format("YYYY-MM-DD")

        if (moment(todayDate).isBefore(testingDate)) {
            let aggregate1 = [
                {
                    '$match': {
                        'lot_Number': {
                            '$regex': splitLot
                        },
                        'cert_Status': 'Pass',
                        '$or': [
                            {
                                'receiver_ID': response1.receiver_ID
                            }
                        ],
                        'transitStatus': {
                            '$ne': 'Deleted'
                        },
                        'lotExpired': {
                            '$ne': true
                        }
                    }
                }, {
                    '$group': {
                        '_id': {
                            'lot_Number': '$lot_Number',
                            'receiver_ID': '$receiver_ID'
                        },
                        'doc': {
                            '$first': '$$ROOT'
                        },
                        'totalBagReceived': {
                            '$sum': '$no_of_Bag'
                        }
                    }
                }
            ]
            let response2 = await newMongo.queryWithAggregator(aggregate1, 'seedData', db)
            let aggregate2 = [
                {
                    '$match': {
                        'lot_Number': {
                            '$regex': splitLot
                        },
                        'cert_Status': 'Pass',
                        '$or': [
                            {
                                'source_ID': response1.receiver_ID
                            }
                        ],
                        'transitStatus': {
                            '$ne': 'Deleted'
                        },
                        'lotExpired': {
                            '$ne': true
                        }
                    }
                }, {
                    '$group': {
                        '_id': {
                            'lot_Number': '$lot_Number',
                            'source_ID': '$source_ID'
                        },
                        'doc': {
                            '$first': '$$ROOT'
                        },
                        'totalBagDispatched': {
                            '$sum': '$no_of_Bag'
                        }
                    }
                }
            ]
            let response3 = await newMongo.queryWithAggregator(aggregate2, 'seedData', db)
            if (response3.length > 0) {
                response1.availableBags = response2[0].totalBagReceived - response3[0].totalBagDispatched
                callback(response1)
                newMongo.mongoClose(db)
            } else {
                response1.availableBags = response2[0].totalBagReceived
                callback(response1)
                newMongo.mongoClose(db)
            }
        } else {
            callback({ respStatus: "seedExpired" })
        }
    } catch (e) {
        console.log(e.message);
    }
}

// exports.finalSubmit1 = function (data, callback) {
//     var x = data.submittedData
//     var y = data.lotSelectedData

//     y.dist_Code = y.destinDistCode
//     y.source_ID = y.receiver_ID
//     y.receiver_ID = x.idNumber
//     y.no_of_Bag = x.qtySold
//     y.date_Intake = new Date(x.date)
//     y.date_Sale = new Date(x.date)
//     y.receiverType = x.toWhomSale
//     y.SourceType = 'Godown'
//     y.receiverType = x.toWhomSale
//     y.sellData = true
//     y.info = 'bsStockSell'
//     y.pushedDateToBs = new Date()

//     delete y['availableBags']
//     delete y['_id']

//     // console.log(65,new Date(x.date));


//     mongo.autoIncrement(y, 'seedData', function (resp) {
//         if (resp) {
//             y.instrumentNo = y.dist_Code + "/" + y.source_ID + "/" + y.year + "/" + resp
//             // Added below for source godown name and destination name
//             var aggri = [
//                 {
//                     '$match': {
//                         '$or': [
//                             {
//                                 'all_Godowns.godown_ID': y.source_ID
//                             }
//                         ]
//                     }
//                 }, {
//                     '$unwind': {
//                         'path': '$all_Godowns'
//                     }
//                 }, {
//                     '$match': {
//                         '$or': [
//                             {
//                                 'all_Godowns.godown_ID': y.source_ID
//                             }
//                         ]
//                     }
//                 }
//             ]
//             mongo.queryWithAggregator(aggri, 'godownMaster', async function (respo) {
//                 if (respo) {
//                     if (respo[0].all_Godowns.godown_ID == y.source_ID) {
//                         y.destinDist = await respo[0].districtName
//                         y.destinDistCode = await respo[0].districtCode
//                         y.destinGodownName = await respo[0].all_Godowns.godown_Name
//                         y.sourceDist = await respo[0].districtName
//                         y.sourceDistCode = await respo[0].districtCode
//                         y.sourceGodownName = await respo[0].all_Godowns.godown_Name
//                         y.dist_Code = y.destinDistCode

//                     }
//                     // else {
//                     //     transitData.destinDist = await respo[0].districtName
//                     //     transitData.destinDistCode = await respo[0].districtCode
//                     //     transitData.destinGodownName = await respo[0].all_Godowns.godown_Name
//                     //     transitData.sourceGodownName = await respo[1].all_Godowns.godown_Name
//                     //     transitData.sourceDist = await respo[1].districtName
//                     //     transitData.sourceDistCode = await respo[1].districtCode
//                     //     transitData.dist_Code = transitData.destinDistCode

//                     // }

//                     mongo.insertDocument(y, "seedData", function (responsee) {
//                         callback(responsee)
//                     })
//                 }


//             })
//         }

//     })


// }

exports.finalSubmit = async (data, callback) => {
    try {
        var x = data.submittedData
        var y = data.lotSelectedData

        y.dist_Code = y.destinDistCode
        y.source_ID = y.receiver_ID
        y.receiver_ID = x.idNumber
        y.no_of_Bag = x.qtySold
        y.date_Intake = new Date(x.date)
        y.date_Sale = new Date(x.date)
        y.testing_Date=new Date(y.testing_Date)
        y.receiverType = x.toWhomSale
        y.SourceType = 'Godown'
        y.receiverType = x.toWhomSale
        y.sellData = true
        y.info = 'bsStockSell'
        y.pushedDateToBs = new Date()
        y.saleIdType=x.idType
        y.NameOfParty=x.NameOfParty
        y.perQuintalPrice=x.perQuintalPrice
        y.duNoForChallan=x.duNoForChallan
        y.addressOfParty=x.addressOfParty
        y.remarkForChallan=x.remarkForChallan

        delete y['availableBags']
        delete y['_id']
        let db = await newMongo.mongoConnection()
        let resp = await newMongo.autoIncrement(y, 'seedData', db)
        if (resp) {
            y.instrumentNo = "BS/"+y.dist_Code + "/" + y.source_ID + "/" + y.year + "/" + resp
            y.ref_No = "BS/"+y.dist_Code + "/" + y.source_ID + "/" + y.year + "/" + resp
            // Added below for source godown name and destination name
            var aggri = [
                {
                    '$match': {
                        '$or': [
                            {
                                'all_Godowns.godown_ID': y.source_ID
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
                                'all_Godowns.godown_ID': y.source_ID
                            }
                        ]
                    }
                }
            ]
            let respo = await newMongo.queryWithAggregator(aggri, 'godownMaster', db)
            if (respo) {
                if (respo[0].all_Godowns.godown_ID == y.source_ID) {
                    y.destinDist = await respo[0].districtName
                    y.destinDistCode = await respo[0].districtCode
                    y.destinGodownName = await respo[0].all_Godowns.godown_Name
                    y.sourceDist = await respo[0].districtName
                    y.sourceDistCode = await respo[0].districtCode
                    y.sourceGodownName = await respo[0].all_Godowns.godown_Name
                    y.dist_Code = y.destinDistCode

                }
                // mongo.insertDocument(y, "seedData", function (responsee) {
                //     callback(responsee)
                // })
                let responsee = await newMongo.insertDocument(y, 'seedData', db)
                let dataArray = []
                dataArray.push(y)
                callback({ status: responsee.insertedCount, dataForSis: dataArray })
                newMongo.mongoClose(db);
            }
        }

    } catch (e) {
        console.log(e.message);
    }
}

exports.failedSeedPushToSis = function (data, callback) {
    mongo.insertManyDocuments(data, "failedPushToSIS", function (response) {
        callback(response)
    })
}

// exports.getAvailableBags = function (data, callback) {
//     let aggrigation = [
//         {
//             '$match': {
//                 'lot_Number': data.lot_Number,
//                 'receiver_ID': data.receiver_ID,
//                 'transitStatus':'Received'
//             }
//         }, {
//             '$group': {
//                 '_id': {
//                     'lot_Number': data.lot_Number,
//                     'receiver_ID': data.receiver_ID
//                 },
//                 'bagsReceived': {
//                     '$sum': '$no_of_Bag'
//                 }
//             }
//         }
//     ]

//     mongo.queryWithAggregator(aggrigation, 'seedData', function (response) {
//         if (response) {
//             let aggrigation2 = [
//                 {
//                     '$match': {
//                         'lot_Number': data.lot_Number,
//                         'source_ID': data.receiver_ID,
//                         'transitStatus':'Received'
//                     }
//                 }, {
//                     '$group': {
//                         '_id': {
//                             'lot_Number': data.lot_Number,
//                             'source_ID': data.receiver_ID
//                         },
//                         'bagsDispatched': {
//                             '$sum': '$no_of_Bag'
//                         }
//                     }
//                 }
//             ]

//             mongo.queryWithAggregator(aggrigation2, 'seedData', function (response2) {
//                 if(response2.lenth>0){
//                     let availableBags=response[0].bagsReceived-response2[0].bagsDispatched
//                     callback({'availableBags':availableBags})
//                 }else{
//                     let availableBags=response[0].bagsReceived
//                     callback({'availableBags':availableBags})
//                 }

//             })
//         }
//     })
// }