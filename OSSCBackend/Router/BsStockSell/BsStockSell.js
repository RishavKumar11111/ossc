var ex = require('express')
var router = ex.Router()
var model = require('../../models/BAL/bsStockSell/bsStockSell')
var request=require('request')

router.get('/getLotAccSPO/:spoId', (req, res) => {
    model.getLotAccSPO(req.params.spoId, function (response) {
        res.send(response)
    })
})

router.get('/getDataAccLot', (req, res) => {
    var data = JSON.parse(req.query.data)
    model.getDataAccLot(data, function (response) {
        if (response.respStatus == 'seedExpired') {
            res.send({ "status": "seedExpired" })
        } else {
            res.send(response)
        }
    })
})

router.post('/finalSubmit', (req, res) => {

    model.finalSubmit(req.body, function (response) {
        if (response.status >0) {
            res.send({ 'status': "success",response:response.dataForSis[0] })
        } else {
            res.send({ 'status': 'Unsuccessful' })
        }
        count2=0
        let sisArray = []
        for (let i = 0; i < response.dataForSis.length; i++) {
            let date = new Date(response.dataForSis[i].date_Sale)

            var dataForSis = {};
            dataForSis.DIST_CODE = response.dataForSis[i].dist_Code
            dataForSis.GODOWN_ID = response.dataForSis[i].source_ID
            dataForSis.TRANSFER_DATE = date
            dataForSis.SALE_TO = response.dataForSis[i].receiver_ID
            dataForSis.SEASSION = response.dataForSis[i].season
            dataForSis.FIN_YR = response.dataForSis[i].year
            dataForSis.USERID = response.dataForSis[i].UserID
            dataForSis.USERIP = response.dataForSis[i].UserIP
            dataForSis.CATEGORY_ID = response.dataForSis[i].CropCatg_ID
            dataForSis.CROP_ID = response.dataForSis[i].crop
            dataForSis.CROP_CLASS = response.dataForSis[i].class
            dataForSis.VARIETY_ID = response.dataForSis[i].variety
            dataForSis.LOT_NO = response.dataForSis[i].lot_Number
            dataForSis.BAG_SIZE = response.dataForSis[i].qty_Per_Bag_Kg
            dataForSis.NO_OF_BAGS = response.dataForSis[i].no_of_Bag
            dataForSis.QUANTITY = 1
            dataForSis.CASH_MEMO_NO = response.dataForSis[i].ref_No
            dataForSis.APIKEY = 'key12146'

            count2++
            if (response.status > 0 && response.dataForSis[i].class != 'Foundation' && response.dataForSis[i].cert_Status == 'Pass') {
                sisArray.push(dataForSis)
            }
            if (count2 == response.dataForSis.length && sisArray.length > 0) {
                bsSoldSeedDataForSis(sisArray);
                // console.log(55, sisArray);
            }
        }

    })
})


function bsSoldSeedDataForSis(data) {
    var headers = {
        "Content-Type": "application/json"
    }
    var options = {
        url: "http://mkuy.apicol.nic.in/api/Stock/AddGodwns",
        method: "POST",
        headers: headers,
        json: true,
        body: data
    }
    request(options, function (err, res, body) {
        console.log('error print',err);
        if (err || res.statusCode != 200) {
            for (let i = 0; i < data.length; i++) {
                data[i].failed_Push_Date = new Date();
                data[i].err = 'bsSalePushToSis'
            }
            model.failedSeedPushToSis(data, function (response) {

            })
        }
        console.log(data[0].LOT_NO, 'bs Sale To Sis')
        console.log(res.body);
        //console.log("godownTrnsSisResp", body);

    })
}

// router.get('/getAvailableBags',(req,res)=>{
//     var data=JSON.parse(req.query.data)
//     model.getAvailableBags(data,function(response){
//         res.send(response)
//     })
// })


module.exports = router