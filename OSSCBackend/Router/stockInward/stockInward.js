var ex = require('express')
var router = ex.Router()
var model = require('../../models/BAL/stockInwardStatement/stockInward')


router.get('/getAllSpos', function (req, res) {
    model.getAllSpos(function (response) {
        res.send(response)
    })
})

router.post('/loadAllData',function(req,res){
    var data=req.body
    model.loadAllData(data,function(response){
        res.send(response)
    })
})

router.post('/purchaseDataDelete',(req,res)=>{
    var data=req.body
    model.purchaseDataDelete(data,function(response){
        res.send({status:response})
    })
})


// router.post('/loadAllData', async (req, res) => {
//     try {
//         var data = req.body
//         let response=await model.reportData(data)
//         res.send(response)
//     } catch (e) {
//         res.send(e)
//     }
// })


module.exports = router;

