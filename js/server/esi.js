/**
 * Created by Cubla on 13.05.2018.
 */
var request = require('request');

var _esi_bearer_request = function (_type, _access_token, _path, _options, _headers) {
    var p = new promise();

    _type = _type || "get";

    var host = "http://esi.evetech.net/";
    var addr = host + _path + "?datasource=tranquility";

    console.log("\n%s", addr);
    var options = {
        url: addr,
        headers: {
            Authorization: "Bearer " + _access_token,
            "Content-Type": "application/json",
            Host: "esi.tech.ccp.is"
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
                setTimeout(function () {request[_type](options, on_response);}, 1000);
            } else {
                p.reject(_error);
            }
        }
    }.bind(this);
    request[_type](options, on_response);

    return p.native;
};

var _esi_public_request = function (_type, _path, _options) {
    var p = new promise();

    _type = _type || "get";

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
            if (cur_tries < tries) {
                cur_tries++;
                setTimeout(function () {request[_type](options, on_response);}, 1000);
            } else {
                p.reject(_error);
            }
        }
    }.bind(this);
    request[_type](options, on_response);

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
    return _esi_public_request("get", path);
};

var __esi_location_current = function (_access_token, _char_id) {
    var path = "dev/characters/" + _char_id + "/location/";
    return _esi_bearer_request("get",_access_token, path);
};

var __esi_location_online = function (_access_token, _char_id) {
    var path = "dev/characters/" + _char_id + "/online/";
    return _esi_bearer_request("get",_access_token, path);
};

var __esi_location_ship = function (_access_token, _char_id) {
    var path = "dev/characters/" + _char_id + "/ship/";
    return _esi_bearer_request("get",_access_token, path);
};


var __esi_alliance_all = function (_access_token) {
    var path = "dev/alliances/";
    return _esi_bearer_request("get", _access_token, path);
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
    request: _esi_bearer_request,
    ouath: {
        token: __esi_oauth_token,
        verify: __esi_oauth_verify
    }
};


module.exports = esi;