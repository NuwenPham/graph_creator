/**
 * Created by Cubla on 13.05.2018.
 */
var request = require('request');

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


var __esi_characters_portrait = function (_char_id, _callback) {
    var path = "dev/characters/" + _char_id + "/portrait/";
    return rsys.get_public(path, {}, _callback);
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

var __esi_alliance_all = function (_callback) {
    var path = "dev/alliances/";
    return rsys.get_public(path, {}, _callback);
};

var __esi_alliance_get = function (_alli_id, _callback) {
    var path = "dev/alliances/" + _alli_id + "/";
    return rsys.get_public(path, {}, _callback);
};

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