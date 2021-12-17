var ex=require('express')
var router=ex.Router()
var model=require('../../models/BAL/stockOutwardStatement/stockOutward')

router.get('/loadAllData',(req,res)=>{
    var data=JSON.parse(req.query.requestData)

    model.loadAllData(data,function(response){
        res.send(response)
    })

})

router.post('/saleDataDelete',(req,res)=>{
    model.saleDataDelete(req.body,function(response){
        res.send({status:response})
    })
})



module.exports = router;
