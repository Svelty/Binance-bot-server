const express = require('express');
const app = express();
const route = require('./route/route');
const port = 9877;
const BinanceService = require('./service/binance-service');

app.use('/', route());


app.listen(port, () => console.log(`App listening on port ${port}!`));

// setInterval(() => BinanceService.ping(), 5000); //ping biance server ever 30s
setInterval( async () => {
    try {
        console.log( await BinanceService.getHistoricalTrades('BTCUSDT', 15));
        console.log('test');
    } catch (error) {
        throw(error);
    }
    
}, 2000);

setInterval( () => {
    console.log('test2');
}, 2000);
