const baseEndpoint = 'https://api.binance.com'
const apiPathV1 = '/api/v1/'
const RequestService = require('./request-service')

const BinanceService = {
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
    getOrderBook:(symbol, limit) => { //limits: 5, 10, 20, 50, 100. 500. 1000
        const uri = `${baseEndpoint}${apiPathV1}depth?symbol=${symbol}&limit=${limit}`
        return RequestService.getRP(uri, '');
    },
}

module.exports = BinanceService;