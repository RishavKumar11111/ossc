var mongo = require('../../mongo/mongo');
var newMongo = require('../../mongo/newMongo')

exports.transitData = function (data, callback) {
  mongo.queryFindAll({ 'sourceSPO': data, 'transitStatus': 'In Transit' }, 'seedData', function (respon) {
    if (respon.length != 0) {
      callback(respon)
    } else {
      respon = 'No Data'
      callback(respon);
    }
  })
}

// exports.transitData = async (data) => {
//   return new Promise(async (resolve, reject) => {
//     try {
//       var connect=await mongo.mongoConnection.toString
//       mongo.queryFindAll({ 'sourceSPO': data, 'transitStatus': 'In Transit' }, 'seedData', function (respon) {
//         if (respon.length != 0) {
//           callback(respon)
//         } else {
//           respon = 'No Data'
//           callback(respon);
//         }
//       })
//     }catch(e){
//       reject({error:e.message})
//     }

//   })

// }

// exports.transitDataForReceive = function (data, callback) {
//   var aggri = [
//     {
//       '$match': {
//         'all_Spo.spoCd': data
//       }
//     }
//   ]
//   mongo.queryWithAggregator(aggri, 'spoMaster', function (response) {
//     try {
//       var spoCdArray = []
//       response[0].all_Spo.forEach(element => {
//         spoCdArray.push(element.spoCd)
//       });
//       if (response[0].all_Spo.length == spoCdArray.length) {
//         var aggrigator = [
//           {
//             '$match': {
//               '$and': [
//                 {
//                   'spoToReceive.all_Spo.spoCd': data
//                 }, {
//                   'transitStatus': 'In Transit'
//                 }
//               ]
//             }
//           }
//         ]
//         mongo.queryWithAggregator(aggrigator, 'seedData', function (responsee) {
//           if (responsee.length != 0) {
//             callback(responsee);
//           } else {
//             responsee = 'No Data'
//             callback(responsee);
//           }
//         })
//       }

//     } catch (e) {

//     }
//   })

//   // mongo.queryFindAll({ 'spoToReceive': data, 'transitStatus': 'In Transit' }, 'seedData', function (response) {

//   //     if(response.length != 0){
//   //         callback(response);
//   //     } else {
//   //         response = 'No Data'
//   //         callback(response);
//   //     }

//   // })
// }

