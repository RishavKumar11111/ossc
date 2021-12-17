var ex = require('express');
var model = require('../../models/BAL/ImsSeedModel/seedModel');

var router = ex.Router();


/**
 * @swagger
 * 
 * "/addLot/": {
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
 *                 "in": "body",
 *                 "dist_Code":{
 *                   "type":"string"
 *                    },
 *                 "lot_Number":{
 *                   "type":"string"
 *                    },
 *                 "source_ID":{
 *                   "type":"string"
 *                    },
 *                 "receiver_ID":{
 *                   "type":"string"
 *                    },
 *                 "qty_Per_Bag_Kg":{
 *                   "type":"integer"
 *                    },
 *                 "no_of_Bag":{
 *                   "type":"integer"
 *                    },
 *                 "date_Intake":{
 *                   "type":"string"
 *                    },
 *                 "year":{
 *                   "type":"string"
 *                    },
 *                 "season":{
 *                   "type":"string",
 *                   "description":"enter season"
 *                    },
 *                 "pr_Number":{
 *                   "type":"string"
 *                    },
 *                 "crop":{
 *                   "type":"string"
 *                    },
 *                 "variety":{
 *                   "type":"string"
 *                    },
 *                 "class":{
 *                   "type":"string"
 *                    },
 *                 "SourceType":{
 *                   "type":"string"
 *                    },
 *                 "receiverType":{
 *                   "type":"string"
 *                    },
 *                 "UserID":{
 *                   "type":"string"
 *                    },
 *                 "UserIP":{
 *                   "type":"string"
 *                    },
 *                 "CropCatg_ID":{
 *                   "type":"string"
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
    if (data.apiKey == 'Os$c@431') {
        var seedData = {};
        seedData.dist_Code = data.dist_code
        seedData.lot_Number = data.lot_Number;
        seedData.source_ID = data.source_ID;
        seedData.farmer_ID = data.farmer_ID;
        seedData.farmerName = data.farmerName;
        seedData.receiver_ID = data.reciever_ID;
        seedData.qty_Per_Bag_Kg = data.qty_Per_Bag_Kg;
        seedData.no_of_Bag = data.no_of_Bag
        seedData.date_Intake_Copy = new Date(data.date_Intake);
        seedData.date_Intake = new Date(data.date_Intake)
        seedData.year = data.year
        seedData.season = data.season
        seedData.pr_Number = data.pr_Number
        seedData.instrumentNo = data.pr_Number
        seedData.prInstrumentDate = new Date(data.prInstrumentDate)
        seedData.crop = data.cropCode
        seedData.cropName = data.cropName
        seedData.variety = data.varietyCode
        seedData.varietyName = data.varietyName
        seedData.class = data.seed_class
        seedData.SourceType = data.sourceType;
        //seedData.sourceName=data.sourceName
        seedData.receiverType = 'Godown';
        seedData.UserID = data.userID;
        seedData.UserIP = data.userIP;
        seedData.CropCatg_ID = data.CropCatg_ID;
        seedData.cert_Status = "Pending";
        seedData.info = 'imsPushedData'
        // seedData.spoToReceive = ''
        // seedData.sourceSPO = ''
        // seedData.vehicleNO = ''
        // seedData.stockTrnsDate = ''
        seedData.pushedDateToBs = new Date()
        seedData.transitStatus = 'Received'
        //console.log(seedData);
        model.imsNewSeedDetails(seedData, function (response) {
            res.status(200).json({ "status": response.insertedCount })
        })
    }
})

// router.post('/addNewSeed', async (req, res) => {
//     try {
//         var data = req.body;
//         var seedData = {};
//         seedData.dist_Code = data.dist_Code
//         seedData.lot_Number = data.lot_Number;
//         seedData.source_ID = data.source_ID;
//         seedData.receiver_ID = data.receiver_ID;
//         seedData.qty_Per_Bag_Kg = data.qty_Per_Bag_Kg;
//         seedData.no_of_Bag = data.no_of_Bag
//         seedData.date_Intake = data.date_Intake
//         seedData.year = data.year
//         seedData.season = data.season
//         seedData.pr_Number = data.pr_Number
//         seedData.crop = data.crop
//         seedData.variety = data.variety
//         seedData.class = data.class
//         seedData.SourceType = data.SourceType;
//         seedData.receiverType = data.receiverType;
//         seedData.UserID = data.UserID;
//         seedData.UserIP = data.UserIP;
//         seedData.CropCatg_ID = data.CropCatg_ID;
//         seedData.cert_Status = "Pending";
//         // seedData.spoToReceive = ''
//         // seedData.sourceSPO = ''
//         // seedData.vehicleNO = ''
//         // seedData.stockTrnsDate = ''
//         seedData.pushedDateToBs = new Date()
//         seedData.transitStatus = 'Received'
//         seedData.info = "ImsPushedData"
//         //console.log(seedData);
//         let response = await model.imsNewSeedDetailssss(seedData)
//         res.status(200).json({ "status": response.insertedCount })

//     } catch (e) {
//         res.status(400).json({ "status": e })
//     }

// })



module.exports = router;