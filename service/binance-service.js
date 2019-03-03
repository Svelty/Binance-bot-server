const RequestService = require('./request-service');
const BinanceAuth = require('./../const/binance-auth');
const crypto = require('crypto');

const baseEndpoint = 'https://api.binance.com'
const apiV1 = '/api/v1/'
const apiV3 = '/api/v3/'
const apiAuth = {
    apiKey: BinanceAuth.apiKey,
    apiSecret: BinanceAuth.apiSecret,
}

const uriEncoder = function encodeUri( object ) {

}

const createSignature = function hmacSig(paramString) {
    return crypto.createHmac('sha256', apiAuth.apiSecret).update(paramString).digest('hex');
    
}

const BinanceService = {
    //working unauthenticated calls
    ping:() => {
        const uri = `${baseEndpoint}${apiV1}ping`
        return RequestService.getRP(uri, '')
    },
    time:() => {
        const uri = `${baseEndpoint}${apiV1}time`
        return RequestService.getRP(uri, '');
    },
    exchangeInfo:() => {
        const uri = `${baseEndpoint}${apiV1}exchangeInfo`
        return RequestService.getRP(uri, '');
    },
    getOrderBook:(symbol, limit = 100) => { //limits: 5, 10, 20, 50, 100. 500. 1000
        const uri = `${baseEndpoint}${apiV1}depth?symbol=${symbol}&limit=${limit}`;
        return RequestService.getRP(uri, '');
    },
    getTrades:(symbol, limit) => {//limit max 1000
        const uri = `${baseEndpoint}${apiV1}trades?symbol=${symbol}&limit=${limit}`;
        return RequestService.getRP(uri, '');
    },
    getAggTrades:(symbol, limit, startTime = null, endTime = null, formId = null) => {//limit: default 500 max 1000 - formId: trade id to fetch from - max 1000
        let uri = `${baseEndpoint}${apiV1}aggTrades?symbol=${symbol}&limit=${limit}`;//endTime-startTime < 1h
        uri = formId ? uri + `&formId=${formId}` : uri;
        uri = startTime ? uri + `&startTime=${startTime}` : uri;
        uri = endTime ? uri + `&endTime=${endTime}` : uri;
        return RequestService.getRP(uri, '');
    },
    getKlines:(symbol, interval, limit, startTime = null, endTime = null) => {//limit: default 500 max 1000  intervals: 1m, 3m, 5m, 15m, 30m, 1h, 2h, 4h, 6h, 8h, 12h, 1d, 3d, 1w, 1M
        let uri = `${baseEndpoint}${apiV1}klines?symbol=${symbol}&limit=${limit}`;//endTime-startTime < 1h
        uri = interval ? uri + `&interval=${interval}` : uri;
        uri = startTime ? uri + `&startTime=${startTime}` : uri;
        uri = endTime ? uri + `&endTime=${endTime}` : uri;
        return RequestService.getRP(uri, '');
    },
    getAvgPrice:(symbol) => {
        const uri = `${baseEndpoint}${apiV3}avgPrice?symbol=${symbol}`;
        return RequestService.getRP(uri, '');
    },
    get24hrTicker:(symbol) => {//symbol may be omited, will return all tickets - care for rate limiting
        const uri = `${baseEndpoint}${apiV1}ticker/24hr?symbol=${symbol}`;
        return RequestService.getRP(uri, '');
    },
    getLastPrice:(symbol) => {//symbol may be omited
        const uri = `${baseEndpoint}${apiV3}ticker/price?symbol=${symbol}`;
        return RequestService.getRP(uri, '');
    },
    getBookTop:(symbol) => {//symbol may be omited
        const uri = `${baseEndpoint}${apiV3}ticker/bookTicker?symbol=${symbol}`;
        return RequestService.getRP(uri, '');
    },
    //Signed and Auth 
    postOrder:(symbol, side, type, quantity) => {
        const timestamp = Date.now();
        let uri = `${baseEndpoint}${apiV3}order`;
        const paramString = `symbol=${symbol}&side=${side}&type=${type}&quantity=${quantity}&timestamp=${timestamp}`
        const params = {
            symbol: symbol,
            side: side,
            type: type,
            quantity: quantity,
            timestamp: timestamp,
            signature: createSignature(paramString)
        };
        // uri = uri + '?' + paramString + '&signature=' + createSignature(paramString);
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