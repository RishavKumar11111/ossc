
// Added new field in all docs in a collection
db.osscRawData.update({ lot_Number: { $exists: true } }, { $set: { cert_Status: "Pending" } }, false, true)
db.osscRawData.update({ info: { $exists: false } }, { $set: { info: "imsPushedData", pushedDateToBs: new Date() } }, false, true)
db.sisSaleDataOn18thDommy.update({ lot_Number: { $exists: true } }, { $set: { specialInfo: 'sisSaleDataOn18th' } }, false, true)

// Remove a field 
db.osscRawData.update({ Updated: { $exists: true } }, { $unset: { Updated: 1 } }, false, true)
db.seedData.update({ testing_Date: { $exists: true } }, { $unset: { testing_Date: 1 } }, false, true)


// Updated a field in all docs in a collection
db.osscRawData.aggregate([{ $match: { receiver_ID: { $exists: true } } },
{ $project: { receiver_ID: 1 } }]).forEach(function (a) {
    db.osscRawData.update({ _id: a._id }, { $set: { receiver_ID: '0' + a.receiver_ID } }, false, true)
})

db.seedData.aggregate([{ $match: { cropName: { $exists: true }, cropName: 'PaddyDhan', info: 'imsPushedData' } },
{ $project: { source_ID: 1 } }]).forEach(function (a) {
    db.seedData.update({ _id: a._id }, { $set: { CropCatg_ID: '01' } }, false, true)
})



db.seedData.aggregate([{ $match: { receiver_ID: { $exists: true }, receiver_ID: '0268' } },
{ $project: { date_sale: 1 } }]).forEach(function (a) {
    print(a.date_sale)
    db.seedData.update({ _id: a._id }, { $set: { transitStatus: 'Received' } }, false, true)

})


// Changing date string to date format
db.seedData.aggregate([{ $match: { info:'imsPushedData',date_Intake:{$type:'string'}} },
{ $project: { testing_Date: { $dateFromString: { 'dateString': "$testing_Date" } } } }]).forEach(function (b) {
    db.testingDateWithCertLot6.update({ _id: b._id }, { $set: { testing_Date: b.testing_Date } }, false, true)
})



db.sisSaleTotalData.aggregate([{ $match: { sellDataPushDate: { $exists: true } } }]).forEach(function (b) {
    let dateString = b.sellDataPushDate;
    d = dateString.split("/");
    x = d[1] + "/" + d[0] + "/" + d[2];
    let dateSale = new Date(x);
    db.sisSaleTotalData.update({ _id: b._id }, { $set: { sellDataPushDate: dateSale } }, false, true)
})

db.seedData.aggregate([{ $match: { sellData: { $exists: true }, challan_Date: { $exists: true }, sellData: true, challan_Date: { $type: ['string'] } } }]).forEach(function (b) {
    let dateString = b.challan_Date;
    d = dateString.split("/");
    x = d[1] + "/" + d[0] + "/" + d[2];
    let dateSale = new Date(x);
    db.seedData.update({ _id: b._id }, { $set: { challan_Date: dateSale } }, false, true)
})







// Set source and destination godowns
db.sisAgencyPushData.aggregate([{ $match: { receiver_ID: { $exists: true } } }]).forEach(function (a) {
    print(a.receiver_ID)
    db.godownMaster.aggregate([{ $match: { 'all_Godowns.godown_ID': a.receiver_ID } },
    { $unwind: '$all_Godowns' },
    { $match: { 'all_Godowns.godown_ID': a.receiver_ID } }
    ]).forEach(function (b) {
        print(b.districtName)
        db.sisAgencyPushData.update({ _id: a._id },
            {
                $set: {
                    destinDist: b.districtName, destinDistCode: b.districtCode,
                    destinGodownName: b.all_Godowns.godown_Name, sourceGodownName: b.all_Godowns.godown_Name,
                    sourceDist: b.districtName, sourceDistCode: b.districtCode,
                }
            }, false, true)
    })

})

var y = 0
db.seedData.aggregate([{ $match: { lot_Number: { $exists: true },lot_Number:'OCT/20-18-221-01G58794-1', receiver_ID: '0275',source_ID:'opening balance'} }]).forEach(function (a) {
    print(a.lot_Number)
    db.godownMaster.aggregate([{ $match: { 'all_Godowns.godown_ID': a.receiver_ID } },
    { $unwind: '$all_Godowns' },
    { $match: { 'all_Godowns.godown_ID': a.receiver_ID } }
    ]).forEach(function (b) {
        print(b.districtName)
        y++
        print(y)
        db.seedData.update({ _id: a._id },
            {
                $set: {
                    destinDist: b.districtName, destinDistCode: b.districtCode,
                    destinGodownName: b.all_Godowns.godown_Name, sourceGodownName: b.all_Godowns.godown_Name,
                    sourceDist: b.districtName, sourceDistCode: b.districtCode,
                }
            }, false, true)
    })

})








// Converting String type to integer type for all data
db.sisSaleDataOn18thDommy.find({ lot_Number: { $exists: true } }).forEach(function (obj) {
    print(obj.lot_Number)
    obj.no_of_Bag = new NumberInt(obj.no_of_Bag)
    obj.qty_Per_Bag_Kg = new NumberInt(obj.qty_Per_Bag_Kg);
    db.sisSaleDataOn18thDommy.save(obj)
});




