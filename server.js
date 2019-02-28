const express = require('express');
const app = express();
const route = require('./route/route');
const port = 9877;
const BinanceService = require('./service/binance-service');

app.use('/', route());


app.listen(port, () => console.log(`App listening on port ${port}!`));

// setInterval(() => BinanceService.ping(), 5000); //ping biance server ever 30s
setInterval( async () => {
    console.log( await BinanceService.getOrderBook('BTCUSDT', 5));
    console.log('test');
}, 2000);
setInterval( () => {
    console.log('test2');
}, 2000);
