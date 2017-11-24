/**
 * Created by Cubla on 19.08.2017.
 */

var _game = require("./../game/game.js");
var _field_requests = require("./field.js");
var request = require('request');
var promise = require("./../utils/promise.js");

var game = {
    reg: function (_data) {

        var mail = _data.event.mail;
        var pass_1 = _data.event.pass_1;
        var pass_2 = _data.event.pass_2;

        if (!check_mail(mail)) {
            ward.dispatcher().send(_data.connection_id, _data.server_id, {
                client_id: _data.client_id,
                command_addr: ["response_reg"],
                success: false,
                text: "invalid mail",
                error_id: ERROR.INVALID_MAIL
            });
            return;
        }

        if (pass_1.length < 4) {
            ward.dispatcher().send(_data.connection_id, _data.server_id, {
                client_id: _data.client_id,
                command_addr: ["response_reg"],
                success: false,
                text: "password shorter than 4 symbols",
                error_id: ERROR.SHORTER_PASSWORD
            });
            return;
        }

        if (pass_1 != pass_2) {
            ward.dispatcher().send(_data.connection_id, _data.server_id, {
                client_id: _data.client_id,
                command_addr: ["response_reg"],
                success: false,
                text: "passwords do not match",
                error_id: ERROR.PASSWORDS_NOT_MATCH
            });
            return;
        }

        ward.users().add_user(mail, {
            pass: pass_1,
            eve_data: {}
        }).then(function (_uid) {
            // if success added
            var token = ward.tokens().create_token(_uid, 1000 * 60 * 60 * 24);

            ward.dispatcher().send(_data.connection_id, _data.server_id, {
                client_id: _data.client_id,
                user_id : _uid,
                token: token,
                success: true,
                command_addr: ["response_reg"]
            });
        }.bind(this), function (_err) {
            // if not added

            if(_err == "already_exist"){
                ward.dispatcher().send(_data.connection_id, _data.server_id, {
                    client_id: _data.client_id,
                    command_addr: ["response_reg"],
                    success: false,
                    text: _err,
                    error_id: ERROR.ALREADY_EXIST
                });
                return;
            }


            ward.dispatcher().send(_data.connection_id, _data.server_id, {
                client_id: _data.client_id,
                command_addr: ["response_reg"],
                success: false,
                origin_error_msg: _err,
                text: "unknown error",
                error_id: ERROR.UNKNOWN
            });
        }.bind(this)).then(function () {




        }.bind(this));

    },
    auth: function (_data) {
        var mail = _data.event.mail;
        var pass = _data.event.pass_1;

        if (!check_mail(mail)) {
            ward.dispatcher().send(_data.connection_id, _data.server_id, {
                client_id: _data.client_id,
                command_addr: ["response_auth"],
                success: false,
                text: "invalid mail",
                error_id: ERROR.INVALID_MAIL
            });
            return;
        }

        ward.users().get_user_by_mail(mail).then(function (_event) {
            if(_event.data.pass != pass){
                // incorrect password
                ward.dispatcher().send(_data.connection_id, _data.server_id, {
                    client_id: _data.client_id,
                    command_addr: ["response_auth"],
                    success: false,
                    text: "incorrect password",
                    error_id: ERROR.PASSWORD_INCORRECT
                });
                return;
            }

            ward.users().get_user_by_mail(mail).then(function (_user_data) {
                var token = ward.tokens().create_token(_user_data.id, 1000 * 60 * 60 * 24);

                ward.dispatcher().send(_data.connection_id, _data.server_id, {
                    client_id: _data.client_id,
                    success: true,
                    user_id: _user_data.id,
                    token: token,
                    command_addr: ["response_auth"]
                });

            }.bind(this), function () {
                ward.dispatcher().send(_data.connection_id, _data.server_id, {
                    client_id: _data.client_id,
                    command_addr: ["response_auth"],
                    success: false,
                    text: "user not exist",
                    error_id: ERROR.USER_NOT_EXIST
                });
            }.bind(this));


        }.bind(this), function (_err) {
            ward.dispatcher().send(_data.connection_id, _data.server_id, {
                client_id: _data.client_id,
                command_addr: ["response_auth"],
                success: false,
                text: "user do not exist",
                error_id: ERROR.USER_NOT_EXIST
            });
        }.bind(this));

    },

    check_token: function (_data) {
        var token_id = _data.event.token_id;

        ward.tokens().check_token(token_id).then(function () {
            ward.dispatcher().send(_data.connection_id, _data.server_id, {
                client_id: _data.client_id,
                success: true,
                command_addr: ["response_check_token"]
            });
        }.bind(this), function () {
            ward.dispatcher().send(_data.connection_id, _data.server_id, {
                client_id: _data.client_id,
                success: false,
                command_addr: ["response_check_token"]
            });
        }.bind(this));
    },

    ccp_auth: function (_data) {
        var code = _data.event.code;
        var token_id = _data.event.token_id;

        var access_token = "";
        var token_type = "";
        var expires_in = -1;
        var refresh_token = "";

        var user_id = -1;
        var mail = "";
        var error_reason = null;
        var error_id = -1;

        ward.tokens().check_token(token_id).then(function (_data) {
            user_id = _data.user_id;
            return ward.users().get_user_mail_by_id(user_id)
        }.bind(this), function () {
            // failed on check_token
            error_reason = "user not exist";
            error_id = ERROR.BAD_TOKEN;
        }.bind(this)).then(function (_mail) {
            mail = _mail;
            return request_ccp_auth(code);
        }.bind(this), function () {
            // failed on get mail
            error_reason = !error_reason && "failed on get mail";
            error_id = ERROR.USER_NOT_EXIST;
        }.bind(this)).then(function (_response_data) {
            access_token = _response_data.access_token;
            token_type = _response_data.token_type;
            expires_in = _response_data.expires_in;
            refresh_token = _response_data.refresh_token;
            return request_user_data(access_token);
        }.bind(this), function (_data) {
            // failed on auth
            error_reason = !error_reason && "failed on ccp auth (no response from ccp server)";
            error_id = ERROR.CCP_AUTH_FAILED;
        }.bind(this)).then(function (_user_data) {
            return ward.users().attach_eve_account(mail, {
                char_id: _user_data.CharacterID,
                char_name: _user_data.CharacterName,
                expires_on: _user_data.ExpiresOn,
                scopes: _user_data.Scopes,
                character_owner_hash: _user_data.CharacterOwnerHash,
                access_token: access_token,
                token_type: _user_data.TokenType,
                refresh_token: refresh_token,
            });
        }.bind(this), function () {
            // failed on request user data
            error_reason = !error_reason && "failed on request user data";
            error_id = ERROR.CCP_DATA_FAILED;
        }.bind(this)).then(function () {
            ward.dispatcher().send(_data.connection_id, _data.server_id, {
                client_id: _data.client_id,
                success: true,
                command_addr: ["response_ccp_auth"]
            });
        }.bind(this), function () {
            // failed on attach account
            error_reason = !error_reason && "failed on attach account";
            error_id = ERROR.ATTACH_FAILED;
            ward.dispatcher().send(_data.connection_id, _data.server_id, {
                client_id: _data.client_id,
                success: false,
                reason: error_reason,
                error_id: error_id,
                command_addr: ["response_ccp_auth"]
            });
        }.bind(this));

    }
};

var request_ccp_auth = function (_code) {
    var p = new promise();

    var client_id = "804ba189451a4b12af36a1f770d9a12d";
    var sec_key = "ycOmcLziPYTsCydxIxAgdhEsILr7hzRAgMKCzQBu";
    var res = client_id + ":" + sec_key;
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

    var client_id = "804ba189451a4b12af36a1f770d9a12d";
    var sec_key = "ycOmcLziPYTsCydxIxAgdhEsILr7hzRAgMKCzQBu";
    var res = client_id + ":" + sec_key;
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
}

var check_mail = function (_mail) {
    return true;
};

module.exports = {
    requests: {
        reg: game.reg,
        auth: game.auth,
        check_token: game.check_token,
        user_chars: game.user_chars,
        ccp_auth: game.ccp_auth
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