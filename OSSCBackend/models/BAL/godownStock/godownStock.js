var mongo = require('../../mongo/mongo');
var newMongo = require('../../mongo/newMongo')


// exports.loadGodown = function (data, callback) {
//     var aggrigation = [{
//         $match: {
//             "all_Spo.spoCd": data
//         }
//     }
//         //   , {$lookup: {
//         //     from: 'districtMaster',
//         //     localField: 'spo_Code',
//         //     foreignField: 'spo_Code',
//         //     as: 'districtMasterSpo'
//         //   }}
//     ]
//     mongo.queryWithAggregator(aggrigation, 'spoMaster', function (response) {
//         try {
//             var godownData = []
//             var cnt = 0;
//             response[0].all_Spo.forEach(element => {
//                 mongo.findOne('godownMaster', { 'districtName': element.dist }, function (responseForGodown) {
//                     //console.log(responseForGodown);
//                     if (responseForGodown) {
//                         cnt = cnt + 1;
//                         var countt = 0
//                         responseForGodown.all_Godowns.forEach(elemnt => {
//                             countt = countt + 1
//                             godownData.push(elemnt);
//                             if (response[0].all_Spo.length == cnt && countt == responseForGodown.all_Godowns.length) {
//                                 callback(godownData)
//                             }
//                         })
//                     }
//                 })
//             })
//         } catch (e) {
//             console.log(e.message)
//         }

//     })
// }

