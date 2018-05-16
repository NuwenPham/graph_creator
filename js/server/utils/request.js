/**
 * Created by Cubla on 15.05.2018.
 */
var https = require('https');

var __http_request = function (_options, _callback) {
    var base = Object.extend({
        method: "post"
    }, _options);

    switch (base.method){
        case "post":
        case "get":
            __post(_options, _callback);
            break;
    }
};
var __post = function (_options, _callback) {
    var base = Object.extend({
        form: {},
        host: "localhost",
        port: 443,
        timeout: 120000,
        agent: false,
        path: "/",
        method: "POST"
    }, _options);

    var headers = {
        "Content-Type": 'application/x-www-form-urlencoded',
        "Content-Length": Buffer.byteLength(JSON.stringify(base.form))
    };

    _options.headers && Object.extend(headers, _options.headers);

    var options = {
        host: base.host,
        hostname: base.host,
        port: base.port,
        path: base.path,
        timeout: base.timeout,
        agent: base.agent,
        method: base.method,
        headers: headers
    };

    var req = https.request(options, function (_response) {
        var data = "";
        _response.setEncoding("utf8");
        _response.on("data", function (_chunk) {
            data += _chunk;
        });
        _response.on("end", function () {
            _callback(false, data);
        });
    });

    req.on("error", function (_e) {
        console.error("problem with request: ", _e.message);
        _callback(_e);
    });

    // write data to request body
    req.write(JSON.stringify(base.form));
    req.end();
};


var __get = function (_options, _callback) {
    var base = Object.extend({
        form: {},
        host: "localhost",
        //port: 80,
        timeout: 2000,
        agent: false,
        path: "/",
        method: "GET"
    }, _options);

    var headers = {
        //"Content-Type": 'application/json',
        //"Content-Length": Buffer.byteLength(JSON.stringify(base.form))
    };

    _options.headers && Object.extend(headers, _options.headers);

    var options = {
        host: base.host,
        port: base.port,
        path: base.path,
        timeout: base.timeout,
        agent: base.agent,
        method: base.method,
        headers: headers
    };

    var req = https.request(options, function (_response) {
        var data = "";
        _response.setEncoding("utf8");
        _response.setTimeout(0);
        _response.on("data", function (_chunk) {
            data += _chunk;
        });
        _response.on("end", function () {
            _callback(false, this, data, req);
        });
    });

    req.on("error", function (_e) {
        console.error("problem with request: ", _e.message);
        _callback(_e, req);
    });

    req.setTimeout(200000);

    // write data to request body
    req.write(JSON.stringify(base.form));
    req.end();
};


module.exports = {
    get: __get
};