exports.transitDataForReceive = async (data, callback) => {
  try {
    var aggri = [
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
    let db = await newMongo.mongoConnection()
    let response = await newMongo.queryWithAggregator(aggri, 'spoMaster', db)
    var aggri2 = [
      {
        '$match': {
          'spoCode': response[0].spo_Code,
          districtName: response[0].all_Spo.dist
        }
      }, {
        '$group': {
          '_id': null,
          'dists': {
            '$push': '$districtCode'
          }
        }
      }
    ]
    let response1 = await newMongo.queryWithAggregator(aggri2, 'godownMaster', db)
    let response2 = await newMongo.queryFindAll({ destinDistCode: { $in: response1[0].dists }, info: 'godownTransferByBS', transitStatus: 'In Transit' }, 'seedData', db)
    if (response2.length != 0) {
      callback(response2);
      newMongo.mongoClose(db)
    } else {
      response2 = 'No Data'
      callback(response2);
      newMongo.mongoClose(db)

    }
  } catch (e) {

  }
}


exports.deficitDataFetch = function (data, callback) {
  var aggri = [
    {
      '$match': {
        'all_Spo.spoCd': data
      }
    }
  ]
  mongo.queryWithAggregator(aggri, 'spoMaster', function (response) {
    try {
      var spoCdArray = []
      // response[0].all_Spo.forEach(element => {
      spoCdArray.push(data)
      // });
      // if (response[0].all_Spo.length == spoCdArray.length) {
      var aggrigator = [
        {
          '$match': {
            '$or': [
              {
                'spoToReceive.all_Spo.spoCd': {
                  '$in': spoCdArray
                }
              }, {
                'sourceSPO': {
                  '$in': spoCdArray
                }
              }, {
                'transitStatus': 'deficit'
              }
            ],
            'deficit': true
          }
        }
      ]
      mongo.queryWithAggregator(aggrigator, 'seedData', function (responsee) {
        if (responsee.length != 0) {
          callback(responsee);
        } else {
          responsee = 'No Data'
          callback(responsee);
        }
      })
      // }

    } catch (e) {

    }
  })

  // mongo.queryFindAll({ 'spoToReceive': data, 'transitStatus': 'In Transit' }, 'seedData', function (response) {

  //     if(response.length != 0){
  //         callback(response);
  //     } else {
  //         response = 'No Data'
  //         callback(response);
  //     }

  // })
}

exports.updateTransitStatus = async (data, callback) => {
  try {
    data.bagsToBeReceived = parseInt(data.bagsToBeReceived)
    let db = await newMongo.mongoConnection()
    let response1 = await newMongo.findOne('seedData', { 'lot_Number': data.lot_No, 'receiver_ID': data.receiverId, 'transitStatus': data.status, 'ref_No': data.ref_No }, db)

    if (response1.no_of_Bag == data.bagsToBeReceived) {
      let response2 = await newMongo.updateOne({ 'lot_Number': data.lot_No, 'receiver_ID': data.receiverId, 'transitStatus': data.status, 'ref_No': data.ref_No }, { 'transitStatus': 'Received', 'date_Intake': new Date(), 'remark': data.remark }, 'seedData', db)
      callback({ status: response2.modifiedCount, dbData: response1 })
      db.close()
    }

    if (!data.bagsToBeReceived) {
      let response5 = await newMongo.updateOne({ 'lot_Number': data.lot_No, 'receiver_ID': data.receiverId, 'transitStatus': data.status, 'ref_No': data.ref_No }, { 'transitStatus': 'Received', 'date_Intake': new Date(), 'remark': data.remark }, 'seedData', db)
      callback({ status: response5.modifiedCount, dbData: response1 })
      db.close()
    }
    var responseForSis
    if (data.bagsToBeReceived < response1.no_of_Bag) {
      let deficitAmount = response1.no_of_Bag - data.bagsToBeReceived

      responseForSis = response1


      let response3 = await newMongo.updateOne({ 'lot_Number': data.lot_No, 'receiver_ID': data.receiverId, 'transitStatus': data.status, 'ref_No': data.ref_No }, { 'transitStatus': 'Received', 'date_Intake': new Date(), 'remark': data.remark, 'no_of_Bag': data.bagsToBeReceived }, 'seedData', db)
      if (response3.modifiedCount == 1) {
        response1.no_of_Bag = deficitAmount
        response1.deficit = true
        response1.transitStatus = 'deficit'
        response1.deficitDate = new Date();
        delete response1['_id']
        let response8 = await newMongo.insertDocument(response1, 'seedData', db)
        responseForSis.no_of_Bag = data.bagsToBeReceived
        callback({ status: response3.modifiedCount, dbData: responseForSis })

        db.close()
      } else {
        db.close()
      }
    }

  } catch (e) {

  }
}


// exports.updateTransitStatus = function (data, callback) {
//   data.bagsToBeReceived = parseInt(data.bagsToBeReceived)
//   mongo.findOne('seedData', { 'lot_Number': data.lot_No, 'receiver_ID': data.receiverId, 'transitStatus': data.status, 'ref_No': data.ref_No }, function (response1) {

//     if (response1.no_of_Bag == data.bagsToBeReceived) {

//       mongo.updateOne({ 'lot_Number': data.lot_No, 'receiver_ID': data.receiverId, 'transitStatus': data.status, 'ref_No': data.ref_No }, { 'transitStatus': 'Received', 'date_Intake': new Date(), 'remark': data.remark }, 'seedData', function (response2) {
//         callback({ status: response2.modifiedCount, dbData: response1 })
//       })

//     } else if (!data.bagsToBeReceived) {

//       mongo.updateOne({ 'lot_Number': data.lot_No, 'receiver_ID': data.receiverId, 'transitStatus': data.status, 'ref_No': data.ref_No }, { 'transitStatus': 'Received', 'date_Intake': new Date(), 'remark': data.remark }, 'seedData', function (response5) {
//         callback({ status: response5.modifiedCount, dbData: response1 })
//       })

//     }
//     else {
//       callback({ status: 0, dbData: response1 })
//     }

// Remove upper else block while enabling lower else block

//  else {

//   let rcvAmount = response1.no_of_Bag - data.bagsToBeReceived
//   mongo.updateOne({ 'lot_Number': data.lot_No, 'receiver_ID': data.receiverId, 'transitStatus': data.status, 'ref_No': data.ref_No }, { 'transitStatus': 'Received', 'date_Intake': new Date(), 'remark': data.remark, 'no_of_Bag': data.bagsToBeReceived }, 'seedData', function (response3) {
//     if (response3.modifiedCount == 1) {
//       response1.no_of_Bag = rcvAmount
//       response1.deficit = true
//       response1.transitStatus = 'deficit'
//       delete response1['_id']
//       mongo.insertDocument(response1, 'seedData', function (response4) {
//         callback({status:response4.modifiedCount,dbData:response1})
//       })
//     }
//   })
// }
//   })

// }

exports.failedSeedPushToSis = function (data, callback) {
  mongo.insertManyDocuments(data, "failedPushToSIS", function (response) {
    callback(response)
  })
}