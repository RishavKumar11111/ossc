
const { response } = require('express')
var mongo = require('../../mongo/mongo')

exports.getAllSpos = function (callback) {
    mongo.findAll('spoMaster', function (response) {
        callback(response)
    })
}

var getGodownList = function (districtName) {
    return new Promise(callback => {
        var aggrigation2 = [
            { $match: { districtName: districtName } },
            { $unwind: "$all_Godowns" },
            { $group: { _id: null, godownId: { $push: "$all_Godowns.godown_ID" } } }
        ]
        mongo.queryWithAggregator(aggrigation2, 'godownMaster', function (godownIdList) {
            if (godownIdList.length > 0) {
                callback(godownIdList[0].godownId)
            } else {
                callback([])
            }
        })
    })
}
var getGodownListForPurchaseReturn = function (godownIdList) {
    return new Promise(callback => {
        let aggrigation = [
            {
                '$match': {
                    '$or': [{
                        'source_ID': {
                            '$in': godownIdList
                        }
                    }
                    ],
                    'purchaseReturn': true,
                    transitStatus: { $ne: 'Deleted' }
                }
            }, {
                '$group': {
                    '_id': {
                        'lot_Number': '$lot_Number',
                        'source_ID': '$source_ID',
                        'crop': '$crop',
                        'variety': '$variety',
                        'class': '$class'
                    },
                    'doc': {
                        '$first': '$$ROOT'
                    },
                    'QuantReturned': {
                        '$sum': '$no_of_Bag'
                    }
                }
            },
            {
                $project: {
                    lot_Number: "$_id.lot_Number",
                    source_ID: "$_id.source_ID",
                    crop: "$_id.crop",
                    variety: "$_id.variety",
                    class: "$_id.class",
                    doc: 1,
                    QuantReturned: 1,
                }
            }
        ]
        mongo.queryWithAggregator(aggrigation, 'seedData', function (responseByReceiver) {
            callback(responseByReceiver);
        })
    })
}
var getGodownListForDispached = function (godownIdList) {
    return new Promise(callback => {
        let aggrigation = [
            {
                '$match': {
                    '$or': [{
                        'receiver_ID': {
                            '$in': godownIdList
                        }
                    }
                    ],
                    transitStatus: "Received"
                }
            }, {
                '$group': {
                    '_id': {
                        'lot_Number': '$lot_Number',
                        'receiver_ID': '$receiver_ID',
                        'crop': '$crop',
                        'variety': '$variety',
                        'class': '$class'
                    },
                    'doc': {
                        '$first': '$$ROOT'
                    }
                    // ,
                    // 'saleReturn': {
                    //     '$first': '$saleReturn'
                    // }
                    ,
                    'QuantDispatched': {
                        '$sum': '$no_of_Bag'
                    }
                }
            },
            {
                $project: {
                    lot_Number: "$_id.lot_Number",
                    receiver_ID: "$_id.receiver_ID",
                    crop: "$_id.crop",
                    variety: "$_id.variety",
                    class: "$_id.class",
                    doc: 1,
                    QuantDispatched: 1
                    // ,
                    // saleReturn: 1
                }
            }
        ]
        mongo.queryWithAggregator(aggrigation, 'seedData', function (responseByReceiver) {
            callback(responseByReceiver);
            //===============================Below is for Purchase return ===========================
            // let responseByReceiverData = []
            // let count = 0
            // responseByReceiver.forEach(element => {
            //     let aggrigate = [
            //         {
            //             '$match': {
            //                 'lot_Number': element.doc.lot_Number,
            //                 'crop': element.doc.crop,
            //                 'variety': element.doc.variety,
            //                 'class': element.doc.class,
            //                 'source_ID': element.doc.receiver_ID,
            //                 $or: [{ sellData: true }, { info: 'godownTransferByBS' }]
            //             }
            //         }
            //     ]
            //     mongo.queryWithAggregator(aggrigate, 'seedData', function (resp) {
            //         count++
            //         if (resp.length > 0) {
            //             element.purchaseDeleteBtn = false
            //             responseByReceiverData.push(element)
            //         } else {
            //             element.purchaseDeleteBtn = true
            //             responseByReceiverData.push(element)
            //         }

            //         if(responseByReceiver.length==count){
            //             callback(responseByReceiverData)
            //         }

            //     })
            // })

        })
    })
}
exports.loadAllData = async function (data, callback) {
    try {
        var godownIdList = await getGodownList(data.distData.dist)
        const [dispachedQuantity, returnedQuantity] = await Promise.all([
            getGodownListForDispached(godownIdList), getGodownListForPurchaseReturn(godownIdList)
        ])
        var response = dispachedQuantity.map(a => Object.assign(a, returnedQuantity.find(b => b.lot_Number == a.lot_Number)))
        let finalData = []
        let count = 0
        response.forEach(element => {
            mongo.findOne('spoMaster', { 'all_Spo.dist': element.doc.sourceDist }, function (respon) {
                // console.log(respon);
                if (respon) {
                    count++
                    element.sourceZone = respon.spo_Name
                    // console.log('hi');
                    element.doc.destinGodownName = element.doc.sourceGodownName
                    finalData.push(element)
                    if (response.length == count) {
                        callback(finalData)
                    }

                } else {
                    count++
                    finalData.push(element)
                    if (response.length == count) {
                        callback(finalData)
                    }
                }


            })
        })
    } catch (e) {
        callback(e.message)
    }

}


