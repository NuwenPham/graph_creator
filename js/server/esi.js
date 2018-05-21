/**
 * Created by Cubla on 13.05.2018.
 */
var request = require('request');

var CLIENT_ID = config.eve_application_data.client_id;
var SECRET_KEY = config.eve_application_data.secret_key;

var SSO_HOST = config.eve_sso_server.host;
var SSO_PROTO = config.eve_sso_server.proto;
var SSO_CONTENT_TYPE = config.eve_sso_server.content_type;

var __esi_oauth_token = function (_code, _callback) {
    var res = CLIENT_ID + ":" + SECRET_KEY;
    var encoded = new Buffer(res).toString('base64');
    var options = {
        url: SSO_PROTO + "//"+SSO_HOST+"/oauth/token",
        headers: {
            Authorization: "Basic " + encoded,
            "Content-Type": SSO_CONTENT_TYPE,
            Host: SSO_HOST
        },
        form: {
            grant_type: "authorization_code",
            code: _code
        }
    };

    request.post(options, function (error, response, body) {
        _callback(error, response, JSON.parse(body));
    }.bind(this));
};

var __esi_oauth_verify = function (_access_token, _callback) {
    var options = {
        url: SSO_PROTO + "//" + SSO_HOST + "/oauth/verify",
        headers: {
            Authorization: "Bearer " + _access_token,
            Host: SSO_HOST
        }
    };

    request.get(options, function (error, response, body) {
        _callback(error, response, JSON.parse(body));
    }.bind(this));
};

var __sso_oath_refresh_token = function (_refresh_token, _callback) {
    var res = CLIENT_ID + ":" + SECRET_KEY;
    var encoded = new Buffer(res).toString('base64');
    var options = {
        url: SSO_PROTO + "//" + SSO_HOST + "/oauth/token",
        headers: {
            Authorization: "Basic " + encoded,
            "Content-Type": SSO_CONTENT_TYPE,
            Host: SSO_HOST
        },
        form: {
            grant_type: "refresh_token",
            refresh_token: _refresh_token
        }
    };

    request.post(options, function (error, body, data) {
        _callback(error, body, JSON.parse(data))
    }.bind(this));
};


var __esi_characters_portrait = function (_char_id, _callback) {
    var path = "dev/characters/" + _char_id + "/portrait/";
    return rsys.get_public(path, {}, _callback);
};

var __esi_location_current = function (_access_token, _char_id, _callback) {
    var path = "latest/characters/" + _char_id + "/location/";
    return rsys.get_bearer(_access_token, path, {}, _callback);
};

var __esi_location_online = function (_access_token, _char_id, _callback) {
    var path = "dev/characters/" + _char_id + "/online/";
    return rsys.get_bearer(_access_token, path, {}, _callback);
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
    ouath: {
        refresh_token: __sso_oath_refresh_token,
        token: __esi_oauth_token,
        verify: __esi_oauth_verify
    },
    alliance: {
        all: __esi_alliance_all,
        get: __esi_alliance_get
    }
};


module.exports = esi;