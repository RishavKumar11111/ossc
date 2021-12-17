
var mongo = require('../../mongo/mongo')
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
var getGodownListForDispached = function (godownIdList) {
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
                    transitStatus: "Received"
                }
            }, {
                '$group': {
                    '_id': {
                        'lot_Number': '$lot_Number',
                        'source_ID': '$source_ID',
                        'crop': '$crop',
                        'variety': '$variety',
                        'class': '$class',
                        'sellData':'$sellData'
                    },
                    'doc': {
                        '$first': '$$ROOT'
                    },
                    'QuantDispatched': {
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
                    QuantDispatched: 1,
                }
            }
        ]
        mongo.queryWithAggregator(aggrigation, 'seedData', function (responseByReceiver) {
            callback(responseByReceiver);
        })
    })
}
var getGodownListForSaleReturn = function (godownIdList) {
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
                    saleReturn: true,
                    transitStatus:{$ne:'Deleted'}
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
                    },
                    'QuantReturned': {
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
                    QuantReturned: 1
                }
            }
        ]
        mongo.queryWithAggregator(aggrigation, 'seedData', function (responseByReceiver) {
            callback(responseByReceiver);
        })
    })
}
exports.loadAllData = async function (data, callback) {
    try {
        var godownIdList = await getGodownList(data.distData.dist)
        const [dispachedQuantity, receivedQuantity] = await Promise.all([
            getGodownListForDispached(godownIdList), getGodownListForSaleReturn(godownIdList)])
        var response = dispachedQuantity.map(a => Object.assign(a, receivedQuantity.find(b => b.lot_Number == a.lot_Number)))
        // console.log(response);
        var count = 0
        let dataForOutward = []
        response.forEach(element => {
            // console.log(element);
            mongo.findOne('spoMaster', { 'all_Spo.dist': element.doc.sourceDist }, function (respon) {
                if (respon) {
                    count = count + 1;
                    element.sourceZone = respon.spo_Name
                    dataForOutward.push(element)
                    if (response.length == count) {
                        // console.log(dataForOutward);
                        callback(dataForOutward)
                    }
                } else {
                    count = count + 1;
                    dataForOutward.push(element)
                    if (response.length == count) {
                        // console.log(dataForOutward);
                        callback(dataForOutward)
                    }
                }
            })

        })
    } catch (e) {
        callback(e.message)
    }

}


exports.saleDataDelete=function(data,callback){
    let dataMatch={lot_Number:data.lot_Number,no_of_Bag:data.no_of_Bag,instrumentNo:data.pr_Number,sellData:data.sellData,transitStatus:'Received'}
    mongo.updateOne(dataMatch,{transitStatus:"Deleted"},'seedData',function(response){
        // console.log(response.modifiedCount);
        callback(response.modifiedCount)
    })

}



// exports.loadAllData = function (data, callback) {

//     mongo.findOne('godownMaster', { districtName: godownIdList }, function (response) {
//         try{
//         let godownId = []
//         response.all_Godowns.forEach(element => {
//             godownId.push(element.godown_ID)
//         });
//         let aggrigation = [
//             {
//                 '$match': {
//                     '$or': [
//                         {
//                             'receiver_ID': {
//                                 '$in': godownId
//                             }
//                         }, {
//                             'source_ID': {
//                                 '$in': godownId
//                             }
//                         }
//                     ],
//                     transitStatus: 'Received'
//                 }
//             }, {
//                 '$group': {
//                     '_id': {
//                         'lot_Number': '$lot_Number',
//                         'receiver_ID': '$receiver_ID',
//                         'crop': '$crop',
//                         'variety': '$variety',
//                         'class': '$class'
//                     },
//                     'doc': {
//                         '$first': '$$ROOT'
//                     },
//                     'QuantReceived': {
//                         '$sum': '$no_of_Bag'
//                     }
//                 }
//             }
//         ]
//         mongo.queryWithAggregator(aggrigation, 'seedData', function (responseByReceiver) {
//             // callback(responseByReceiver)
//             // console.log(responseByReceiver[0]);
//             let allData = []
//             let count = 0

//             responseByReceiver.forEach(element => {
//                 var aggr = [
//                     {
//                         '$match': {
//                             'lot_Number': element._id.lot_Number,
//                             'source_ID': element._id.receiver_ID,
//                             'crop': element._id.crop,
//                             'variety': element._id.variety,
//                             'class': element._id.class,
//                             // 'transitStatus': 'Received'
//                         }
//                     }, {
//                         '$group': {
//                             '_id': {
//                                 'lot_Number': '$lot_Number',
//                                 'source_ID': '$source_ID',
//                                 'crop': '$crop',
//                                 'variety': '$variety',
//                                 'class': '$class'
//                             },
//                             'QuantDisp': {
//                                 '$sum': '$no_of_Bag'
//                             }
//                         }
//                     }
//                 ]

//                 mongo.queryWithAggregator(aggr, 'seedData', function (resp) {
//                     if (resp == [] || resp.length == 0) {
//                         element.QuantDisp = 0
//                     } else {
//                         element.QuantDisp = resp[0].QuantDisp
//                     }
//                     mongo.findOne('spoMaster', { 'all_Spo.dist': element.doc.sourceDist }, function (respon) {
//                         count++
//                         element.sourceZone = respon.spo_Name
//                         allData.push(element)
//                         if (count == responseByReceiver.length) {
//                             let finalData = []
//                             let count2 = 0
//                             allData.forEach(elem => {
//                                 var aggri = [
//                                     {
//                                         '$match': {
//                                             '$or': [
//                                                 {
//                                                     'districtCode': elem.doc.districtCode
//                                                 }, {
//                                                     'all_Godowns.godown_ID': elem.doc.receiver_ID
//                                                 }
//                                             ]
//                                         }
//                                     }
//                                 ]
//                                 mongo.queryWithAggregator(aggri, 'godownMaster', function (finalResp) {
//                                     count2++
//                                     if (finalResp.length == 1) {
//                                         elem.circle = 'Intra'
//                                         finalData.push(elem)
//                                     } else if (finalResp[0].spoCode == finalResp[1].spoCode) {
//                                         elem.circle = "Intra"
//                                         finalData.push(elem)
//                                     } else {

//                                         elem.circle = "Inter"
//                                         finalData.push(elem)

//                                     }
//                                     if (allData.length == count2) {
//                                         // callback(finalData)
//                                         let finalData2=[]
//                                         finalData.forEach(eleme=>{
//                                             mongo.findOne('cropMaster',{"Crop_Code":eleme.doc.crop},function(finalresp){
//                                                 eleme.cropName=finalresp.Crop_Name
//                                                 finalData2.push(eleme)
//                                                 if(finalData.length==finalData2.length){
//                                                     let finalData3=[]
//                                                     finalData2.forEach(element2=>{
//                                                         mongo.findOne('varietyMaster',{'Variety_Code':element2.doc.variety},function(finalresp2){
//                                                             element2.varietyName=finalresp2.Variety_Name
//                                                             finalData3.push(element2);
//                                                             if(finalData2.length==finalData3.length){
//                                                                 callback(finalData3)
//                                                             }
//                                                     })

//                                                     })
//                                                 }
//                                             })
//                                         })
//                                     }
//                                 })
//                             })
//                         }
//                     })

//                 })
//             })




//         })

//     }catch(e){
//         console.log("an error :"+e.message);
//     }

//     })


// }

