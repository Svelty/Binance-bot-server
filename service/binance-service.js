const RequestService = require('./request-service');
const BinanceAuth = require('./../const/binance-auth');
const crypto = require('crypto');

const baseEndpoint = 'https://api.binance.com'
const apiAuth = {
    apiKey: BinanceAuth.apiKey,
    apiSecret: BinanceAuth.apiSecret,
}

const buildUri = function buildUriString(apiVersion, endPoint, paramObject = null ) {

    let uri = `${baseEndpoint}/api/v${apiVersion}/${endPoint}`;

    if (paramObject) {
        uri = uri + '?' + buildParamString(paramObject);
    }
    return uri;
}
const buildParamString = function buildParamString(paramObject) {

    let paramString = '';
    const keys = Object.keys(paramObject);

    for ( i = 0; i < keys.length; i++ ) {
        if(paramObject[keys[i]] !== null) {
            paramString = (paramString === '') ? paramString : paramString + '&';
            paramString = paramString + keys[i] + '=' + paramObject[keys[i]];
        }
    }
    return paramString
}

const createSignature = function hmacSig(paramString) {
    return crypto.createHmac('sha256', apiAuth.apiSecret).update(paramString).digest('hex');
}

const BinanceService = {
    //working unauthenticated calls
    ping:() => {
        const uri = buildUri(1, 'ping');
        return RequestService.getRP(uri, '')
    },
    time:() => {
        const uri = buildUri(1, 'time');
        return RequestService.getRP(uri, '');
    },
    exchangeInfo:() => {
        const uri = buildUri(1, 'exchangeInfo');
        return RequestService.getRP(uri, '');
    },
    getOrderBook:(symbol, limit = 10) => { //limits: 5, 10, 20, 50, 100, 500, 1000
        const params = {
            symbol: symbol,
            limit: limit
        }
        const uri = buildUri(1, 'depth', params);
        return RequestService.getRP(uri, '');
    },
    getTrades:(symbol, limit) => {//limit max 1000
        const params = {
            symbol: symbol,
            limit: limit
        }
        const uri = buildUri(1, 'trades', params);
        return RequestService.getRP(uri, '');
    },
    getAggTrades:(symbol, limit, startTime = null, endTime = null, formId = null) => {//limit: default 500 max 1000 - formId: trade id to fetch from - max 1000
        const params = {
            symbol: symbol,
            limit: limit,
            startTime: startTime, //endTime-startTime < 1h
            endTime: endTime,
            formId: formId
        }
        const uri = buildUri(1, 'aggTrades', params);
        return RequestService.getRP(uri, '');
    },
    getKlines:(symbol, interval, limit, startTime = null, endTime = null) => {//limit: default 500 max 1000  intervals: 1m, 3m, 5m, 15m, 30m, 1h, 2h, 4h, 6h, 8h, 12h, 1d, 3d, 1w, 1M
        const params = {
            symbol: symbol,
            interval: interval,
            limit: limit,
            startTime: startTime, //endTime-startTime < 1h
            endTime: endTime,
        }
        const uri = buildUri(1, 'klines', params);
        return RequestService.getRP(uri, '');
    },
    getAvgPrice:(symbol) => {
        const params = {symbol: symbol};
        const uri = buildUri(3, 'avgPrice', params);
        return RequestService.getRP(uri, '');
    },
    get24hrTicker:(symbol = null) => {//symbol may be omited, will return all tickets - care for rate limiting
        const uri = buildUri(1, 'ticker/24hr', {symbol: symbol});
        return RequestService.getRP(uri, '');
    },
    getLastPrice:(symbol = null) => {//symbol may be omited
        const uri = buildUri(3, 'ticker/price', {symbol: symbol});
        return RequestService.getRP(uri, '');
    },
    getBookTop:(symbol = null) => {//symbol may be omited
        const uri = buildUri(3, 'ticker/bookTicker', {symbol: symbol});
        // const uri = (symbol) ? buildUri(3, 'ticker/bookTicker', {symbol: symbol}) : buildUri(3, 'ticker/bookTicker');
        return RequestService.getRP(uri, '');
    },
    //Signed and Auth 
    postOrder:(symbol, side, type, quantity) => {//incomplete - needs to handle different order types and optional params
        const uri = buildUri(3, 'order');
        const timestamp = Date.now();
        const params = {
            symbol: symbol,
            side: side,
            type: type,
            quantity: quantity,
            timestamp: timestamp,
        };
        const paramString = buildParamString(params);
        params.signature = createSignature(paramString);
        const headers = {
            'X-MBX-APIKEY': apiAuth.apiKey,
        }
        return RequestService.postFormRP(uri, params, headers)
    },
    





    //'api key format invalid'
    getHistoricalTrades:(symbol, limit, formId = null) => {//limit max 1000 formId - trade id to fetch from -default 500 max 1000
        let uri = `${baseEndpoint}${apiV1}historicalTrades?symbol=${symbol}&limit=${limit}`;
        uri = formId ? uri + `&formId=${formId}` : uri; 
        return RequestService.getRP(uri, '');
    },
}

module.exports = BinanceService;