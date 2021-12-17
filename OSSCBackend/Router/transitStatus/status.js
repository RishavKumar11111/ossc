var ex = require('express');
var router = ex.Router();
var model = require('../../models/BAL/transitStatus/trnsstatus');
const request = require('request');


router.get('/transitData/:spoCode', function (req, res) {
    var data = req.params.spoCode;
    model.transitData(data, function (response) {
        if (response == 'No Data') {
            res.status(200).json({ 'message': 'No Data' });
        } else {
            res.send(response);
        }
    })
})

// router.get('/transitData/:spoCode', async (req, res) => {
//     try {
//         var data = req.params.spoCode;
//         let response = await model.transitData(data).toString()
//         if (response == 'No Data') {
//             res.status(200).json({ 'message': 'No Data' });
//         } else {
//             res.send(response);
//         }
//     }catch(e){
//         res.status(400).json({'error':e.message})
//     }


// })



router.get('/transitDataForReceive/:spoCode', function (req, res) {
    var data = req.params.spoCode;
    model.transitDataForReceive(data, function (response) {
        if (response == 'No Data') {
            res.status(200).json({ 'message': 'No Data' });
        } else {
            res.send(response);
        }
    })
})

router.get('/deficitDataFetch/:spoCode', function (req, res) {
    var data = req.params.spoCode;
    model.deficitDataFetch(data, function (response) {
        if (response == 'No Data') {
            res.status(200).json({ 'message': 'No Data' });
        } else {
            res.send(response);
        }
    })
})

router.post('/updateTransitStatus', function (req, res) {
    var data = req.body;
    model.updateTransitStatus(data, function (response) {
        if (response.status == 1 && response.dbData.class != 'Foundation') {
            // var dataForSis = {}
            // dataForSis.lot_No = data.lot_No;
            // dataForSis.status = data.status
            // dataForSis.ref_No = data.ref_No
            // dataForSis.no_of_Bag=data.no_of_Bag
            //updataTransitStatusInSis(dataForSis);

            let date = new Date(response.dbData.stockTrnsDate)

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
            dataForSis.DIST_CODE = response.dbData.dist_Code
            dataForSis.GODOWN_ID = response.dbData.source_ID
            dataForSis.TRANSFER_DATE = response.dbData.stockTrnsDate
            dataForSis.SALE_TO = response.dbData.receiver_ID
            dataForSis.SEASSION = response.dbData.season
            dataForSis.FIN_YR = response.dbData.year
            dataForSis.USERID = response.dbData.UserID
            dataForSis.USERIP = response.dbData.UserIP
            dataForSis.CATEGORY_ID = response.dbData.CropCatg_ID
            dataForSis.CROP_ID = response.dbData.crop
            dataForSis.CROP_CLASS = response.dbData.class
            dataForSis.VARIETY_ID = response.dbData.variety
            dataForSis.LOT_NO = response.dbData.lot_Number
            dataForSis.BAG_SIZE = response.dbData.qty_Per_Bag_Kg
            dataForSis.NO_OF_BAGS = response.dbData.no_of_Bag
            dataForSis.QUANTITY = 1
            dataForSis.CASH_MEMO_NO = response.dbData.ref_No
            dataForSis.APIKEY = 'key12145'

            updataTransitStatusInSis(dataForSis);
            // console.log(dataForSis);

        }
        res.send({ status: response.status });

    })
})

function updataTransitStatusInSis(data) {
    var headers = {
        "Content-Type": "application/json"
    }
    var options = {
        // Api url tobe added below
        // Test http://localhost:3000/transit/testPostData
        url: "http://mkuy.apicol.nic.in/api/Stock/AddGodwn",
        // url: "http://mkuy.apicol.nic.in/api/Stock/AddGowdns",
        method: "POST",
        headers: headers,
        json: true,
        body: data
    }
    request(options, function (err, res, body) {
        if (err) {

            var errCode = err.code;
            var errHostName = err.hostname;
            data.failed_Push_Date = new Date();
            data.errCode = errCode;
            data.Host_Url = errHostName;
            data.err = 'transitStatusUpdateToSis'
            model.failedSeedPushToSis(data, function (response) {

            })
        }
        // console.log(body);
        console.log(res.body);
        console.log('transfer receive', data.LOT_NO);

    })
}

// router.post('/testPostData', function (req, res) {
//     console.log("hiiiiiiiiiiii");
//     var x = new Date();
//     var y = x.getDate() + "-" + (x.getMonth() + 1) + "-" + x.getFullYear();
//     console.log(y);
//     console.log(req.body);

// })


module.exports = router;