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
    postRP: (uri, headers, body) => {
        const options = {
            method: 'POST',
            uri: uri,
            body: {
                some: 'payload'
            },
            json: true // Automatically stringifies the body to JSON
        };
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