exports.purchaseDataDelete = function (data, callback) {

    let aggrigate = [
        {
            '$match': {
                'lot_Number': data.lot_Number,
                'crop': data.crop,
                'variety': data.variety,
                'class': data.class,
                'source_ID': data.receiver_ID,
                'transitStatus': 'Received',
                $or: [{ sellData: true }, { info: 'godownTransferByBS' }]
            }
        }
    ]
    mongo.queryWithAggregator(aggrigate, 'seedData', function (response1) {
        if (response1.length == 0) {
            let dataMatch = {
                lot_Number: data.lot_Number,
                no_of_Bag: data.no_of_Bag,
                transitStatus: 'Received', 
                year: data.year,
                crop: data.crop,
                variety: data.variety,
                class: data.class
            }
            mongo.updateOne(dataMatch, { transitStatus: "Deleted" }, 'seedData', function (response2) {
                // console.log(response.modifiedCount);
                callback(response2.modifiedCount)
            })
        }else{
            callback('not applicable')
        }
    })
    // let dataMatch = { lot_Number: data.lot_Number, no_of_Bag: data.no_of_Bag, transitStatus: 'Received' }
    // mongo.updateOne(dataMatch, { transitStatus: "Deleted" }, 'seedData', function (response) {
    //     // console.log(response.modifiedCount);
    //     callback(response.modifiedCount)
    // })
}





// exports.loadAllData = function (data, callback) {

//         mongo.findOne('godownMaster', { districtName: data.distData.dist }, function (response) {
//             try{
//             let godownId = []
//             response.all_Godowns.forEach(element => {
//                 godownId.push(element.godown_ID)
//             });
//             let aggrigation = [
//                 {
//                     '$match': {
//                         '$or': [
//                             {
//                                 'receiver_ID': {
//                                     '$in': godownId
//                                 }
//                             }, {
//                                 'source_ID': {
//                                     '$in': godownId
//                                 }
//                             }
//                         ],
//                         transitStatus: 'Received'
//                     }
//                 }, {
//                     '$group': {
//                         '_id': {
//                             'lot_Number': '$lot_Number',
//                             'receiver_ID': '$receiver_ID',
//                             'crop': '$crop',
//                             'variety': '$variety',
//                             'class': '$class'
//                         },
//                         'doc': {
//                             '$first': '$$ROOT'
//                         },
//                         'QuantReceived': {
//                             '$sum': '$no_of_Bag'
//                         }
//                     }
//                 }
//             ]
//             mongo.queryWithAggregator(aggrigation, 'seedData', function (responseByReceiver) {
//                 // callback(responseByReceiver)
//                 // console.log(responseByReceiver[0]);
//                 let allData = []
//                 let count = 0

