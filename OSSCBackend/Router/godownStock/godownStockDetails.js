var ex = require('express');
var model = require('../../models/BAL/godownStock/godownStock');
var router = ex.Router();

router.get('/loadGodown/:spoId', function (req, res) {
    var data = req.params.spoId;
    model.loadGodown(data, function (response) {
        res.send(response);
    })
})

router.get('/allStockForClass/:godown/:crop/:variety', function (req, res) {
    var seedtype = req.params.crop;
    var godownId = req.params.godown;
    var variety = req.params.variety;
    //console.log(variety);
    var data = {
        cropType: seedtype,
        godownId: godownId,
        variety: variety
    }
    model.classAccVariety(data, function (response) {
        //console.log(response);
        res.send(response);
    })
})

router.get('/dataAccVarietySelectAll/:gt/:crop', function (req, res) {
    var godownId = req.params.gt;
    var cropType = req.params.crop;
    var data = {
        godownId: godownId,
        cropType: cropType
    }
    model.dataAccVarietySelectAll(data, function (response) {
        res.send(response);
    })
})


router.get('/allStockForVariety/:st/:gt', function (req, res) {
    var seedtype = req.params.st;
    var godownid = req.params.gt;
    var data = {
        seedType: seedtype,
        godownId: godownid
    }
    model.varietyAccCrop(data, function (response) {
        res.send(response);
    })
})

router.get('/allStockForSeed/:id', function (req, res) {
    var id = req.params.id;
    model.allStocks(id, function (response) {
        res.send(response);
    })
})

router.get('/classOfCropSelectAll/:gid', function (req, res) {
    var id = req.params.gid;

    model.classOfCropSelectAll(id, function (response) {
        res.send(response);
    })
})





// new received
// router.get('/receivedStockDetail/:gid/:cropSA/:cropT/:varietyT/:varietySA/:classT/:classSA/:selectedCircle',function(req,res){
//     var data={
//         gid:req.params.gid,
//         cropSA:req.params.cropSA,
//         cropT:req.params.cropT,
//         varietyT:req.params.varietyT,
//         varietySA:req.params.varietySA,
//         classT:req.params.classT,
//         classSA:req.params.classSA,
//         selectedCircle:req.params.selectedCircle
//     }
//     model.receivedStockDetail(data,function(response){
//         res.send(response);
//     })

// })

router.post('/receivedStockDetail', function (req, res) {
    var data = req.body
    model.receivedStockDetail(data, function (response) {
        if (response.error == 500) {
            res.status(200).json({ 'error': "Unexpected Error" })
        } else {
            res.send(response);

        }

    })

})

// /**
//  * @swagger
//  * /godownStock/dispatchedStockDetail/{gid}/{cropSA}/{cropT}/{varietyT}/{varietySA}/{classT}/{classSA}: 
//  *  get: 
//  *   description: Stock details are shown according after selection of godown
//  *   responses:
//  *       '200':
//  *       description: A successful response
//  */

// router.get('/dispatchedStockDetail/:gid/:cropSA/:cropT/:varietyT/:varietySA/:classT/:classSA/:selectedCircle',function(req,res){
//     var data={
//         gid:req.params.gid,
//         cropSA:req.params.cropSA,
//         cropT:req.params.cropT,
//         varietyT:req.params.varietyT,
//         varietySA:req.params.varietySA,
//         classT:req.params.classT,
//         classSA:req.params.classSA,
//         selectedCircle:req.params.selectedCircle
//     }
//     model.dispatchedStockDetail(data,function(response){
//         res.send(response);
//     })

// })

router.post('/dispatchedStockDetail', function (req, res) {
    var data = req.body
    model.dispatchedStockDetail(data, function (response) {
        if (response.error == 500) {
            res.status(200).json({ 'error': "Unexpected Error" })
        } else {
            res.send(response);

        }
    })

})


// router.get('/totalStockDetail/:gid/:cropSA/:cropT/:varietyT/:varietySA/:classT/:classSA',function(req,res){
//     var data={
//         gid:req.params.gid,
//         cropSA:req.params.cropSA,
//         cropT:req.params.cropT,
//         varietyT:req.params.varietyT,
//         varietySA:req.params.varietySA,
//         classT:req.params.classT,
//         classSA:req.params.classSA
//     }
//     model.totalStockDetail(data,function(response){
//        //console.log(response);
//         res.send(response);
//     })
// })


router.post('/totalStockDetail', function (req, res) {
    var data = req.body
    model.totalStockDetail(data, function (response) {
        //console.log(response);
        if (response == 500) {
            res.status(200).json({ 'error': "Unexpected Error" })
        } else {
            res.send(response);

        }
    })
})

module.exports = router