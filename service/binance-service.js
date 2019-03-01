const baseEndpoint = 'https://api.binance.com'
const apiPathV1 = '/api/v1/'
const RequestService = require('./request-service')

const BinanceService = {
    //working unauthenticated
    ping: () => {
        const uri = `${baseEndpoint}${apiPathV1}ping`
        return RequestService.getRP(uri, '')
    },
    time:() => {
        const uri = `${baseEndpoint}${apiPathV1}time`
        return RequestService.getRP(uri, '');
    },
    exchangeInfo:() => {
        const uri = `${baseEndpoint}${apiPathV1}exchangeInfo`
        return RequestService.getRP(uri, '');
    },
    getOrderBook:(symbol, limit = 100) => { //limits: 5, 10, 20, 50, 100. 500. 1000
        const uri = `${baseEndpoint}${apiPathV1}depth?symbol=${symbol}&limit=${limit}`;
        return RequestService.getRP(uri, '');
    },
    getTrades:(symbol, limit) => {//limit max 1000
        const uri = `${baseEndpoint}${apiPathV1}trades?symbol=${symbol}&limit=${limit}`;
        return RequestService.getRP(uri, '');
    },






    //api key format invalid
    getHistoricalTrades:(symbol, limit, formId = null) => {//limit max 1000 formId - trade id to fetch from -def
        let uri = `${baseEndpoint}${apiPathV1}historicalTrades?symbol=${symbol}&limit=${limit}`;
        uri = formId ? uri + `&formId=${formId}` : uri; 
        return RequestService.getRP(uri, '');
    },
}

module.exports = BinanceService;