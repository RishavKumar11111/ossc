var ex = require('express');
var model = require('../../models/BAL/SisSeedModel/sisSeedModel');
var router = ex.Router();

/**
 * @swagger
 * 
 * "/addStockbySIS/": {
 *  "post":{
 *   "description": "seed details are pushed to BS system from IMS system",
 *   "parameters": [
 *      {
 *         "in": "body",
 *         "name": "OSSC",
 *         "required": true,
 *         "description": "Add Lot",
 *         "schema":{
 *             "type":"object",
 *             "properties":{
 *                 "dist_Code":{
 *                   "type":"string",
 *                   "description":"enter season"
 *                    },
 *                 "lot_Number":{
 *                   "type":"string",
 *                   "description":"enter season"
 *                    },
 *                 "source_ID":{
 *                   "type":"string",
 *                   "description":"enter season"
 *                    },
 *                 "receiver_ID":{
 *                   "type":"string",
 *                   "description":"enter season"
 *                    },
 *                 "qty_Per_Bag_Kg":{
 *                   "type":"integer",
 *                   "description":"enter season"
 *                    },
 *                 "no_of_Bag":{
 *                   "type":"integer",
 *                   "description":"enter season"
 *                    },
 *                 "date_Intake":{
 *                   "type":"string",
 *                   "description":"enter season"
 *                    },
 *                 "year":{
 *                   "type":"string",
 *                   "description":"enter season"
 *                    },
 *                 "season":{
 *                   "type":"string",
 *                   "description":"enter season"
 *                    },
 *                 "crop":{
 *                   "type":"string",
 *                   "description":"enter season"
 *                    },
 *                 "variety":{
 *                   "type":"string",
 *                   "description":"enter season"
 *                    },
 *                 "class":{
 *                   "type":"string",
 *                   "description":"enter season"
 *                    },
 *                 "pr_Number":{
 *                   "type":"string",
 *                   "description":"enter season"
 *                    },
 *                 "SourceType":{
 *                   "type":"string",
 *                   "description":"enter season"
 *                    },
 *                 "receiverType":{
 *                   "type":"string",
 *                   "description":"enter season"
 *                    },
 *                 "UserID":{
 *                   "type":"string",
 *                   "description":"enter season"
 *                    },
 *                 "UserIP":{
 *                   "type":"string",
 *                   "description":"enter season"
 *                    },
 *                 "CropCatg_ID":{
 *                   "type":"string",
 *                   "description":"enter season"
 *                    },
 *                  }
 *              
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

    let dateString = data.date_Intake;
    d = dateString.split("/");
    x = d[1] + "/" + d[0] + "/" + d[2];
    let dateSale = new Date(x);

    var seedData = {};

    if (data.SourceType == 'Seed Grower') {
        seedData.dist_Code = data.dist_Code
        seedData.lot_Number = data.lot_Number;
        seedData.source_ID = data.source_ID;
        seedData.receiver_ID = data.receiver_ID;
        seedData.qty_Per_Bag_Kg = parseInt(data.qty_Per_Bag_Kg);
        seedData.no_of_Bag = parseInt(data.no_of_Bag)
        seedData.date_Intake_Copy = data.date_Intake
        seedData.date_Intake = dateSale
        seedData.year = data.year
        seedData.season = data.season
        seedData.crop = data.crop
        seedData.cropName = data.cropName
        seedData.variety = data.variety
        seedData.varietyName = data.varietyName
        seedData.class = data.Class
        seedData.pr_Number = data.pr_Number
        seedData.instrumentNo = data.pr_Number
        seedData.SourceType = data.SourceType;
        seedData.receiverType = data.receiverType;
        seedData.UserID = data.UserID
        seedData.UserIP = data.UserIP
        seedData.CropCatg_ID = data.CropCatg_ID
        seedData.cert_Status = "Pass";
        // seedData.spo = '';
        // seedData.spoToReceive = ''
        // seedData.sourceSPO = ''
        // seedData.vehicleNO = ''
        // seedData.stockTrnsDate = ''
        seedData.transitStatus = 'Received';
        seedData.info = "SisAgencyPush"
        seedData.purchaseData = true
        seedData.pushedDateToBs = new Date();

        model.pushDataFromSisToBs(seedData, function (response) {
            if (response.insertedCount == 1) {
                res.status(200).send({ "status": "Inserted Successfully" })
            } else {
                res.status(200).send({ "status": "Insertion Unsuccessfull" })

            }

        })
    } else {
        seedData.dist_Code = data.dist_Code
        seedData.lot_Number = data.lot_Number;
        seedData.source_ID = data.source_ID;
        seedData.agencyName = data.agencyName;
        seedData.receiver_ID = data.receiver_ID;
        seedData.qty_Per_Bag_Kg = parseInt(data.qty_Per_Bag_Kg);
        seedData.no_of_Bag = parseInt(data.no_of_Bag)
        seedData.date_Intake = dateSale
        seedData.year = data.year
        seedData.season = data.season
        seedData.crop = data.crop
        seedData.cropName = data.cropName
        seedData.variety = data.variety
        seedData.varietyName = data.varietyName
        seedData.class = data.Class
        //seedData.challan_Number = data.challan_Number
        seedData.challan_Number = data.pr_Number
        seedData.instrumentNo = data.pr_Number
        seedData.SourceType = data.SourceType;
        seedData.receiverType = data.receiverType;
        seedData.UserID = data.UserID
        seedData.UserIP = data.UserIP
        seedData.CropCatg_ID = data.CropCatg_ID
        seedData.cert_Status = "Pass";
        // seedData.spoToReceive = ''
        // seedData.sourceSPO = ''
        // seedData.vehicleNO = ''
        // seedData.stockTrnsDate = ''
        seedData.transitStatus = 'Received'
        seedData.pushedDateToBs = new Date();
        seedData.info = "SisAgencyPush"


        model.pushDataFromSisToBs(seedData, function (response) {
            if (response.insertedCount == 1) {
                res.status(200).send({ "status": "Inserted Successfully" })
            } else {
                res.status(200).send({ "status": "Insertion Unsuccessfull" })

            }
        })
    }


})


//--------------------------------- Error Handling Test ---------------------------------


router.post('/sis', async (req, res) => {
    try {

        var data = req.body;
        //console.log(data);
        var seedData = {};

        if (data.SourceType == 'Seed Grower') {
            seedData.dist_Code = data.dist_Code
            seedData.lot_Number = data.lot_Number;
            seedData.source_ID = data.source_ID;
            seedData.receiver_ID = data.receiver_ID;
            seedData.qty_Per_Bag_Kg = data.qty_Per_Bag_Kg;
            seedData.no_of_Bag = data.no_of_Bag
            seedData.date_Intake = data.date_Intake
            seedData.year = data.year
            seedData.season = data.season
            seedData.crop = data.crop
            seedData.variety = data.variety
            seedData.class = data.class
            seedData.pr_Number = data.pr_Number
            seedData.SourceType = data.SourceType;
            seedData.receiverType = data.receiverType;
            seedData.UserID = data.UserID
            seedData.UserIP = data.UserIP
            seedData.CropCatg_ID = data.CropCatg_ID
            seedData.cert_Status = "Pass";
            // seedData.spo = '';
            // seedData.spoToReceive = ''
            // seedData.sourceSPO = ''
            // seedData.vehicleNO = ''
            // seedData.stockTrnsDate = ''
            seedData.transitStatus = 'Received'
            seedData.pushedDateToBs = new Date();

            let response = await model.pushDataFromSisToBssss(seedData)
            if (response.insertedCount == 1) {
                res.status(200).send({ "status": "Inserted Successfully" })
            } else {
                res.status(200).send({ "status": "Insertion Unsuccessfull" })

            }

        } else {
            seedData.dist_Code = data.dist_Code
            seedData.lot_Number = data.lot_Number;
            seedData.source_ID = data.source_ID;
            seedData.receiver_ID = data.receiver_ID;
            seedData.qty_Per_Bag_Kg = data.qty_Per_Bag_Kg;
            seedData.no_of_Bag = data.no_of_Bag
            seedData.date_Intake = data.date_Intake
            seedData.year = data.year
            seedData.season = data.season
            seedData.crop = data.crop
            seedData.variety = data.variety
            seedData.class = data.class
            //seedData.challan_Number = data.challan_Number
            seedData.pr_Number = data.pr_Number
            seedData.SourceType = data.SourceType;
            seedData.receiverType = data.receiverType;
            seedData.UserID = data.UserID
            seedData.UserIP = data.UserIP
            seedData.CropCatg_ID = data.CropCatg_ID
            seedData.cert_Status = "Pass";
            seedData.spoToReceive = ''
            seedData.sourceSPO = ''
            seedData.vehicleNO = ''
            seedData.stockTrnsDate = ''
            seedData.transitStatus = 'Received'
            seedData.pushedDateToBs = new Date();

            let response = await model.pushDataFromSisToBssss(seedData)
            if (response.insertedCount == 1) {
                res.status(200).send({ "status": "Inserted Successfully" })
            } else {
                res.status(200).send({ "status": "Insertion Unsuccessfull" })

            }

        }


    } catch (e) {
        res.send(e)
    }
})

module.exports = router;