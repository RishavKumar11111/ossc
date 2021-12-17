var ex = require("express");
var model = require('../../models/BAL/OSSOPCA/certifiedSeed');
const request = require('request');
var router = ex.Router();
var builder = require('xmlbuilder');
var axios = require('axios')



const approvedSeedDetails = {};
var pushToSIS = false;

/**
 * @swagger
 * 
 * "/certifyLot/": {
 *  "post":{
 *   "description": "Lot certification by OSSOPCA",
 *   "parameters": [
 *      {
 *         "in": "body",
 *         "name": "OSSC",
 *         "required": true,
 *         "description": "Certify",
 *         "schema":{
 *             "type":"object",
 *             "properties":{
 *                 "lot_Number":{
 *                   "type":"string"
 *                    },
 *                 "cert_Status":{
 *                   "type":"string"
 *                    },
 *                 "testing_Date":{
 *                   "type":"string"
 *                    }
 *                  }
 *            }
 *         }
 *       ],
 *   "responses": {
 *     "200": {
 *      "description": "A successful response"
 *       }
 *     }
 *  }
 * }
 */

router.post('/', function (req, res) {
    var data = req.body;
    //console.log(data);
    var ossopcaStatus = {};

    ossopcaStatus.lot_Number = data.lot_Number;
    ossopcaStatus.cert_Status = data.cert_Status;
    ossopcaStatus.testing_Date = new Date(data.testing_Date);//Date is coming in dd/mm/yyyy format

    model.ossopcaSeedStatus(ossopcaStatus, function (response) {
        if (response.modifiedCount == 0) {
            res.status(400).json({ "status": "Data value error" })
            ossopcaStatus.certDate = new Date()
            model.failedToCertByOssopca(ossopcaStatus, function (rsp) {

            })
        } else {
            if (data.cert_Status == "Pass" || data.cert_Status == "pass" || data.cert_Status == "PASS" ||data.cert_Status=='Downgraded') {

                model.approvedSeed(data.lot_Number, function (responseForSIS) {


                    if (typeof (responseForSIS.date_Intake) == 'string') {
                        var date = new Date(responseForSIS.date_Intake)
                    } else {
                        var date = responseForSIS.date_Intake
                    }
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

                    this.approvedSeedDetails = responseForSIS;
                    this.pushToSIS = true;
                    var apiData = {}
                    apiData.Dist_Code = responseForSIS.dist_Code
                    apiData.Godown_ID = responseForSIS.receiver_ID
                    apiData.Challan_No = responseForSIS.pr_Number
                    apiData.Recv_Date = date
                    apiData.FARMER_ID = responseForSIS.source_ID
                    apiData.SEASSION_NAME = responseForSIS.season
                    apiData.FIN_YR = responseForSIS.year.toString()
                    apiData.UserID = responseForSIS.UserID
                    apiData.UserIP = responseForSIS.UserIP
                    apiData.CropCatg_ID = responseForSIS.CropCatg_ID
                    apiData.Crop_ID = responseForSIS.crop
                    apiData.Crop_Verid = responseForSIS.variety
                    apiData.Class = responseForSIS.class
                    apiData.Lot_No = responseForSIS.lot_Number
                    apiData.Bag_Size_In_kg = responseForSIS.qty_Per_Bag_Kg
                    apiData.Recv_No_Of_Bags = responseForSIS.no_of_Bag
                    apiData.Recv_Quantity = 1
                    //new Date(ossopcaStatus.testing_Date)
                    apiData.Testing_Date = ossopcaStatus.testing_Date
                    apiData.APIKEY = 'key01001'
                    //console.log(apiData)


                    if (response.modifiedCount > 0) {
                        if (responseForSIS.class == 'Certified' || responseForSIS.class == 'Certified-II') {
                            certifiedSeedForSis(apiData)
                            // console.log(apiData);
                        }
                    }

                })
            }
            let msg = response.modifiedCount
            res.status(200).json({ "status": msg })
        }


    })
})

function certifiedSeedForSis(dataForSis) {
    var headers = {
        "Content-Type": "application/json"
    }
    //var param = Object.entries(dataForSis).map(e => e.join('=')).join('&');
    var options = {
        // Api url tobe added below
        //url: "https://www.apicol.nic.in/api/Stock/AddSeedGrower" + "?" + param,
        //url:"https://www.apicol.nic.in/api/Stock/AddSeedGrower?Dist_Code=01&Godown_ID=0101&Challan_No=010101&Recv_Date=2020-09-01&FARMER_ID=ken/1234&SEASSION_NAME=Kharif&FIN_YR=2020-21&UserID=ossc.balasore@gmail.com&UserIP=10.10.10.10&CropCatg_ID=01&Crop_ID=C002&Crop_Verid=V0214&Class=Certified&Lot_No=554433&Bag_Size_In_kg=20&Recv_No_Of_Bags=5&Recv_Quantity=1&Testing_Date=2020-07-01&APIKEY=key01001 ",
        //method: "GET"

        url: 'http://mkuy.apicol.nic.in/api/Stock/AddSeed',
        method: "POST",
        headers: headers,
        json: true,
        body: dataForSis
    }
    request(options, function (err, res, body) {
        //console.log(err);
        //console.log(res.statusCode);
        if (err || res.statusCode != 200) {
            dataForSis.failed_Push_Date = new Date();
            dataForSis.err = 'certifiedLotPushToSis'
            model.failedSeedPushToSis(dataForSis, function (response) {

            })
        }
        console.log('certify push ',res.body)
        //console.log(123, dataForSis.Lot_No)
        // console.log(body);

    })
}


module.exports = router