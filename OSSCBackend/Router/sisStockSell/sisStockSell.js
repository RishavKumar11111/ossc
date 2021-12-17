var ex = require('express')
var router = ex.Router()
var model = require('../../models/BAL/sisStockSell/sisStockSell')


router.post('/', (req, res) => {
    var data = req.body
    if (data.APIKEY = 'key01001') {

        let dateString = data.date_sale;
        d = dateString.split("/");
        x = d[1] + "/" + d[0] + "/" + d[2];
        let dateSale = new Date(x);

        let dateString2 = data.ch_Date;
        d2 = dateString2.split("/");
        x2 = d2[1] + "/" + d2[0] + "/" + d2[2];
        let challanDate = new Date(x2);

        let sellData = {}
        sellData.dist_Code = data.dist_Code
        sellData.lot_Number = data.lot_Number;
        sellData.source_ID = data.source_ID;
        sellData.receiver_ID = data.receiver_ID;
        sellData.qty_Per_Bag_Kg = parseInt(data.qty_Per_Bag_Kg);
        sellData.no_of_Bag = parseInt(data.no_of_Bag)
        sellData.date_Intake = dateSale
        sellData.partyName = data.partyName
        sellData.date_sale = dateSale
        sellData.year = data.year
        sellData.season = data.season
        sellData.crop = data.crop
        sellData.cropName = data.cropName
        sellData.variety = data.variety
        sellData.varietyName = data.varietyName
        sellData.class = data.Class
        //sellData.challan_Number = data.challan_Number
        sellData.challan_Number = data.ch_Number
        sellData.instrumentNo = data.ch_Number
        sellData.challan_Date = challanDate
        sellData.CASH_MEMO_NO=data.CASH_MEMO_NO
        sellData.SourceType = data.sourceType;
        sellData.receiverType = data.receiverType;
        sellData.UserID = data.UserID
        sellData.UserIP = data.UserIP
        sellData.CropCatg_ID = data.CropCatg_ID
        sellData.sellDataPushDate = new Date()
        sellData.transitStatus = 'Received'
        sellData.sellData = true
        sellData.info = 'sisStockSale'

        model.insertSellData(sellData, function (response) {
            if (response.insertedCount == 1) {
                res.status(200).send({ "status": "Inserted Successfully" })
            } else {
                res.status(200).send({ "status": "Insertion Unsuccessfull" })

            }
        })
    } else {
        res.status(400).send({ 'status': 'Errored' })
    }
})


router.post('/rejectSisSoldLot', function (req, res) {
    model.rejectSisSoldLot(req.body, function (response) {
        if (response == 1) {
            res.send({ message: "Cancelled Successfully" })
        } else {
            res.send({ message: "Cancel Error" })
        }
    })
})



module.exports = router