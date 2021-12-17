var ex = require('express');
var router = ex.Router();
var model = require('../../models/BAL/spoStockTransfer/stockTransfer');
const request = require('request');
// const schedule = require('node-schedule')


router.get('/getAllDist/:spoCode', function (req, res) {
    var data = req.params.spoCode
    model.getAllDistricts(data, function (response) {
        res.send(response);
    })
})


router.get('/getAllGodown/:distSelected', function (req, res) {
    var data = req.params.distSelected;
    model.getAllGodowns(data, function (response) {
        res.send(response);
    })
})

router.get('/loadCrop/:godownId', function (req, res) {
    var data = req.params.godownId;
    model.loadCrop(data, function (response) {
        res.send(response);
    })
})

router.get('/loadVariety/:godownIdForVarietyLoad/:cropcode', function (req, res) {
    // var data = req.params.cropcode;
    let data = {}
    data.cropCode = req.params.cropcode
    data.godownId = req.params.godownIdForVarietyLoad
    model.loadVariety(data, function (response) {
        res.send(response);
    })
})

router.get('/getAllLot/:godownId/:cropCode/:varietyCode', function (req, res) {
    var data = {
        godownId: req.params.godownId,
        crop: req.params.cropCode,
        variety: req.params.varietyCode
    }
    model.getAllLot(data, function (response) {
        res.send(response);
    })
})

router.get('/getAllSPOs', function (req, res) {
    model.getAllSPOs(function (response) {
        res.send(response);
    })
})

router.get('/getAllSpoByIntra/:spoCode', function (req, res) {
    var spoCode = req.params.spoCode
    model.getAllSpoByIntra(spoCode, function (response) {
        res.send(response)
    })
})

router.get('/getAllSpoByInter/:spoCode', function (req, res) {
    var spoCode = req.params.spoCode
    model.getAllSpoByInter(spoCode, function (response) {
        res.send(response)
    })
})

router.get('/getToSPOId/:dist', function (req, res) {
    var data = req.params.dist
    model.getToSPOId(data, function (response) {
        res.send(response)
    })
})

router.get('/getAllToGowns/:dist', function (req, res) {
    var data = req.params.dist;
    model.getAllToGowns(data, function (response) {
        res.send(response);
    })
})

router.post('/loadMaxBagNo', function (req, res) {
    var data = req.body;
    model.loadMaxBagNo(data, function (response) {
        res.send(response)
    })
})
// console.log(new Date('05-13-2021'));
router.post('/stockTransData', function (req, res) {
    var data = req.body;
    model.stockTransData(data, function (response) {

        res.status(200).json({ "status": response[0].respStatus, "dataForPrint": response })


        let count = 0
        let count1 = 0
        let count2 = 0
        let sisArray = []
        for (let i = 0; i < response.length; i++) {
            let date = new Date(response[i].stockTrnsDate)

            var mm = date.getMonth() + 1;
            var dd = date.getDate();
            var yyyy = date.getFullYear();
            if (dd < 10) {
                dd = '0' + dd;
            }
            if (mm < 10) {
                mm = '0' + mm;
            }
            var today = yyyy + '-' + mm + '-' + dd;
            var dataForSis = {};
            dataForSis.DIST_CODE = response[i].dist_Code
            dataForSis.GODOWN_ID = response[i].source_ID
            dataForSis.TRANSFER_DATE = date
            dataForSis.SALE_TO = response[i].receiver_ID
            dataForSis.SEASSION = response[i].season
            dataForSis.FIN_YR = response[i].year
            dataForSis.USERID = response[i].UserID
            dataForSis.USERIP = response[i].UserIP
            dataForSis.CATEGORY_ID = response[i].CropCatg_ID
            dataForSis.CROP_ID = response[i].crop
            dataForSis.CROP_CLASS = response[i].class
            dataForSis.VARIETY_ID = response[i].variety
            dataForSis.LOT_NO = response[i].lot_Number
            dataForSis.BAG_SIZE = response[i].qty_Per_Bag_Kg
            dataForSis.NO_OF_BAGS = response[i].no_of_Bag
            dataForSis.QUANTITY = 1
            dataForSis.CASH_MEMO_NO = response[i].ref_No
            dataForSis.APIKEY = 'key12145'

            count2++
            if (response[0].respStatus > 0 && response[0].respStatus != 'seedExpired' && response[i].class != 'Foundation' && response[i].cert_Status == 'Pass') {
                sisArray.push(dataForSis)

            }
            if (count2 == response.length && sisArray.length > 0) {
                transferredSeedForSis(sisArray);
                // console.log(55, sisArray);
            }


            // if (response[i].respStatus == 'seedExpired') {
            //     count++
            //     if (response.length == count) {
            //         res.status(200).json({ "status": "seedExpired" })
            //     }
            // } else {
            // count1++
            // if (response.length == count1) {
            //     res.status(200).json({ "status": response[0].respStatus, "dataForPrint": response })
            // }
            // }
        }
        // let date = new Date(response.stockTrnsDate)

        // var mm = date.getMonth() + 1;
        // var dd = date.getDate();
        // var yyyy = date.getFullYear();
        // if (dd < 10) {
        //     dd = '0' + dd;
        // }
        // if (mm < 10) {
        //     mm = '0' + mm;
        // }
        // var today = yyyy + '-' + mm + '-' + dd;
        // var dataForSis = {};
        // dataForSis.DIST_CODE = response.dist_Code
        // dataForSis.GODOWN_ID = response.source_ID
        // dataForSis.TRANSFER_DATE = date
        // dataForSis.SALE_TO = response.receiver_ID
        // dataForSis.SEASSION = response.season
        // dataForSis.FIN_YR = response.year
        // dataForSis.USERID = response.UserID
        // dataForSis.USERIP = response.UserIP
        // dataForSis.CATEGORY_ID = response.CropCatg_ID
        // dataForSis.CROP_ID = response.crop
        // dataForSis.CROP_CLASS = response.class
        // dataForSis.VARIETY_ID = response.variety
        // dataForSis.LOT_NO = response.lot_Number
        // dataForSis.BAG_SIZE = response.qty_Per_Bag_Kg
        // dataForSis.NO_OF_BAGS = response.no_of_Bag
        // dataForSis.QUANTITY = 1
        // dataForSis.CASH_MEMO_NO = response.ref_No
        // dataForSis.APIKEY = 'key12145'
        // console.log('TrnsResp', response.respStatus)
        // if (response.respStatus == 1 && response.respStatus != 'seedExpired') {
        //     console.log('coming to Transfer section')
        //     // transferredSeedForSis(dataForSis);
        // }
        // if (response.respStatus == 'seedExpired') {
        //     res.status(200).json({ "status": "seedExpired" })
        // } else {
        //     res.status(200).json({ "status": response.respStatus, "dataForPrint": response })
        // }

    })
})

function transferredSeedForSis(data) {
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
        if (err || res.statusCode != 200) {
            for (let i = 0; i < data.length; i++) {
                data[i].failed_Push_Date = new Date();
                data[i].err = 'stockTransferPushToSis'
            }
            model.failedSeedPushToSis(data, function (response) {

            })
        }
        console.log(data[0].LOT_NO, 'stockTrans')
        console.log(res.body);
        //console.log("godownTrnsSisResp", body);

    })
}

// schedule.scheduleJob('1 * * * *', () => {

// })

router.post('/manualPrint',model.manualPrint)

module.exports = router;