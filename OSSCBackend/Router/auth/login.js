var ex = require('express')
var router = ex.Router()
var jwt = require('jsonwebtoken');
var sha512 = require('js-sha512');

router.post('/login', (req, res) => {
    if (req.body.userName == 'spo' && req.body.password == 'spo123') {
        var token = jwt.sign({ data: req.body.userName, role: 'admin' }, 'Sikun@1234', { expiresIn: '1h' })
        res.send({ token: token })
    } else {
        res.send({ token: 'invalid' })
    }
})

router.post('/varifyTokenn', (req, res) => {
    jwt.verify(req.body.token, 'Sikun@1234', function (err, response) {
        if (response) {
            res.send({ spoCode: response.spoCode })
        } else {
            res.send({ spoCode: 'invalid' })
        }
    })
})

router.post('/roleBasedLogin', (req, res) => {
    let token=JSON.parse(req.body.token).token;
    jwt.verify(token, 'Sikun@1234', function (err, response) {
        if (response) {
            res.send({ role: response.role })
        } else {
            res.send({ role: 'invalid' })
        }
    })
})

router.post('/checkToken', function (req, res) {
    jwt.verify(req.body.token, 'Sikun@1234', (err, responsee) => {
        if (responsee) {
            res.send(true)
        } else {
            res.send(false)
        }
    })
})

router.post('/sisSpoLogin', (req, res) => {
    var data = req.body
    var spoData = {};
    spoData.spoName = data.spo_name;
    if (data.spo_code.toString().length == 1) {
        spoData.spoCode = '0' + data.spo_code.toString()
    } else {
        spoData.spoCode = data.spo_code.toString();
    }
    // console.log(spoData.spoCode);
    let secretKey = 'Sikun@1234'
    let token = sha512(data.spo_code + data.spo_name + secretKey)

    if (token == data.token) {
        let jwtToken = jwt.sign({ token: token, spoCode: spoData.spoCode, role: 'spo' }, 'Sikun@1234', { expiresIn: '1h' })
        res.send(jwtToken);
    }
})



module.exports = router