// getting crop name using crop code
db.sisSaleDataOn18.aggregate([{ $match: { cropName: { $exists: false } } }]).forEach(function (a) {
    print(a.crop)
    db.cropMaster.aggregate([{ $match: { 'Crop_Code': a.crop } }
    ]).forEach(function (b) {
        print(b.Crop_Name, a._id)
        db.sisSaleDataOn18.update({ _id: a._id }, { $set: { cropName: b.Crop_Name } }, false, true)
    })

})






// Update a field fetching from another collection
db.testingDateWithCertLot.aggregate([{ $match: { CompleteLot: { $exists: true } } }]).forEach(function (a) {
    print(a.testing_Date)
    db.seedData.aggregate([{ $match: { 'lot_Number': a.CompleteLot, cert_Status: "Pass" } }
    ]).forEach(function (b) {
        print(b._id)
        db.seedData.update({ _id: b._id }, { $set: { testing_Date: a.testing_Date } }, false, true)
    })

})

db.testingDateWithCertLot5.aggregate([{ $match: { CompleteLot: { $exists: true } } }]).forEach(function (a) {
    print(a.testing_Date)
    db.seedData.aggregate([{ $match: { 'lot_Number': a.CompleteLot } }
    ]).forEach(function (b) {
        print(b._id)
        db.seedData.update({ _id: b._id }, { $set: { testing_Date: a.testing_Date, cert_Status: 'Pass' } }, false, true)
    })
})

db.sisSaleDataOn18.aggregate([{ $match: { challan_Number: { $exists: true } } }]).forEach(function (a) {

    db.sisSaleDataOn18.update({ _id: a._id }, { $set: { instrumentNo: a.challan_Number } }, false, true)
})

db.sisSaleTotalData.aggregate([{ $match: { date_sale: { $exists: true } } }]).forEach(function (a) {

    db.sisSaleTotalData.update({ _id: a._id }, { $set: { date_Intake: a.date_sale } }, false, true)
})

var x = 0
db.seedData.aggregate([{ $match: { receiver_ID: { $exists: true }, receiver_ID: '0268' } }]).forEach(function (a) {
    x++
    print(x)
    db.seedData.update({ _id: a._id }, { $set: { CropCatg_ID: '01' } }, false, true)
})








// getting variety name using variety code
db.sisSaleDataOn18.aggregate([{ $match: { varietyName: { $exists: false } } }]).forEach(function (a) {
    print(a.variety)
    db.varietyMaster.aggregate([{ $match: { 'Variety_Code': a.variety } }
    ]).forEach(function (b) {
        print(b.Variety_Name, a._id)
        db.sisSaleDataOn18.update({ _id: a._id }, { $set: { varietyName: b.Variety_Name } }, false, true)
    })

})

db.sisSaleTotalData.aggregate([{ $match: { varietyName: { $exists: false } } }]).forEach(function (a) {
    print(a.variety)
    db.varietyMaster.aggregate([{ $match: { 'Variety_Code': a.variety } }
    ]).forEach(function (b) {
        print(b.Variety_Name, a._id)
        db.sisSaleTotalData.update({ _id: a._id }, { $set: { varietyName: b.Variety_Name } }, false, true)
    })

})




// Total received and total dispatched bag size
db.seedData.aggregate([{ $match: { lot_Number: { $exists: true }, info: 'godownTransferByBS' } }]).forEach(function (a) {
    print(a.lot_Number)
    db.seedData.aggregate([{ $match: { lot_Number: a.lot_Number, info: 'imsPushedData' } }
    ]).forEach(function (b) {
        print(b.no_of_Bag)
        print('------------------')
        db.seedData.aggregate([{ $match: { lot_Number: a.lot_Number, info: { $ne: 'imsPushedData' } } }]).forEach(function (c) {
            print(c.no_of_Bag)
        })
        print('===================')
    })

})



// Delete a document
db.seedData.aggregate([{ $match: { lot_Number: { $exists: true }, info: 'sisStockSaleCancelled' } },
{ $project: { lot_Number: 1 } }]).forEach(function (a) {
    print(a.lot_Number)
    db.seedData.deleteOne({ _id: a._id }, false, true)
})


// matching certified status with IMS
var x = 0
db.testingDateWithCertLot6.aggregate([{ $match: { lot_Number: { $exists: true } } }]).forEach(function (a) {
    db.seedData.aggregate([{ $match: { lot_Number: a.lot_Number, cert_Status: 'Pending', info: 'imsPushedData' } }
    ]).forEach(function (b) {
        x = x + 1
        print(x)
        print(b.lot_Number)
        print(b.cert_Status)
        print('=======================')
    })

})

var x = 0
db.seedData.aggregate([{ $match: { lot_Number: { $exists: true }, sellData: true } }]).forEach(function (a) {
    x++
    print(x)
    var y = a.lot_Number.toUpperCase()
    db.seedData.aggregate([{ $match: { lot_Number: { $exists: true }, info: 'imsPushedData', lot_Number: y } }]).forEach(function (b) {
        db.seedData.update({ _id: a._id }, { $set: { lot_Number: y } }, false, true)
        print(b.lot_Number)
    })

})




