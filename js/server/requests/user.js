/**
 * Created by Cubla on 03.11.2017.
 */

var request = require('request');

var user = {
    characters: function (_data) {
        var token_id = _data.event.token_id;
        var error_reason = "";
        var error_id = "";

        if (ward.tokens().check_token(token_id)) {
            var t = ward.tokens().get_token(token_id);
            var uid = t.user_id;
            var user = ward.users().get_user_by_id(uid);
            var char_out = [];

            if(!user.data){
                ward.dispatcher().send(_data.connection_id, _data.server_id, {
                    client_id: _data.client_id,
                    success: false,
                    //characters: char_out,
                    command_addr: ["response_characters"]
                });
                return;
            }

            var char_list = user.data.eve_data.characters;
            for (var k in char_list) {
                if (!char_list.hasOwnProperty(k)) return;
                var char_data = char_list[k];
                char_out.push({
                    id: k,
                    char_name: char_data.char_name,
                    images: char_data.images
                });
            }
            ward.dispatcher().send(_data.connection_id, _data.server_id, {
                client_id: _data.client_id,
                success: true,
                characters: char_out,
                command_addr: ["response_characters"]
            });
        }
    },
    remove_character: function (_data) {
        var token_id = _data.event.token_id;
        var char_id = _data.event.char_id;
        if (ward.tokens().check_token(token_id)) {
            var t = ward.tokens().get_token(token_id);
            var uid = t.user_id;
            var user = ward.users().get_user_by_id(uid);
            var char_list = user.data.eve_data.characters;
            delete char_list[char_id];
            ward.db().save();
            ward.dispatcher().send(_data.connection_id, _data.server_id, {
                client_id: _data.client_id,
                success: true,
                command_addr: ["response_remove_character"]
            });
        }
    }


    /*characters: function (_data) {
        var token_id = _data.event.token_id;
        var error_reason = "";
        var error_id = "";
        ward.tokens().check_token(token_id).then(function (_tdata) {
            var user_id = _tdata.user_id;

            return ward.users().get_user_by_id(user_id);
        }.bind(this), function () {
            error_reason = ERROR.BAD_TOKEN;
            error_id = ERROR.BAD_TOKEN;
        }.bind(this)).then(function (_user_data) {
            //user_data.eve_accounts

            var chars = [];
            for(var k in _user_data.data.eve_accounts) {
                if(!_user_data.data.eve_accounts.hasOwnProperty(k)) return;

                var char_data = _user_data.data.eve_accounts[k];
                chars.push({
                    id: k,
                    char_name: char_data.char_name
                });
            }

            ward.dispatcher().send(_data.connection_id, _data.server_id, {
                client_id: _data.client_id,
                success: true,
                chars: chars,
                command_addr: ["response_characters"]
            });
        }.bind(this), function (_reason) {
            error_reason = ERROR.CHAR_ERROR;
            error_id = ERROR.CHAR_ERROR;
            //debugger;

            ward.dispatcher().send(_data.connection_id, _data.server_id, {
                client_id: _data.client_id,
                success: false,
                reason: error_reason + ": " + _reason,
                error_id: error_id,
                command_addr: ["response_characters"]
            });
            // failed on get user data
        }.bind(this));
    }*/
};

var request_ccp_auth = function (_code) {
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

var request_refresh_token = function (_refresh_token) {
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

var request_user_data = function (_access_token) {
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


module.exports = {
    requests: {
        characters: user.characters,
        remove_character: user.remove_character
    }
};

var ERROR = {
    CHAR_ERROR: "CHAR_ERROR",
    ATTACH_FAILED: "ATTACH_FAILED",
    CCP_DATA_FAILED: "CCP_DATA_FAILED",
    CCP_AUTH_FAILED: "CCP_AUTH_FAILED",
    BAD_TOKEN: "BAD_TOKEN",
    USER_NOT_EXIST: "USER_NOT_EXIST",
    SHORTER_PASSWORD: "SHORTER_PASSWORD",
    INVALID_MAIL: "INVALID_MAIL",
    PASSWORDS_NOT_MATCH: "PASSWORDS_NOT_MATCH",
    PASSWORD_INCORRECT: "PASSWORD_INCORRECT",
    ALREADY_EXIST: "ALREADY_EXIST",
    UNKNOWN: "UNKNOWN"
};



