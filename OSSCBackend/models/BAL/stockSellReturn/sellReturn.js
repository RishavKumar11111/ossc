
var mongo = require('../../mongo/mongo')

// ==================================sale return===================================================

exports.sellReturnData = function (data, callback) {
    let instrumentNo = data.instrumentNo.toLowerCase()
    // console.log(11,data.instrumentNo);
    try {
        mongo.findOne('seedData', { pr_Number: data.instrumentNo, sellData: true }, function (response) {
            // console.log(response);
            if (!response) {
                mongo.findOne('seedData', { challan_Number: data.instrumentNo, sellData: true }, function (respon) {
                    if (!respon) {
                        callback({ noData: true })
                    } else {
                        mongo.findOne('godownMaster', { 'all_Godowns.godown_ID': respon.source_ID }, function (rsp) {
                            //  console.log(rsp);
                            if (rsp) {
                                let aggregation = [
                                    { $match: { spo_Code: rsp.spoCode } },
                                    // {$unwind:"$all_Spo"},
                                    // {$match:{"all_Spo.spoCd":data.spoId}},
                                ]
                                mongo.queryWithAggregator(aggregation, "spoMaster", function (ress) {
                                    if (ress.length > 0) {
                                        var count = 0;
                                        let x
                                        ress[0].all_Spo.forEach(e => {
                                            count = count + 1;
                                            if (e.spoCd == data.spoId) {
                                                x = true
                                            } else {
                                                if (ress[0].all_Spo.length == count) {
                                                    if (x != true) {
                                                        callback({ referSPO: ress })
                                                    }
                                                }

                                            }

                                        })
                                        if (x == true) {
                                            callback(respon)
                                        }
                                    }
                                })
                            } else {
                                callback({ noData: true })
                            }

                        })
                    }
                })
            } else {
                // console.log(response);
                mongo.queryFindAll({ lot_Number: response.lot_Number, info: 'saleReturn', receiver_ID: response.source_ID, source_ID: response.receiver_ID }, 'seedData', function (response2) {
                    if (response2) {
                        // let totalReturned = 0
                        // let count = 0
                        // response2.forEach(e => {
                        //     totalReturned = totalReturned + e.no_of_Bag
                        //     count++
                        // if (response2.length == count) {
                        // response.no_of_Bag = response.no_of_Bag - totalReturned
                        mongo.findOne('godownMaster', { 'all_Godowns.godown_ID': response.source_ID }, function (rsp) {
                            try {
                                // console.log(rsp);
                                if (rsp) {
                                    let aggregation = [
                                        { $match: { spo_Code: rsp.spoCode } },
                                        // {$unwind:"$all_Spo"},
                                        // {$match:{"all_Spo.spoCd":data.spoId}},
                                    ]
                                    mongo.queryWithAggregator(aggregation, "spoMaster", function (ress) {
                                        var count = 0;
                                        let x
                                        ress[0].all_Spo.forEach(e => {
                                            count = count + 1;
                                            if (e.spoCd == data.spoId) {
                                                x = true
                                            } else {
                                                if (ress[0].all_Spo.length == count) {
                                                    if (x != true) {
                                                        callback({ referSPO: ress })
                                                    }
                                                }

                                            }

                                        })
                                        if (x == true) {
                                            try {
                                                callback(response)
                                            } catch (e) {

                                            }
                                        }
                                    })
                                } else {
                                    callback({ noData: true })
                                }

                            } catch (e) {

                            }

                        })
                        // }
                        // })
                    }
                })

            }
        })
    } catch (e) {
        callback(500)
    }
}

exports.sellReturnSubmit = function (data, callback) {
    try {
        // console.log(data);
        let dataForReplace = data.source_ID
        data.source_ID = data.receiver_ID
        data.receiver_ID = dataForReplace

        data.no_of_Bag = data.returnedQuan

        let today = new Date(data.date_Intake);
        var dd = today.getDate();
        var mm = today.getMonth() + 1;
        var yyyy = today.getFullYear();
        if (dd < 10) { dd = '0' + dd } if (mm < 10) { mm = '0' + mm };
        data.date_Intake = dd + '-' + mm + '-' + yyyy;

        data.destinDist = data.sourceDist
        data.destinDistCode = data.sourceDistCode
        data.destinGodownName = data.sourceGodownName

        let x = data.SourceType
        data.SourceType = data.receiverType
        data.receiverType = x

        data.saleReturn = true
        data.transitStatus = 'Received'
        data.sellStockReturnDate = new Date()
        data.info = 'saleReturn'
        data.instrumentNo = data.pr_Number || data.challan_Number

        delete data['sellData'];
        delete data['returnedQuan'];
        delete data['_id'];
        delete data['sellDataPushDate'];
        // console.log(data);
        mongo.insertDocument(data, 'seedData', function (response) {
            callback(response)
        })

    } catch (e) {
        callback(500)
    }
}


