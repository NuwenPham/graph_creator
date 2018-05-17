/**
 * Created by Cubla on 13.05.2018.
 */
var request = require('request');

var sr = require("./utils/request");

var _esi_bearer_get_request = function (_access_token, _path, _options) {
    var p = new promise();

    var host = "http://esi.evetech.net/";
    var addr = host + _path;

    var base_opts = Object.extend({
        //token: _access_token,
        datasource: "tranquility"
    }, _options);

    var arr = [];
    for (var k in base_opts) {
        var val = base_opts[k];
        arr.push(k + "=" + val);
    }
    var query = arr.join("&");
    addr += "?" + query;

    console.log("REQUEST:\n%s", addr);
    var options = {
        url: addr,
        pool: {maxSockets: Infinity},
        port: 443,
        headers: {
            Authorization: "Bearer " + _access_token,
            "Content-Type": "application/json",
            Host: "esi.evetech.net"
        }
    };

    var tries = 3;
    var cur_tries = 0;
    var start_time = +new Date;
    var on_response = function (_error, _, _data) {
        console.log("response time: ", (+new Date - start_time));
        if (!_error) {
            console.log("%cESI RESPONSE", "color:#fff;");
            console.log(_data);
            console.log("");
            p.resolve(JSON.parse(_data));
        } else {
            //if (cur_tries < tries) {
            //    cur_tries++;
            //    setTimeout(function () {
            //        request.get(options, on_response);
            //    }, 1000);
            //} else {
            //    p.reject(_error);
            //}

            if(_error.code == "ETIMEDOUT"){
                p.reject(_error);
            }
        }
    }.bind(this);
    request.get(options, on_response);

    return p.native;
};

var _esi_bearer_post_request = function (_access_token, _path, _options) {
    var p = new promise();

    var host = "http://esi.evetech.net/";
    var addr = host + _path;

    var base_opts = {
        datasource: "tranquility"
    };

    var arr = [];
    for (var k in base_opts) {
        var val = base_opts[k];
        arr.push(k + "=" + val);
    }
    var query = arr.join("&");
    addr += "=" + query;

    console.log("REQUEST: \n%s", addr);
    var options = {
        url: addr,
        headers: {
            Authorization: "Bearer " + _access_token,
            "Content-Type": "application/json",
            Host: "esi.evetech.net"
        },
        form: _options || {}
    };

    var tries = 3;
    var cur_tries = 0;
    var start_time = +new Date;
    var on_response = function (_error, _, _data) {
        console.log("response time: ", (+new Date - start_time));
        if (!_error) {
            console.log("%cESI RESPONSE", "color:#fff;");
            console.log(_data);
            console.log("");
            p.resolve(JSON.parse(_data));
        } else {
            if (cur_tries < tries) {
                cur_tries++;
                setTimeout(function () {request.post(options, on_response);}, 1000);
            } else {
                p.reject(_error);
            }
        }
    }.bind(this);
    request.post(options, on_response);

    return p.native;
};



var _esi_public_get_request = function (_path, _options) {
    var p = new promise();

    var host = "esi.evetech.net";
    var addr = host + "/" + _path;

    var base_opts = Object.extend({
        datasource: "tranquility"
    }, _options);

    var arr = [];
    for (var k in base_opts){
        var val = base_opts[k];
        arr.push( k + "=" + val);
    }
    var query = arr.join("&");
    addr += "?" + query;

    console.log("GET REQUEST:\n%s", addr);
    var options = {
        host: host,
        protocol:"https:",
        agent: false,
        path: "/" + _path,
        headers: {
            //Authorization: "Bearer " + _access_token,
            "Content-Type": "application/json",
            Host: "esi.evetech.net"
        }
    };

    var tries = 3;
    var cur_tries = 0;
    var start_time = +new Date;
    var on_response = function (_error, _body, _data, _req) {
        console.log("response time: ", (+new Date - start_time));
        if (!_error) {
            console.log("ESI GET RESPONSE");
            console.log("");
            //console.log("x-esi-error-limit-remain", _body.headers["x-esi-error-limit-remain"]);
            //console.log("x-esi-error-limit-reset", _body.headers["x-esi-error-limit-reset"]);
            //console.log(_data);
            console.log(_body.headers);
            p.resolve(JSON.parse(_data), _body.headers, _req);
        } else {
            //if (cur_tries < tries) {
            //    cur_tries++;
            //    setTimeout(function () {request.get(options, on_response);}, 1000);
            //} else {
                p.reject([_error, _body]);
            //}
        }
    }.bind(this);
    sr.get(options, on_response);

    return p.native;
};


