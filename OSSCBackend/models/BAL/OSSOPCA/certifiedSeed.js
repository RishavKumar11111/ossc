var mongo = require('../../mongo/mongo');

exports.ossopcaSeedStatus = function (data, callback) {
    if (data.cert_Status == "Pass" || data.cert_Status == "pass" || data.cert_Status == "PASS") {
        mongo.updateOne({ "lot_Number": data.lot_Number }, { "cert_Status": data.cert_Status, 'testing_Date': data.testing_Date, ossopcaCertDate: new Date() }, "seedData", function (response) {
            callback(response);
        })
    } else if(data.cert_Status=='Downgraded'){
        mongo.updateOne({ "lot_Number": data.lot_Number }, { "cert_Status": 'Pass', 'testing_Date': data.testing_Date, ossopcaCertDate: new Date(),class:'Certified',classDowngradedByOssopca:true }, "seedData", function (response) {
            callback(response);
        })
    }else {
        mongo.updateOne({ "lot_Number": data.lot_Number }, { "cert_Status": data.cert_Status, 'testing_Date': data.testing_Date, ossopcaCertDate: new Date() }, "seedData", function (response) {
            callback(response);
        })
    }

}

exports.failedToCertByOssopca = function (data, callback) {
    mongo.insertDocument(data, 'failedToCertByOssopca', function (response) {
        callback(response)
    })
}

exports.approvedSeed = function (data, callback) {
    mongo.findOne("seedData", { "lot_Number": data }, function (response) {
        // console.log("Bal response");
        // console.log(response);
        callback(response);
    })
}

exports.failedSeedPushToSis = function (data, callback) {
    mongo.insertDocument(data, "failedPushToSIS", function (response) {
        callback(response)
    })
}


// exports.getNotUpdated = function (callback) {
//     var aggregate = [
//         {
//             '$match': {
//                 'CompleteLot': {
//                     '$exists': true
//                 }
//             }
//         }, {
//             '$project': {
//                 'CompleteLot': 1,
//                 'testing_Date': {
//                     '$dateFromString': {
//                         'dateString': '$testing_Date'
//                     }
//                 },
//                 '_id': 0
//             }
//         }
//         ,
//         { $limit: 10 }
//     ]
//     mongo.queryWithAggregator(aggregate, 'notCertifiedLots', function (response) {
//         callback(response)
//     })
// }

// exports.updateCertifyFailed = function (data, callback) {
//     mongo.updateOne({ 'CompleteLot': data }, { falied: true }, 'notCertifiedLots', function (response) {

//     })
// }