exports.loadGodown=async(data, callback)=>{
    try{
        let aggrigation =[
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
    
        let db=await newMongo.mongoConnection()
        let response=await newMongo.queryWithAggregator(aggrigation,'spoMaster',db);
        let aggrigation1=[
            {
                '$match': {
                    'districtName': response[0].all_Spo.dist
                }
            }, {
                '$group': {
                    '_id': null, 
                    'godownList': {
                        '$push': '$all_Godowns'
                    }
                }
            }
        ]
        let response1=await newMongo.queryWithAggregator(aggrigation1,'godownMaster',db);
        callback(response1[0].godownList[0])
        newMongo.mongoClose(db);

    }catch(e){

    }
}

exports.classAccVariety = function (data, callback) {
    var aggrigation = [{
        $match: {
            $or: [{ "source_ID": data.godownId }, { "receiver_ID": data.godownId }]
        }
    }, {
        $match: {
            "crop": data.cropType,
            "variety": data.variety,
            transitStatus: { $ne: 'Deleted' }
        }
    }, {
        $group: {
            _id: { "class": "$class" }
        }
    }]
    mongo.queryWithAggregator(aggrigation, 'seedData', function (response) {
        //console.log(response);
        let count = 0
        var dataaa = []
        if (response) {
            response.forEach(element => {
                count = count + 1
                dataaa.push(element._id.class)
                if (count == response.length) {
                    callback(dataaa);
                }
            })
        }
    })
}

exports.varietyAccCrop = function (data, callback) {
    // var aggrigation = [{ $match: { $or: [{ "source_ID": data.godownId }, { "receiver_ID": data.godownId }] } }, {
    //     $match: {
    //         "crop": data.seedType,
    //         transitStatus: { $ne: 'Deleted' }
    //     }
    // }, {
    //     $group: {
    //         _id: { "variety": "$variety" }
    //     }
    // }]
    var aggrigation = [
        {
            '$match': {
                '$or': [
                    {
                        'source_ID': data.godownId
                    }, {
                        'receiver_ID': data.godownId
                    }
                ]
            }
        }, {
            '$match': {
                'crop': data.seedType,
                'transitStatus': {
                    '$ne': 'Deleted'
                }
            }
        }, {
            '$group': {
                '_id': {
                    'variety': '$variety',
                    'varietyName': "$varietyName"
                }
            }
        }
    ]
    mongo.queryWithAggregator(aggrigation, 'seedData', function (response) {
        //console.log(response);
        let count = 0
        var dataForVariety = []
        if (response) {
            response.forEach(elem => {
                count = count + 1
                dataForVariety.push(elem._id);
                if (count == response.length) {
                    callback(dataForVariety);

                }
            })
        }
    })
}


exports.allStocks = function (data, callback) {
    var aggrigation = [
        {
            '$match': {
                '$or': [
                    {
                        'source_ID': data
                    }, {
                        'receiver_ID': data
                    }
                ],
                'transitStatus': {
                    '$ne': 'Deleted'
                }
            }
        }, {
            '$group': {
                '_id': {
                    'crop': '$crop',
                    'cropName': '$cropName'
                }
            }
        }
    ];
    mongo.queryWithAggregator(aggrigation, "seedData", function (response) {
        var dataForCrop = []
        let count = 0
        if (response.length == 0) {
            callback(dataForCrop)
        }
        response.forEach(elem => {
            count = count + 1
            dataForCrop.push(elem._id);

            if (count == response.length) {
                callback(dataForCrop);
            }
        })
    })
}

exports.dataAccVarietySelectAll = function (data, callback) {
    var aggrigation = [{
        $match: {
            $or: [{ "receiver_ID": data.godownId }, { "source_ID": data.godownId }]
        }
    }, {
        $match: {
            "crop": data.cropType,
            transitStatus: { $ne: 'Deleted' }
        }
    }, {
        $group: {
            _id: { "class": "$class" }


        }
    }]
    mongo.queryWithAggregator(aggrigation, 'seedData', function (response) {
        var dataforCls = []
        let countforCls = 0
        if (response.length == 0) {
            callback(dataforCls)
        }
        response.forEach(elem => {
            countforCls = countforCls + 1
            dataforCls.push(elem._id.class);
            if (countforCls == response.length) {
                callback(dataforCls);
            }
        })
    })
}


exports.classOfCropSelectAll = function (data, callback) {
    var aggrigation = [{
        $match: {
            $or: [{ 'source_ID': data }, { 'receiver_ID': data }],
            transitStatus: { $ne: 'Deleted' }
        }
    }, {
        $group: {
            _id: { 'class': '$class' },

        }
    }]
    mongo.queryWithAggregator(aggrigation, 'seedData', function (response) {

        var dataa = []
        let countt = 0
        if (response.length == 0) {
            callback(dataa);
        }
        response.forEach(elem => {
            countt = countt + 1
            dataa.push(elem._id.class);
            if (countt == response.length) {
                callback(dataa);
            }
        })
    })
}



exports.receivedStockDetail = function (data, callback) {
    var match = {}
    if (data.cropType == 'All' && data.classType == 'All') {
        match.receiver_ID = data.godownId;
        // match.receiverType = 'godown'
        match.transitStatus = 'Received'
    } else if (data.varietyType == 'All' && data.classType == 'All') {
        match.receiver_ID = data.godownId;
        match.crop = data.cropType;
        // match.receiverType = 'godown'
        match.transitStatus = 'Received'
    } else if (data.cropType == "All" && data.varietyType == "All") {
        match.receiver_ID = data.godownId;
        match.class = data.classType
        // match.receiverType = 'godown'
        match.transitStatus = 'Received'
    } else if (data.classType == 'All') {
        match.receiver_ID = data.godownId;
        match.crop = data.cropType;
        match.variety = data.varietyType;
        // match.receiverType = 'godown'
        match.transitStatus = 'Received'
    } else if (data.varietyType == 'All') {
        match.receiver_ID = data.godownId;
        match.crop = data.cropType;
        match.class = data.classType;
        // match.receiverType = 'godown'
        match.transitStatus = 'Received'
    } else if (data.cropType == 'All') {
        match.receiver_ID = data.godownId;
        match.class = data.classType
        //match.receiverType = 'godown'
        match.transitStatus = 'Received'
    } else {
        match.receiver_ID = data.godownId;
        match.crop = data.cropType;
        match.variety = data.varietyType;
        match.class = data.classType
        //match.receiverType = 'godown'
        match.transitStatus = 'Received'
    }
    var aggrigation = [{ '$match': match }]
    mongo.queryWithAggregator(aggrigation, 'seedData', function (response) {
        try {
            // Circle test start
            var circle = data.selectedCircle;
            var circleData = [];
            var countt = 0;
            if (circle == 'Intra Circle') {
                response.forEach(item => {

                    // var dd = item.date_Intake.getDate()
                    // var mm = item.date_Intake.getMonth() + 1
                    // var yy = item.date_Intake.getFullYear()
                    // if (dd < 10) {
                    //     dd = '0' + dd;
                    // }
                    // if (mm < 10) {
                    //     mm = '0' + mm;
                    // }
                    // item.date_Intake = dd + '/' + mm + '/' + yy;

                    var aggri = [{
                        $match: {
                            $or: [{ "all_Godowns.godown_ID": item.source_ID }, { "all_Godowns.godown_ID": item.receiver_ID }]
                        }
                    }]
                    mongo.queryWithAggregator(aggri, 'godownMaster', function (resp) {
                        countt = countt + 1;
                        if (resp.length == 1) {
                            circleData.push(item);

                        }
                        if (countt == response.length) {
                            callback(circleData);
                            circleData = [];
                            countt = 0;
                        }
                    })

                })
            } else if (circle == 'Inter Circle') {
                response.forEach(itemm => {

                    var aggrii = [{
                        $match: {
                            $or: [{ "all_Godowns.godown_ID": itemm.source_ID }, { "all_Godowns.godown_ID": itemm.receiver_ID }]
                        }
                    }]
                    mongo.queryWithAggregator(aggrii, 'godownMaster', function (respo) {

                        countt = countt + 1;
                        if (respo.length != 1) {
                            circleData.push(itemm);

                        }
                        if (countt == response.length) {
                            callback(circleData);
                            circleData = [];
                            countt = 0;
                        }


                    })

                })

            } else {
                let num = 0;
                response.forEach(element => {
                    num = num + 1;

                    if (num == response.length) {
                        callback(response);
                    }
                })
            }
        } catch (e) {
            callback({ error: 500 })
        }


        // Circle test end
        //callback(response);
    })
}

exports.dispatchedStockDetail = function (data, callback) {
    var match = {}
    if (data.cropType == 'All' && data.classType == 'All') {
        match.source_ID = data.godownId;
        // match.SourceType = 'godown'

    } else if (data.varietyType == 'All' && data.classType == 'All') {
        match.source_ID = data.godownId;
        match.crop = data.cropType;
        // match.SourceType = 'godown'
    } else if (data.classType == 'All') {
        match.source_ID = data.godownId;
        match.crop = data.cropType;
        match.variety = data.varietyType;
        // match.SourceType = 'godown'
    } else if (data.varietyType == 'All') {
        match.source_ID = data.godownId;
        match.crop = data.cropType;
        match.class = data.classType;
        // match.SourceType = 'godown'
    } else if (data.cropType == 'All') {
        match.source_ID = data.godownId;
        match.class = data.classType
        // match.SourceType = 'godown'
    } else {
        match.source_ID = data.godownId;
        match.crop = data.cropType;
        match.variety = data.varietyType;
        match.class = data.classType;
        // match.SourceType = 'godown';
    }
    var aggrigation = [{ '$match': match }]
    mongo.queryWithAggregator(aggrigation, 'seedData', function (response) {
        try {
            // Circle test start
            var circle = data.selectedCircle;
            var circleData = [];
            var countt = 0;
            if (circle == 'Intra Circle') {
                response.forEach(item => {

                    // var dd = item.stockTrnsDate.getDate()
                    // var mm = item.stockTrnsDate.getMonth() + 1
                    // var yy = item.stockTrnsDate.getFullYear()
                    // if (dd < 10) {
                    //     dd = '0' + dd;
                    // }
                    // if (mm < 10) {
                    //     mm = '0' + mm;
                    // }
                    // item.stockTrnsDate = dd + '/' + mm + '/' + yy;

                    var aggri = [{
                        $match: {
                            $or: [{ "all_Godowns.godown_ID": item.source_ID }, { "all_Godowns.godown_ID": item.receiver_ID }]
                        }
                    }]
                    mongo.queryWithAggregator(aggri, 'godownMaster', function (resp) {
                        countt = countt + 1;
                        if (resp.length == 1) {
                            circleData.push(item);

                        }
                        if (countt == response.length) {
                            callback(circleData);
                            circleData = [];
                            countt = 0;
                        }
                    })

                })
            } else if (circle == 'Inter Circle') {
                response.forEach(itemm => {

                    // var dd = itemm.stockTrnsDate.getDate()
                    // var mm = itemm.stockTrnsDate.getMonth() + 1
                    // var yy = itemm.stockTrnsDate.getFullYear()
                    // if (dd < 10) {
                    //     dd = '0' + dd;
                    // }
                    // if (mm < 10) {
                    //     mm = '0' + mm;
                    // }
                    // itemm.stockTrnsDate = dd + '/' + mm + '/' + yy;

                    var aggrii = [{
                        $match: {
                            $or: [{ "all_Godowns.godown_ID": itemm.source_ID }, { "all_Godowns.godown_ID": itemm.receiver_ID }]
                        }
                    }]
                    mongo.queryWithAggregator(aggrii, 'godownMaster', function (respo) {

                        countt = countt + 1;
                        if (respo.length != 1) {
                            circleData.push(itemm);

                        }
                        if (countt == response.length) {
                            callback(circleData);
                            circleData = [];
                            countt = 0;
                        }


                    })

                })

            } else {
                let num = 0;
                response.forEach(element => {
                    num = num + 1;
                    // var dd = element.stockTrnsDate.getDate()
                    // var mm = element.stockTrnsDate.getMonth() + 1
                    // var yy = element.stockTrnsDate.getFullYear()
                    // if (dd < 10) {
                    //     dd = '0' + dd;
                    // }
                    // if (mm < 10) {
                    //     mm = '0' + mm;
                    // }
                    // element.stockTrnsDate = dd + '/' + mm + '/' + yy;
                    if (num == response.length) {
                        callback(response);
                    }
                })
            }

            // Circle test end
        } catch (e) {
            callback({ error: 500 })
        }
    })
}


// exports.totalStockDetail1 = function (data, callback) {
//     var match = {}
//     if (data.cropType == 'All' && data.classType == 'All') {
//         match.receiver_ID = data.godownId;
//         match.transitStatus = "Received"

//     } else if (data.varietyType == 'All' && data.classType == 'All') {
//         match.receiver_ID = data.godownId;
//         match.transitStatus = "Received"
//         match.crop = data.cropType;

//     } else if (data.classType == 'All') {
//         match.receiver_ID = data.godownId;
//         match.crop = data.cropType;
//         match.transitStatus = "Received"
//         match.variety = data.varietyType;

//     } else if (data.cropType == 'All') {
//         match.receiver_ID = data.godownId;
//         match.transitStatus = "Received"
//         match.class = data.classType

//     } else if (data.varietyType == 'All') {
//         match.receiver_ID = data.godownId;
//         match.crop = data.cropType
//         match.transitStatus = "Received"
//         match.class = data.classType

//     } else {
//         match.receiver_ID = data.godownId;
//         match.crop = data.cropType;
//         match.variety = data.varietyType;
//         match.transitStatus = "Received"
//         match.class = data.classType;

//     }
//     var aggrigation = [{
//         $match: match
//     }, {
//         $project: {
//             lot_Number: { $toUpper: '$lot_Number' },
//             receiver_ID: 1,
//             crop: 1,
//             cropName: 1,
//             variety: 1,
//             varietyName: 1,
//             class: 1,
//             season: 1,
//             qty_Per_Bag_Kg: 1,
//             pr_Number: 1,
//             no_of_Bag: 1,
//             year: 1
//         }
//     }, {
//         $group: {
//             _id: {
//                 'lot_Number': '$lot_Number',
//                 'receiver_ID': '$receiver_ID',
//                 'crop': '$crop',
//                 'cropName': "$cropName",
//                 'variety': '$variety',
//                 'varietyName': '$varietyName',
//                 'class': '$class',
//                 'season': '$season',
//                 'qty_Per_Bag_Kg': '$qty_Per_Bag_Kg',
//                 'pr_Number': '$pr_Number'
//             },
//             totalRcv: {
//                 "$sum": "$no_of_Bag"
//             },
//             year: { $first: "$year" }
//         }
//     }]
//     mongo.queryWithAggregator(aggrigation, 'seedData', function (response) {
//         try {
//             var resData = [];
//             response.forEach(async item => {
//                 if (item._id.lot_Number == 'DEC/20-18-315-08G63533-1') {
//                     console.log(item);
//                 }
//                 let lot = item._id.lot_Number.toUpperCase()
//                 let matchData = {
//                     'source_ID': item._id.receiver_ID,
//                     'lot_Number': lot,
//                     'crop': item._id.crop,
//                     'variety': item._id.variety,
//                     'class': item._id.class,
//                     'season': item._id.season,
//                     'qty_Per_Bag_Kg': item._id.qty_Per_Bag_Kg,
//                     'pr_Number': item._id.pr_Number
//                 }

//                 let aggrigationn = [{
//                     '$project': {
//                         'lot_Number': {
//                             '$toUpper': '$lot_Number'
//                         },
//                         'source_ID': 1,
//                         'crop': 1,
//                         'cropName': 1,
//                         'variety': 1,
//                         'varietyName': 1,
//                         'class': 1,
//                         'season': 1,
//                         'qty_Per_Bag_Kg': 1,
//                         'pr_Number': 1,
//                         'no_of_Bag': 1
//                     }
//                 }, { '$match': matchData }]

//                 mongo.queryWithAggregator(aggrigationn, 'seedData', function (resp) {
//                     if (resp[0] == undefined || resp[0] == null || resp.length == 0 || resp == []) {
//                         item.availableBag = item.totalRcv;
//                         resData.push(item);
//                         if (response.length == resData.length) {
//                             callback(resData);
//                         }
//                     } else {
//                         var countDis = 0;
//                         var dispBagCount = 0;
//                         resp.forEach(element => {
//                             if (element.lot_Number == 'DEC/20-18-315-08G63533-1') {
//                                 console.log(5555, element.no_of_Bag);
//                             }
//                             // console.log(element);
//                             countDis = countDis + 1;
//                             dispBagCount = dispBagCount + element.no_of_Bag
//                             if (countDis == resp.length) {
//                                 item.availableBag = item.totalRcv - dispBagCount;
//                                 resData.push(item)
//                             }
//                         })
//                         // item.availableBag = item.no_of_Bag - resp[0].no_of_Bag;
//                         // resData.push(item);
//                         if (response.length == resData.length) {
//                             callback(resData);
//                         }
//                     }

//                 })

//             })
//         } catch (e) {
//             callback({ error: 500 })
//         }
//     })

// }

exports.totalStockDetail = async (data, callback) => {
    try {
        let match = {}
        if (data.cropType == 'All' && data.classType == 'All') {
            match.receiver_ID = data.godownId;
            match.transitStatus = "Received"

        } else if (data.varietyType == 'All' && data.classType == 'All') {
            match.receiver_ID = data.godownId;
            match.transitStatus = "Received"
            match.crop = data.cropType;

        } else if (data.classType == 'All') {
            match.receiver_ID = data.godownId;
            match.crop = data.cropType;
            match.transitStatus = "Received"
            match.variety = data.varietyType;

        } else if (data.cropType == 'All') {
            match.receiver_ID = data.godownId;
            match.transitStatus = "Received"
            match.class = data.classType

        } else if (data.varietyType == 'All') {
            match.receiver_ID = data.godownId;
            match.crop = data.cropType
            match.transitStatus = "Received"
            match.class = data.classType

        } else {
            match.receiver_ID = data.godownId;
            match.crop = data.cropType;
            match.variety = data.varietyType;
            match.transitStatus = "Received"
            match.class = data.classType;

        }
        let aggrigation = [{
            $match: match
        }, {
            $project: {
                lot_Number: { $toUpper: '$lot_Number' },
                receiver_ID: 1,
                crop: 1,
                cropName: 1,
                variety: 1,
                varietyName: 1,
                class: 1,
                season: 1,
                qty_Per_Bag_Kg: 1,
                pr_Number: 1,
                no_of_Bag: 1,
                year: 1
            }
        }, {
            $group: {
                _id: {
                    'lot_Number': '$lot_Number',
                    'receiver_ID': '$receiver_ID',
                    'crop': '$crop',
                    'cropName': "$cropName",
                    'variety': '$variety',
                    'varietyName': '$varietyName',
                    'class': '$class',
                    'season': '$season',
                    'qty_Per_Bag_Kg': '$qty_Per_Bag_Kg',
                    'pr_Number': '$pr_Number'
                },
                totalRcv: {
                    "$sum": "$no_of_Bag"
                },
                year: { $first: "$year" }
            }
        }]

        let db = await newMongo.mongoConnection()
        let response = await newMongo.queryWithAggregator(aggrigation, 'seedData', db)
        let resData = [];
        response.forEach(async item => {
            let lot = item._id.lot_Number.toUpperCase()
            let matchData = {
                'source_ID': item._id.receiver_ID,
                'lot_Number': lot,
                'crop': item._id.crop,
                'variety': item._id.variety,
                'class': item._id.class,
                'season': item._id.season,
                'qty_Per_Bag_Kg': item._id.qty_Per_Bag_Kg
            }

            let aggrigationn = [{
                '$project': {
                    'lot_Number': {
                        '$toUpper': '$lot_Number'
                    },
                    'source_ID': 1,
                    'crop': 1,
                    'variety': 1,
                    'class': 1,
                    'season': 1,
                    'qty_Per_Bag_Kg': 1,
                    'pr_Number': 1,
                    'no_of_Bag': 1
                }
            }, { '$match': matchData }]

            let resp = await newMongo.queryWithAggregator(aggrigationn, 'seedData', db)
            if (resp[0] == undefined || resp[0] == null || resp.length == 0 || resp == []) {
                item.availableBag = item.totalRcv;
                resData.push(item);
                if (response.length == resData.length) {
                    callback(resData);
                }
            } else {
                var countDis = 0;
                var dispBagCount = 0;
                resp.forEach(element => {
                    countDis = countDis + 1;
                    dispBagCount = dispBagCount + element.no_of_Bag
                    if (countDis == resp.length) {
                        item.availableBag = item.totalRcv - dispBagCount;
                        resData.push(item)
                    }
                })
                if (response.length == resData.length) {
                    callback(resData);
                }
            }
        })

    } catch (e) {
        console.log(e.message);
    }

}