exports.getSaleReturnData = function (data, callback) {
    // console.log(5555555,data);
    mongo.queryFindAll({ 'pr_Number': data, 'saleReturn': true, transitStatus: { $ne: 'Deleted' } }, 'seedData', function (response) {
        if (!response) {
            mongo.queryFindAll({ 'challan_Number': data, 'purchaseReturn': true, transitStatus: { $ne: 'Deleted' } }, 'seedData', function (respons) {
                if (respons) {
                    callback(respons)
                }
            })
        } else {
            // console.log(response);
            callback(response)
        }
    })
}



// ===================================Purchase Return=============================================

exports.purchaseReturnData = function (data, callback) {
    try {
        mongo.findOne('seedData', { pr_Number: data.instrumentNo, info: 'SisAgencyPush', transitStatus: { $ne: 'Deleted' } }, function (response) {
            if (!response) {
                mongo.findOne('seedData', { challan_Number: data.instrumentNo, info: 'SisAgencyPush', transitStatus: { $ne: 'Deleted' } }, function (respon) {
                    if (!respon) {
                        callback({ noData: true })
                    } else {
                        mongo.findOne('godownMaster', { 'all_Godowns.godown_ID': respon.receiver_ID }, function (rsp) {
                            if (rsp) {
                                // console.log(rsp);
                                let aggregation = [
                                    { $match: { spo_Code: rsp.spoCode } },
                                    // {$unwind:"$all_Spo"},
                                    // {$match:{"all_Spo.spoCd":data.spoId}},
                                ]
                                mongo.queryWithAggregator(aggregation, "spoMaster", function (ress) {
                                    if (ress.length > 0) {
                                        var count = 0;
                                        let x
                                        ress[0].all_Spo.forEach(e => {
                                            count = count + 1;
                                            if (e.spoCd == data.spoId) {
                                                x = true
                                            } else {
                                                if (ress[0].all_Spo.length == count) {
                                                    if (x != true) {
                                                        callback({ referSPO: ress })
                                                    }
                                                }

                                            }

                                        })
                                        if (x == true) {
                                            callback(respon)
                                        }
                                    }
                                })
                            } else {
                                callback({ noData: true })
                            }
                        })
                    }
                })
            } else {
                mongo.findOne('godownMaster', { 'all_Godowns.godown_ID': response.receiver_ID }, function (rsp) {
                    // console.log(rsp);
                    try {
                        if (rsp) {
                            let aggregation = [
                                { $match: { spo_Code: rsp.spoCode } },
                                // {$unwind:"$all_Spo"},
                                // {$match:{"all_Spo.spoCd":data.spoId}},
                            ]
                            mongo.queryWithAggregator(aggregation, "spoMaster", function (ress) {
                                // console.log(12,ress);
                                if (ress) {
                                    // console.log(ress);
                                    let x = false
                                    let count = 0
                                    ress[0].all_Spo.forEach(e => {
                                        // console.log(e);
                                        count = count + 1;
                                        if (e.spoCd == data.spoId) {

                                            x = true

                                        } else {
                                            if (ress[0].all_Spo.length == count) {
                                                if (x != true) {
                                                    callback({ referSPO: ress })
                                                }
                                            }

                                        }
                                        if (x == true && ress[0].all_Spo.length == count) {
                                            callback(response)
                                        }

                                    })

                                } else {
                                    callback({ noData: true })
                                }
                            })
                        }

                    } catch (e) {

                    }

                })
            }
        })
    } catch (e) {
        callback(500)
    }
}


exports.purchaseReturnSubmit = function (data, callback) {
    try {
        let dataForReplace = data.source_ID
        data.source_ID = data.receiver_ID
        data.receiver_ID = dataForReplace

        data.no_of_Bag = data.returnedQuan

        let today = new Date(data.date_return);
        var dd = today.getDate();
        var mm = today.getMonth() + 1;
        var yyyy = today.getFullYear();
        if (dd < 10) { dd = '0' + dd } if (mm < 10) { mm = '0' + mm };
        data.date_return = dd + '-' + mm + '-' + yyyy;

        data.sourceDist = data.destinDist
        data.sourceDistCode = data.destinDistCode
        data.sourceGodownName = data.destinGodownName

        let x = data.SourceType
        data.SourceType = data.receiverType
        data.receiverType = x

        data.purchaseReturn = true
        data.transitStatus = 'Received'
        data.purchaseStockReturnDate = new Date()
        data.info = 'purchaseReturn'
        data.instrumentNo = data.pr_Number || data.challan_Number

        // delete data['sellData'];
        // delete data['info'];
        delete data['_id'];


        mongo.insertDocument(data, 'seedData', function (response) {
            callback(response)
        })

    } catch (e) {
        callback(500)
    }
}


exports.getPurchaseReturnData = function (data, callback) {
    mongo.queryFindAll({ 'pr_Number': data, 'purchaseReturn': true, transitStatus: { $ne: 'Deleted' } }, 'seedData', function (response) {
        if (!response) {
            mongo.queryFindAll({ 'challan_Number': data, 'purchaseReturn': true, transitStatus: { $ne: 'Deleted' } }, 'seedData', function (respons) {
                if (respons) {
                    callback(respons)
                }
            })
        } else {
            callback(response)
        }
    })
}

