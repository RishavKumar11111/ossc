var ex=require('express')
var router=ex.Router()
var model=require('../../models/BAL/testBal/extra')

router.get('/getMinusBalance',model.getMinusBalance)

module.exports=router