//                 responseByReceiver.forEach(element => {
//                     var aggr = [
//                         {
//                             '$match': {
//                                 'lot_Number': element._id.lot_Number,
//                                 'source_ID': element._id.receiver_ID,
//                                 'crop': element._id.crop,
//                                 'variety': element._id.variety,
//                                 'class': element._id.class,
//                                 'transitStatus': 'Received'
//                             }
//                         }, {
//                             '$group': {
//                                 '_id': {
//                                     'lot_Number': '$lot_Number',
//                                     'source_ID': '$source_ID',
//                                     'crop': '$crop',
//                                     'variety': '$variety',
//                                     'class': '$class'
//                                 },
//                                 'QuantDisp': {
//                                     '$sum': '$no_of_Bag'
//                                 }
//                             }
//                         }
//                     ]

//                     mongo.queryWithAggregator(aggr, 'seedData', function (resp) {
//                         if (resp == [] || resp.length == 0) {
//                             element.QuantDisp = 0
//                         } else {
//                             element.QuantDisp = resp[0].QuantDisp
//                         }
//                         mongo.findOne('spoMaster', { 'all_Spo.dist': element.doc.sourceDist }, function (respon) {
//                             count++
//                             element.sourceZone = respon.spo_Name
//                             allData.push(element)
//                             if (count == responseByReceiver.length) {
//                                 let finalData = []
//                                 let count2 = 0
//                                 allData.forEach(elem => {
//                                     var aggri = [
//                                         {
//                                             '$match': {
//                                                 '$or': [
//                                                     {
//                                                         'districtCode': elem.doc.districtCode
//                                                     }, {
//                                                         'all_Godowns.godown_ID': elem.doc.receiver_ID
//                                                     }
//                                                 ]
//                                             }
//                                         }
//                                     ]
//                                     mongo.queryWithAggregator(aggri, 'godownMaster', function (finalResp) {
//                                         count2++
//                                         if (finalResp.length == 1) {
//                                             elem.circle = 'Intra'
//                                             finalData.push(elem)
//                                         } else if (finalResp[0].spoCode == finalResp[1].spoCode) {
//                                             elem.circle = "Intra"
//                                             finalData.push(elem)
//                                         } else {

//                                             elem.circle = "Inter"
//                                             finalData.push(elem)

//                                         }
//                                         if (allData.length == count2) {
//                                             // callback(finalData)
//                                             let finalData2=[]
//                                             finalData.forEach(eleme=>{
//                                                 mongo.findOne('cropMaster',{"Crop_Code":eleme.doc.crop},function(finalresp){
//                                                     eleme.cropName=finalresp.Crop_Name
//                                                     finalData2.push(eleme)
//                                                     if(finalData.length==finalData2.length){
//                                                         let finalData3=[]
//                                                         finalData2.forEach(element2=>{
//                                                             mongo.findOne('varietyMaster',{'Variety_Code':element2.doc.variety},function(finalresp2){
//                                                                 element2.varietyName=finalresp2.Variety_Name
//                                                                 finalData3.push(element2);
//                                                                 if(finalData2.length==finalData3.length){
//                                                                     callback(finalData3)
//                                                                 }
//                                                         })

//                                                         })
//                                                     }
//                                                 })
//                                             })
//                                         }
//                                     })
//                                 })
//                             }
//                         })

//                     })
//                 })




//             })

//         }catch(e){
//             console.log("an error :"+e.message);
//         }

//         })


// }


// exports.reportData=function(data){
//     return new Promise(async(resolve,reject)=>{
//         let reportData1=await mongo.findOne('godownMaster', { districtName: data.distData.dist }).toArray
//         console.log(reportData1);
//     })
// }