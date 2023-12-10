const express = require('express');
const app = express();
require('express-async-errors');
const mysqlPool1 = require('./db')
const bodyparser = require('body-parser')
const cors = require('cors')
const cookieParser = require('cookie-parser')

const metbrandroutes = require('./controllers/metbrands.controller');
const metsupplierroutes = require('./controllers/metsuppliers.controller');
const metthicknessroutes = require('./controllers/metcoilthickness.controller');
const metstockroutes = require('./controllers/metstocksummary.controller')
const metstockdetailsroutes = require('./controllers/metstockdetails.controller')
const fileuploadroutes = require('./controllers/fileupload.controller')
const stockmanagementroutes = require('./controllers/stockmanagement.controller')
const filedownloadroutes = require('./controllers/filedownload.controller')
const preparestockroutes = require('./controllers/preparestock.controller')
const printstockroutes = require('./controllers/printstock.controller')
const authroutes = require('./controllers/authentication.controller')
const orderverification = require('./controllers/orderverification.controller')
const metorders = require('./controllers/metorders.controller')
//middlwware
const  mysqlPool = mysqlPool1('Roofing');

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Credentials", true);
    next();
  });

app.use(
    cors({
      origin: "http://localhost:3000",
      methods: ["POST , GET, PUT, DELETE"],
      credentials: true
    })
  );
  

app.use(cookieParser());

//middlewares
app.use(express.json());
app.use(function(req, res, next){
    res.header("Access-Control-Allow-Credentials",true)
    next()
})

app.use(bodyparser.json())
app.use(express.json());
app.use(
    cors({
      origin: "http://localhost:3000",
      methods: ["POST , GET, PUT, DELETE"],
      credentials: true
    })
  );




//error handling
 app.use(function(err, req, res, next){
    console.log(err);
    res.status(err.status || 500).send('Something went wrong');
    
}) 


app.use(bodyparser.urlencoded({extended :true,
    }),
)

app.use('/api/metbrands' , metbrandroutes )
app.use('/api/metsuppliers' , metsupplierroutes )
app.use('/api/coilthickness' ,metthicknessroutes )
app.use('/api/stocksummary' , metstockroutes)
app.use('/api/stockdetails' , metstockdetailsroutes)
app.use('/api/fileupload' , fileuploadroutes)
app.use('/api/stockmanagement',stockmanagementroutes)
app.use('/api/download',filedownloadroutes)
app.use('/api/preparestock',preparestockroutes)
app.use('/api/printstock',printstockroutes)
app.use('/api/auth',authroutes)
app.use('/api/orderverification' , orderverification)
app.use('/api/metorders' , metorders)



// first make sure connection is fine
// then start the express server

mysqlPool.query("select 1")
    .then(data => {
        console.log('db connection succeeded')
        app.listen(
            3002,
            () => console.log('server started at 3002')
        )

    })
    .catch(err=>console.log('db connection failed. \n' + err))


