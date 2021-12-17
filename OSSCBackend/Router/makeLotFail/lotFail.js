var ex = require('express')
var router = ex.Router()
var model = require('../../models/BAL/makeLotFail/lotFail')

router.get('/makeLotFail/:lotNo', (req, res) => {
    model.failALot(req.params.lotNo,(response)=>{
        res.send(response)
    })
})


module.exports = router;