var _esi_public_get_request_old = function (_path, _options) {
    var p = new promise();

    var host = "https://esi.evetech.net/";
    var addr = host + _path;

    var base_opts = Object.extend({
        datasource: "tranquility"
    }, _options);

    var arr = [];
    for (var k in base_opts){
        var val = base_opts[k];
        arr.push( k + "=" + val);
    }
    var query = arr.join("&");
    addr += "?" + query;

    console.log("REQUEST:\n%s", addr);
    var options = {
        url: addr
    };

    var tries = 3;
    var cur_tries = 0;
    var start_time = +new Date;
    var on_response = function (_error, _body, _data) {
        console.log("response time: ", (+new Date - start_time));
        if (!_error) {
            console.log("ESI RESPONSE");
            console.log(_body.headers);
            console.log(_data);
            console.log("");
            p.resolve(JSON.parse(_data, _body.headers));
        } else {
            //if (cur_tries < tries) {
            //    cur_tries++;
            //    setTimeout(function () {request.get(options, on_response);}, 1000);
            //} else {
                p.reject(_error);
            //}
        }
    }.bind(this);
    request.get(options, on_response);

    return p.native;
};
var _esi_public_post_request = function (_path, _options) {
    var p = new promise();

    var host = "http://esi.evetech.net/";
    var addr = host + _path + "?datasource=tranquility";

    console.log("\n%s", addr);
    var options = {
        url: addr,
        form: _options || {}
    };

    var tries = 3;
    var cur_tries = 0;
    var start_time = +new Date;
    var on_response = function (_error, _, _data) {
        console.log("response time: ", (+new Date - start_time));
        if (!_error) {
            console.log("%cESI RESPONSE", "color:#fff;");
            console.log(_data);
            console.log("");
            p.resolve(JSON.parse(_data));
        } else {
            //if (cur_tries < tries) {
            //    cur_tries++;
            //    setTimeout(function () {request.post(options, on_response);}, 1000);
            //} else {
            //    p.reject(_error);
            //}
            p.reject(_error);
        }
    }.bind(this);
    request.post(options, on_response);

    return p.native;
};
var __esi_oauth_token = function (_code) {
    var p = new promise();

    var res = _CLIENT_ID + ":" + _SECRET_KEY;
    var encoded = new Buffer(res).toString('base64');
    var options = {
        url: 'https://login.eveonline.com/oauth/token',
        headers: {
            Authorization: "Basic " + encoded,
            "Content-Type": "application/x-www-form-urlencoded",
            Host: "login.eveonline.com"
        },
        form: {
            grant_type: "authorization_code",
            code: _code
        }
    };

    request.post(options, function (error, response, body) {
        if (!error) {
            console.log(body);
            p.resolve(JSON.parse(body));
        } else {
            p.reject(error);
        }
    }.bind(this));

    return p.native;
};

var __esi_oauth_verify = function (_access_token) {
    var p = new promise();

    var options = {
        url: 'https://login.eveonline.com/oauth/verify',
        headers: {
            Authorization: "Bearer " + _access_token,
            Host: "login.eveonline.com"
        }
    };

    request.get(options, function (error, response, body) {
        if (!error) {
            console.log(body);
            p.resolve(JSON.parse(body));
        } else {
            p.reject(error);
        }
    }.bind(this));

    return p.native;
};


var __esi_characters_portrait = function ( _char_id) {
    var path = "dev/characters/" + _char_id + "/portrait/";
    return _esi_public_get_request(path);
};

var __esi_location_current = function (_access_token, _char_id) {
    var path = "latest/characters/" + _char_id + "/location/";
    return _esi_bearer_get_request(_access_token, path);
};

var __esi_location_online = function (_access_token, _char_id) {
    var path = "dev/characters/" + _char_id + "/online/";
    return _esi_bearer_get_request(_access_token, path);
};

var __esi_location_ship = function (_access_token, _char_id) {
    var path = "dev/characters/" + _char_id + "/ship/";
    return _esi_bearer_get_request(_access_token, path);
};


var __esi_alliance_all = function () {
    var path = "dev/alliances/";
    return _esi_public_get_request(path);
};


var __esi_alliance_get = function (_alli_id) {
    var path = "latest/alliances/" + _alli_id + "/";
    return _esi_public_get_request(path);
};




//
//
//var request_user_data = function (_access_token) {
//    var p = new promise();
//
//    var options = {
//        url: 'https://login.eveonline.com/oauth/verify',
//        headers: {
//            Authorization: "Bearer " + _access_token,
//            Host: "login.eveonline.com"
//        }
//    };
//
//    request.get(options, function (error, response, body) {
//        if (!error) {
//            console.log(body);
//            p.resolve(JSON.parse(body));
//        } else {
//            p.reject(error);
//        }
//    }.bind(this));
//
//    return p.native;
//}


var esi = {
    location: {
        current: __esi_location_current,
        online: __esi_location_online,
        ship: __esi_location_ship
    },
    characters: {
        portrait: __esi_characters_portrait
    },
    //request: _esi_bearer_request,
    ouath: {
        token: __esi_oauth_token,
        verify: __esi_oauth_verify
    },
    alliance: {
        all: __esi_alliance_all,
        get: __esi_alliance_get
    }
};


module.exports = esi;