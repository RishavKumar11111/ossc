var ex=require('express');
var app=ex();
var cors=require('cors');
var path=require('path')
var bodyparser=require('body-parser');
var imsRouter=require('./Router/IMSRouter/ImsSeedRouter');
var ossopcaRouter=require('./Router/OSSOPCA/certifiedSeed');
var sisRouter=require('./Router/SISRouter/sisSeedRoute');
var godownStock=require('./Router/godownStock/godownStockDetails');
var spoStockTransfer=require('./Router/spoStockTransfer/stockTransfer');
var transit=require('./Router/transitStatus/status');
var stockInward=require('./Router/stockInward/stockInward')
var stockOutward=require('./Router/stockOutward/stockOutward')
var stockSell=require('./Router/sisStockSell/sisStockSell')
var stockSellReturn=require('./Router/stockSellReturn/stockSellReturn')
var bsStockSell=require('./Router/BsStockSell/BsStockSell')
var auth=require('./Router/auth/login')
var lotFail=require('./Router/makeLotFail/lotFail')
var testRoute=require('./Router/testRoute/testRoute')

// Swagger implementation start
const swaggerJsDoc=require('swagger-jsdoc');
const swaggerUi=require('swagger-ui-express');
// Swagger implementation end

// Swagger Setup
var swaggerOption= {
    swaggerDefinition: {
        openapi: "3.0.0",
        info:{
            title: "OSSC BS",
            version:'1.0.0',
            description: "Broker System",
            contact: {
                name: "balunkeswar"
            },
            servers: [ {
                    url: "http://localhost:3000"
                }
            ]
        }
    },
    apis: ['app.js','D:/OfficeProject(New)/OSSCProject/OSSCBackend/Router/IMSRouter/ImsSeedRouter.js','D:/OfficeProject(New)/OSSCProject/OSSCBackend/Router/godownStock/godownStockDetails.js','D:/OfficeProject(New)/OSSCProject/OSSCBackend/Router/OSSOPCA/certifiedSeed.js','D:/OfficeProject(New)/OSSCProject/OSSCBackend/Router/SISRouter/sisSeedRoute.js']
};

const swaggerDocs=swaggerJsDoc(swaggerOption)

app.use(cors());
app.use(bodyparser.json());

// Routes

//Angular implementation start
// app.use(ex.static('../OSSC Frontend/dist/'))
app.use(ex.static('./frontend/dist/'))
// app.get('/*',(req,res)=>
//     res.sendFile('../OSSC Frontend/dist/index.html')
// )
//Angular implementation end


app.use('/api-docs',swaggerUi.serve,swaggerUi.setup(swaggerDocs));
app.use('/addLot',imsRouter);
app.use('/certifyLot',ossopcaRouter);
app.use('/addStockbySIS',sisRouter);
app.use('/godownStock',godownStock);
app.use('/spo',spoStockTransfer);
app.use('/transit',transit)
app.use('/report',stockInward)
app.use('/outwardReport',stockOutward)
app.use('/addSellStockbySIS',stockSell)
app.use('/getSellData',stockSellReturn)
app.use('/stockSell',bsStockSell)
app.use('/auth',auth)
app.use('/lotFail',lotFail)
app.use('/testRoute',testRoute)






app.listen(3000);