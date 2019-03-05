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
    //market data end points - documentation claims these need api key auth
    getOrderBook:(symbol, limit = 10) => { //limits: 5, 10, 20, 50, 100, 500, 1000
        const params = {
            symbol: symbol,
            limit: limit
        }
        const uri = buildUri(1, 'depth', params);
        const headers = {
            'X-MBX-APIKEY': apiAuth.apiKey,
        };
        return RequestService.getRP(uri, headers);
    },
    getTrades:(symbol, limit) => {//limit max 1000
        const params = {
            symbol: symbol,
            limit: limit
        }
        const uri = buildUri(1, 'trades', params);
        const headers = {
            'X-MBX-APIKEY': apiAuth.apiKey,
        };
        return RequestService.getRP(uri, headers);
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
        const headers = {
            'X-MBX-APIKEY': apiAuth.apiKey,
        };
        return RequestService.getRP(uri, headers);
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
        const headers = {
            'X-MBX-APIKEY': apiAuth.apiKey,
        };
        return RequestService.getRP(uri, headers);
    },
    getAvgPrice:(symbol) => {
        const params = {symbol: symbol};
        const uri = buildUri(3, 'avgPrice', params);
        const headers = {
            'X-MBX-APIKEY': apiAuth.apiKey,
        };
        return RequestService.getRP(uri, headers);
    },
    get24hrTicker:(symbol = null) => {//symbol may be omited, will return all tickets - care for rate limiting
        const uri = buildUri(1, 'ticker/24hr', {symbol: symbol});
        const headers = {
            'X-MBX-APIKEY': apiAuth.apiKey,
        };
        return RequestService.getRP(uri, headers);
    },
    getLastPrice:(symbol = null) => {//symbol may be omited
        const uri = buildUri(3, 'ticker/price', {symbol: symbol});
        const headers = {
            'X-MBX-APIKEY': apiAuth.apiKey,
        };
        return RequestService.getRP(uri, headers);
    },
    getBookTop:(symbol = null) => {//symbol may be omited
        const uri = buildUri(3, 'ticker/bookTicker', {symbol: symbol});
        const headers = {
            'X-MBX-APIKEY': apiAuth.apiKey,
        };
        return RequestService.getRP(uri, headers);
    },
    //Signed and Auth 
    postOrder:(symbol, side, type, quantity) => {//incomplete - needs to handle different order types and optional params
        const uri = buildUri(3, 'order');//can be order/test
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
        };
        return RequestService.postFormRP(uri, params, headers);
    },
    // ORDER TYPES:
    // LIMIT
    // MARKET
    // STOP_LOSS
    // STOP_LOSS_LIMIT
    // TAKE_PROFIT
    // TAKE_PROFIT_LIMIT
    // LIMIT_MAKER

    // Time in force (timeInForce):
    // GTC
    // IOC
    // FOK
    
    // symbol	STRING	YES	
    // side	ENUM	YES	
    // type	ENUM	YES	
    // timeInForce	ENUM	NO	
    // quantity	DECIMAL	YES	
    // price	DECIMAL	NO	
    // newClientOrderId	STRING	NO	A unique id for the order. Automatically generated if not sent.
    // stopPrice	DECIMAL	NO	Used with STOP_LOSS, STOP_LOSS_LIMIT, TAKE_PROFIT, and TAKE_PROFIT_LIMIT orders.
    // icebergQty	DECIMAL	NO	Used with LIMIT, STOP_LOSS_LIMIT, and TAKE_PROFIT_LIMIT to create an iceberg order.
    // newOrderRespType	ENUM	NO	Set the response JSON. ACK, RESULT, or FULL; MARKET and LIMIT order types default to FULL, all other orders default to ACK.
    // recvWindow	LONG	NO	
    // timestamp	LONG	YES	
    // Additional mandatory parameters based on type:

    // Type	Additional mandatory parameters
    // LIMIT	timeInForce, quantity, price
    // MARKET	quantity
    // STOP_LOSS	quantity, stopPrice
    // STOP_LOSS_LIMIT	timeInForce, quantity, price, stopPrice
    // TAKE_PROFIT	quantity, stopPrice
    // TAKE_PROFIT_LIMIT	timeInForce, quantity, price, stopPrice
    // LIMIT_MAKER	quantity, price
    // Other info:

    // LIMIT_MAKER are LIMIT orders that will be rejected if they would immediately match and trade as a taker.
    // STOP_LOSS and TAKE_PROFIT will execute a MARKET order when the stopPrice is reached.
    // Any LIMIT or LIMIT_MAKER type order can be made an iceberg order by sending an icebergQty.
    // Any order with an icebergQty MUST have timeInForce set to GTC.
    // Trigger order price rules against market price for both MARKET and LIMIT versions:

    // Price above market price: STOP_LOSS BUY, TAKE_PROFIT SELL
    // Price below market price: STOP_LOSS SELL, TAKE_PROFIT BUY

    //untested
    getOrder:(symbol, orderId) => {
        const uri = buildUri(3, 'order');
        const timestamp = Date.now();
        const params = {
            symbol: symbol,
            orderId: orderId,
            timestamp: timestamp,
        };
        
        const paramString = buildParamString(params);
        uri = uri + paramString + '&' + createSignature(paramString);
        const headers = {
            'X-MBX-APIKEY': apiAuth.apiKey,
        };
        return RequestService.getRP(uri, headers);
    },

    // GET /api/v3/order (HMAC SHA256)
    // Check an order's status.
    // Weight: 1
    // Parameters:
    // Name	Type	Mandatory	Description
    // symbol	STRING	YES	
    // orderId	LONG	NO	
    // origClientOrderId	STRING	NO	
    // recvWindow	LONG	NO	
    // timestamp	LONG	YES	
    // Notes:

    // Either orderId or origClientOrderId must be sent.
    // For some historical orders cummulativeQuoteQty will be < 0, meaning the data is not available at this time.





    //untested/unfinished
    cancelOrder:(symbol, orderId) => {
        const uri = buildUri(3, 'order');
        const timestamp = Date.now();
        const params = {
            symbol: symbol,
            orderId: orderId,
            timestamp: timestamp,
        };
        
        const paramString = buildParamString(params);
        uri = uri + paramString + '&' + createSignature(paramString);
        const headers = {
            'X-MBX-APIKEY': apiAuth.apiKey,
        };
        return RequestService.deleteRP(uri, headers);
    },
    // DELETE /api/v3/order  (HMAC SHA256)
    // Cancel an active order.
    
    // Weight: 1
    // Parameters:
    // Name	Type	Mandatory	Description
    // symbol	STRING	YES	
    // orderId	LONG	NO	
    // origClientOrderId	STRING	NO	
    // newClientOrderId	STRING	NO	Used to uniquely identify this cancel. Automatically generated by default.
    // recvWindow	LONG	NO	
    // timestamp	LONG	YES	
    // Either orderId or origClientOrderId must be sent.


    getOpenOrders:(symbol) => {
        const uri = buildUri(3, 'openOrders');
        const timestamp = Date.now();
        const params = {
            symbol: symbol,
            timestamp: timestamp,
        };
        
        const paramString = buildParamString(params);
        uri = uri + paramString + '&' + createSignature(paramString);
        const headers = {
            'X-MBX-APIKEY': apiAuth.apiKey,
        };
        return RequestService.getRP(uri, headers);
    },
    // GET /api/v3/openOrders  (HMAC SHA256)
    // Get all open orders on a symbol. Careful when accessing this with no symbol.

    // Weight: 1 for a single symbol; 40 when the symbol parameter is omitted

    // Parameters:

    // Name	Type	Mandatory	Description
    // symbol	STRING	NO	
    // recvWindow	LONG	NO	
    // timestamp	LONG	YES	
    // If the symbol is not sent, orders for all symbols will be returned in an array.
    // When all symbols are returned, the number of requests counted against the rate limiter is equal to the number of symbols currently trading on the exchange.



    getAllOrders:(symbol) => {
        const uri = buildUri(3, 'allOrders');
        const timestamp = Date.now();
        const params = {
            symbol: symbol,
            timestamp: timestamp,
        };
        
        const paramString = buildParamString(params);
        uri = uri + paramString + '&' + createSignature(paramString);
        const headers = {
            'X-MBX-APIKEY': apiAuth.apiKey,
        };
        return RequestService.getRP(uri, headers);
    },

    // GET /api/v3/allOrders (HMAC SHA256)
    // Get all account orders; active, canceled, or filled.

    // Weight: 5 with symbol

    // Parameters:

    // Name	Type	Mandatory	Description
    // symbol	STRING	YES	
    // orderId	LONG	NO	
    // startTime	LONG	NO	
    // endTime	LONG	NO	
    // limit	INT	NO	Default 500; max 1000.
    // recvWindow	LONG	NO	
    // timestamp	LONG	YES	
    // Notes:

    // If orderId is set, it will get orders >= that orderId. Otherwise most recent orders are returned.
    // For some historical orders cummulativeQuoteQty will be < 0, meaning the data is not available at this time.




    getAccountInfo:() => {
        const uri = buildUri(3, 'account');
        const timestamp = Date.now();
        const params = {
            timestamp: timestamp,
        };
        
        const paramString = buildParamString(params);
        uri = uri + paramString + '&' + createSignature(paramString);
        const headers = {
            'X-MBX-APIKEY': apiAuth.apiKey,
        };
        return RequestService.getRP(uri, headers);
    },
    // GET /api/v3/account (HMAC SHA256)
    // Get current account information.
    
    // Weight: 5
    
    // Parameters:
    
    // Name	Type	Mandatory	Description
    // recvWindow	LONG	NO	
    // timestamp	LONG	YES	



    getAccountTrades:(symbol, limit, startTime = null, endTime = null, formId = null) => {//limit: default 500 max 1000 - formId: trade id to fetch from - max 1000
        const uri = buildUri(3, 'myTrades');
        const timestamp = Date.now();
        const params = {
            symbol: symbol,
            limit: limit,
            startTime: startTime, //endTime-startTime < 1h
            endTime: endTime,
            formId: formId
        };        
        
        const paramString = buildParamString(params);
        uri = uri + paramString + '&' + createSignature(paramString);
        const headers = {
            'X-MBX-APIKEY': apiAuth.apiKey,
        };
        return RequestService.getRP(uri, headers);
    },
    // GET /api/v3/myTrades  (HMAC SHA256)
    // Get trades for a specific account and symbol.
    
    // Weight: 5 with symbol
    
    // Parameters:
    
    // Name	Type	Mandatory	Description
    // symbol	STRING	YES	
    // startTime	LONG	NO	
    // endTime	LONG	NO	
    // fromId	LONG	NO	TradeId to fetch from. Default gets most recent trades.
    // limit	INT	NO	Default 500; max 1000.
    // recvWindow	LONG	NO	
    // timestamp	LONG	YES	
    // Notes:
    
    // If fromId is set, it will get orders >= that fromId. Otherwise most recent orders are returned.







    // User data stream endpoints
    // Specifics on how user data streams work is in another document.
    
    // Start user data stream (USER_STREAM)
    // POST /api/v1/userDataStream
    // Start a new user data stream. The stream will close after 60 minutes unless a keepalive is sent.
    
    // Weight: 1
    
    // Parameters: NONE
    
    // Response:
    
    // {
    //   "listenKey": "pqia91ma19a5s61cv6a81va65sdf19v8a65a1a5s61cv6a81va65sdf19v8a65a1"
    // }
    // Keepalive user data stream (USER_STREAM)
    // PUT /api/v1/userDataStream
    // Keepalive a user data stream to prevent a time out. User data streams will close after 60 minutes. It's recommended to send a ping about every 30 minutes.
    
    // Weight: 1
    
    // Parameters:
    
    // Name	Type	Mandatory	Description
    // listenKey	STRING	YES	
    // Response:
    
    // {}
    // Close user data stream (USER_STREAM)
    // DELETE /api/v1/userDataStream
    // Close out a user data stream.










    //'api key format invalid'
    getHistoricalTrades:(symbol, limit, formId = null) => {//limit max 1000 formId - trade id to fetch from -default 500 max 1000
        let uri = `${baseEndpoint}${apiV1}historicalTrades?symbol=${symbol}&limit=${limit}`;
        uri = formId ? uri + `&formId=${formId}` : uri; 
        return RequestService.getRP(uri, '');
    },
}

module.exports = BinanceService;