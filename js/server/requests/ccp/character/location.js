/**
 * Created by Cubla on 03.12.2017.
 */
var request = require('request');

var update_access_token = function (_data) {
    var token_id = _data.event.token_id;
    var access_token;
    var refresh_token;
    ward.tokens().get_token(token_id).then(function (_data) {
        var user_id = _data.user_id;
        return ward.users().get_user_by_id(user_id);
    }, function () {
        // failed get token
        debugger;
    }).then(function (_data) {
        var accounts = _data.data.eve_accounts;
        var acc = accounts[Object.keys(accounts)[0]];
        return __request_refresh_token(acc.refresh_token);
    }, function () {
        // failed get user by id
        debugger;
    }).then(function (_data) {
        access_token = _data.access_token;
        refresh_token = _data.refresh_token;
        ward.users().update_account_data()
        debugger;
    }, function (_error) {
        // failed refresh access token
        debugger;
    })
};

/**
 * This method save char location data to db and response location and structure
 * Next step. make it for all accounts
 * @param _data
 */
var current = function (_data) {
    var origin_data = _data;
    var token_id = _data.event.token_id;
    var user_id;
    var acc_id;
    var access_token;
    var error_reason = null;
    var error_id = -1;
    var solar_system_id;
    var structure_id = -1;
    ward.tokens().get_token(token_id).then(function (_data) { // request user_id by token
        user_id = _data.user_id;
        return ward.users().get_user_by_id(user_id); // request user data by user_id
    }, function () {
        // failed get token
        error_reason = !error_reason && "bad token";
        error_id = _ERROR.BAD_TOKEN;
    }).then(function (_data) {
        var accounts = _data.data.eve_accounts;
        acc_id = Object.keys(accounts)[0];
        var acc = accounts[acc_id];
        return __request_refresh_token(acc.refresh_token); // refresh access token
    }, function () {
        // failed get user by id
        error_reason = !error_reason && "USER_NOT_EXIST";
        error_id = _ERROR.USER_NOT_EXIST;
    }).then(function (_data) {
        access_token = _data.access_token;
        return __request_location(access_token, acc_id); // request account location
    }, function () {
        // failed on get update_account_data
        error_reason = !error_reason && "acc_id or something else wrong";
        error_id = _ERROR.ACCOUNT_DATA_ERROR;
    }).then(function (_data) {
        solar_system_id = _data.solar_system_id;
        structure_id = _data.structure_id || -1;
        var data = {
            solar_system_id: _data.solar_system_id,
            structure_id: _data.structure_id
        };
        return ward.users().update_account_data(user_id, acc_id, data); // update user data
    }, function () {
        // failed on get loc
        error_reason = !error_reason && "location wrong";
        error_id = _ERROR.WRONG_LOCATION;
    }).then(function(){
        return __request_system(access_token, solar_system_id); // request system data
    }, function () {
        error_reason = !error_reason && "bad data";
        error_id = _ERROR.WRONG_DATA;
    }).then(function (_data) {
        var system_name = _data.name;
        ward.dispatcher().send(origin_data.connection_id, origin_data.server_id, {
            client_id: origin_data.client_id,
            structure_id: structure_id,
            system_name: system_name,
            solar_system_id: solar_system_id,
            success: true,
            command_addr: ["response_current"]
        });
    }, function () {
        error_reason = !error_reason && "bad system id";
        error_id = _ERROR.WRONG_SYSTEM_ID;
        ward.dispatcher().send(_data.connection_id, _data.server_id, {
            client_id: _data.client_id,
            success: false,
            reason: error_reason,
            error_id: error_id,
            command_addr: ["response_current"]
        });
    })
};



var __request_refresh_token = function (_refresh_token) {
    var p = new promise();

    var res = _CLIENT_ID + ":" + _SECRET_KEY;
    var encoded = new Buffer(res).toString('base64');
    var options = {
        url: 'https://login.eveonline.com/oauth/token',
        headers: {
            Authorization: "Basic " + encoded,
            "Content-Type": "application/json",
            Host: "login.eveonline.com"
        },
        form: {
            grant_type: "refresh_token",
            refresh_token: _refresh_token
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

var _esi_request = function (_access_token, _path, _options) {
    var p = new promise();

    var host = "https://esi.tech.ccp.is/";
    var addr = host + _path + "?datasource=tranquility";

    console.log("\n%s", addr);
    var options = {
        url: addr,
        headers: {
            Authorization: "Bearer " + _access_token,
            "Content-Type": "application/json"
        },
        form: _options || {}
    };

    request.get(options, function (error, response, body) {
        if (!error) {
            console.log("ESI RESPONSE");
            console.log(body);
            console.log("");
            p.resolve(JSON.parse(body));
        } else {
            p.reject(error);
        }
    }.bind(this));

    return p.native;
};

var __request_location = function (_access_token, _char_id) {
    var path = "latest/characters/" + _char_id + "/location/";
    return _esi_request(_access_token, path);
};

var __request_system = function (_access_token, _system_id) {
    var path = "latest/universe/systems/" + _system_id + "/";
    return _esi_request(_access_token, path);
};


module.exports = {
    requests: {
        update_access_token: update_access_token,
        current: current
    }
};