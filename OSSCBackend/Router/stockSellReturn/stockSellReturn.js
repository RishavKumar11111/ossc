const { response } = require('express')
var ex = require('express')
var router = ex.Router()
var model = require('../../models/BAL/stockSellReturn/sellReturn')

// ==========================Sale Return APIs==============================================


router.post('/sellData', (req, res) => {
    var data ={
        instrumentNo:req.body.instrumentNo,
        spoId:req.body.spoId
    }
    model.sellReturnData(data, (responsee) => {
        if (responsee == 500) {
            res.status(400).json({ error: 'Error' })
        } else {
            res.send(responsee)
        }
    })
})


router.post('/sellReturnSubmit', (req, res) => {
    model.sellReturnSubmit(req.body, (respon) => {
        if (respon == 500) {
            res.status(400).json({ error: 'Error' })
        } else {
            if(respon.insertedCount==1){
                res.status(200).json({msg:"Success"})
            }else{
                res.status(200).json({msg:"Error"})

            }
            // console.log(respon);
        }
    })
})

router.get('/getSaleReturnData',(req,res)=>{
    var data=JSON.parse(req.query.resbody)
    model.getSaleReturnData(data.instrumentNo,(respons)=>{
        if (response == 500) {
            res.status(400).json({ error: 'Error' })
        } else {
            res.send(respons)
        }
    })
})



// ==========================Purchase Return APIs==============================================

router.post('/sellDataForPurchaseReturn', (req, res) => {
    var data ={
        instrumentNo:req.body.instrumentNo,
        spoId:req.body.spoId
    }
    // console.log(11,data);
    model.purchaseReturnData(data, (responsee) => {
        if (responsee == 500) {
            res.status(400).json({ error: 'Error' })
        } else {
            res.send(responsee)
        }
    })
})



router.post('/purchaseReturnSubmit', (req, res) => {
    model.purchaseReturnSubmit(req.body, (respon) => {
        if (respon == 500) {
            res.status(400).json({ error: 'Error' })
        } else {
            if(respon.insertedCount==1){
                res.status(200).json({msg:"Success"})
            }else{
                res.status(200).json({msg:"Error"})

            }
            // console.log(respon);
        }
    })
})



router.get('/getPurchaseReturnData',(req,res)=>{
    var data=JSON.parse(req.query.resbody)
    model.getPurchaseReturnData(data.instrumentNo,(respons)=>{
        if (response == 500) {
            res.status(400).json({ error: 'Error' })
        } else {
            res.send(respons)
        }
    })
})

module.exports = router;