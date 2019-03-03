const RequestPromise = require('request-promise')

const BinanceService = {
    getRP: (uri, headers) => {
        const options = {
            method: 'GET',
            uri: uri,
            // qs: {} = {
    
            // },
            headers: {
                'User-Agent': 'Request-Promise'
            },
            json: true,
        }
        return RequestPromise(options);
    },
    postFormRP: (uri, form, headers) => {
        const options = {
            method: 'POST',
            uri: uri,
            form: form, //binance requires this to be form not body...
            headers: headers,
        };
        console.log(options);
        return RequestPromise(options);
    },
    putRP: (method, url) => {
        const options = {
            method: '',
            url: '',
            headers: {},
        };
        return RequestPromise(options);
    },
    deleteRP: (method, url) => {
        const options = {
            method: '',
            url: '',
            headers: {},
        };
        return RequestPromise(options);
    },
    universalRP: (method, url) => {
        const options = {
            method: '',
            url: '',
            headers: {},
        };
        return RequestPromise(options);
    },
}

module.exports = BinanceService;
