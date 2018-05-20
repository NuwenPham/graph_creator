/**
 * Created by Cubla on 19.08.2017.
 */

//var request = require('request');
var esi = require("./../esi");

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

        var uid = ward.users().add_user({
            mail: mail,
            password: pass_1
        });

        if (uid >= 0) {
            ward.save();
            var token = ward.tokens().create_token(uid, 1000 * 60 * 60 * 24);
            ward.dispatcher().send(_data.connection_id, _data.server_id, {
                client_id: _data.client_id,
                user_id: uid,
                token: token,
                success: true,
                command_addr: ["response_reg"]
            });
        } else {
            ward.dispatcher().send(_data.connection_id, _data.server_id, {
                client_id: _data.client_id,
                command_addr: ["response_reg"],
                success: false,
                text: "already_exist",
                error_id: ERROR.ALREADY_EXIST
            });
        }
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

        var user = ward.users().get_user_by_mail(mail);

        if (!user) {
            ward.dispatcher().send(_data.connection_id, _data.server_id, {
                client_id: _data.client_id,
                command_addr: ["response_auth"],
                success: false,
                text: "user not exist",
                error_id: ERROR.USER_NOT_EXIST
            });
            return;
        }


        if (user.password() != pass) {
            ward.dispatcher().send(_data.connection_id, _data.server_id, {
                client_id: _data.client_id,
                command_addr: ["response_auth"],
                success: false,
                text: "incorrect password",
                error_id: ERROR.PASSWORD_INCORRECT
            });
            return;
        }

        //var tid = ward.tokens().get_token_by_uid(user.index);
        var token = ward.tokens().create_token(user.id(), 1000 * 60 * 60 * 24);
        ward.dispatcher().send(_data.connection_id, _data.server_id, {
            client_id: _data.client_id,
            success: true,
            user_id: user.id(),
            token: token,
            command_addr: ["response_auth"]
        });


    },

    check_token: function (_data) {
        var token_id = _data.event.token_id;
        if (ward.tokens().check_token(token_id)) {
            ward.dispatcher().send(_data.connection_id, _data.server_id, {
                client_id: _data.client_id,
                success: true,
                command_addr: ["response_check_token"]
            });
        } else {
            ward.dispatcher().send(_data.connection_id, _data.server_id, {
                client_id: _data.client_id,
                success: false,
                command_addr: ["response_check_token"]
            });
        }
    },

    ccp_auth: function (_data) {
        var code = _data.event.code;
        var token_id = _data.event.token_id;

        var access_token = "";
        var token_type = "";
        var expires_in = -1;
        var refresh_token = "";

        if (ward.tokens().check_token(token_id)) {
            console.log("auth_part_0: inner token success");
            esi.ouath.token(code, function (_err, _body, _response_data) {
                console.log("auth_part_1: ccp auth success");
                if (_err) {
                    send_error(_response_data, "failed on ccp auth (no response from ccp server)", ERROR.CCP_AUTH_FAILED);
                    return;
                }

                access_token = _response_data.access_token;
                token_type = _response_data.token_type;
                expires_in = _response_data.expires_in; // seconds ?? (not sure)
                refresh_token = _response_data.refresh_token;

                esi.ouath.verify(access_token, function (_err, _body, _user_data) {
                    console.log("auth_part_2: char data success: (" + _user_data.CharacterID + ")");

                    if (_err) {
                        send_error(_data, "failed on request user data", ERROR.CCP_DATA_FAILED);
                        return;
                    }

                    esi.characters.portrait(_user_data.CharacterID, function (_err, _body, _images) {
                        console.log("auth_part_3: portrait");
                        var user_id = ward.tokens().get_token(token_id).user_id;
                        var user = ward.users().get_user_by_id(user_id);
                        user.add_eve_char({
                            id: _user_data.CharacterID,
                            char_name: _user_data.CharacterName,
                            expires_on: _user_data.ExpiresOn,
                            expires_in: expires_in,
                            real_expires_in: +new Date + expires_in * 1000,
                            scopes: _user_data.Scopes,
                            character_owner_hash: _user_data.CharacterOwnerHash,
                            access_token: access_token,
                            token_type: _user_data.TokenType,
                            images: _images,
                            refresh_token: refresh_token
                        });
                        ward.dispatcher().send(_data.connection_id, _data.server_id, {
                            client_id: _data.client_id,
                            success: true,
                            command_addr: ["response_ccp_auth"]
                        });
                        ward.save();
                    });

                }.bind(this));
            }.bind(this));
        } else {
            send_error(_data, "user not exist", ERROR.BAD_TOKEN);
        }

        var send_error = function (_data, _error_reason, _error_id) {
            ward.dispatcher().send(_data.connection_id, _data.server_id, {
                client_id: _data.client_id,
                success: false,
                reason: _error_reason,
                error_id: _error_id,
                command_addr: ["response_ccp_auth"]
            });
        }

    },
    ccp_auth_old: function (_data) {
        var code = _data.event.code;
        var token_id = _data.event.token_id;

        var access_token = "";
        var token_type = "";
        var expires_in = -1;
        var refresh_token = "";

        if (ward.tokens().check_token(token_id)) {
            console.log("auth_part_0: inner token success");
            esi.ouath.token(code).then(function (_response_data) {

                console.log("auth_part_1: ccp auth success");
                access_token = _response_data.access_token;
                token_type = _response_data.token_type;
                expires_in = _response_data.expires_in; // seconds ?? (not sure)
                refresh_token = _response_data.refresh_token;
                esi.ouath.verify(access_token).then(function (_user_data) {
                    console.log("auth_part_2: char data success: (" + _user_data.CharacterID + ")");

                    esi.characters.portrait(_user_data.CharacterID).then(function (_images) {
                        console.log("auth_part_3: portrait");
                        var user_id = ward.tokens().get_token(token_id).user_id;
                        var user = ward.users().get_user_by_id(user_id);
                        user.add_eve_char({
                            id: _user_data.CharacterID,
                            char_name: _user_data.CharacterName,
                            expires_on: _user_data.ExpiresOn,
                            expires_in: expires_in,
                            scopes: _user_data.Scopes,
                            character_owner_hash: _user_data.CharacterOwnerHash,
                            access_token: access_token,
                            token_type: _user_data.TokenType,
                            images: _images,
                            refresh_token: refresh_token
                        });
                        ward.dispatcher().send(_data.connection_id, _data.server_id, {
                            client_id: _data.client_id,
                            success: true,
                            command_addr: ["response_ccp_auth"]
                        });
                        ward.save();
                    });

                }.bind(this), function () {
                    send_error(_data, "failed on request user data", ERROR.CCP_DATA_FAILED);
                }.bind(this));
            }.bind(this), function () {
                send_error(_data, "failed on ccp auth (no response from ccp server)", ERROR.CCP_AUTH_FAILED);
            }.bind(this));
        } else {
            send_error(_data, "user not exist", ERROR.BAD_TOKEN);
        }

        var send_error = function (_data, _error_reason, _error_id) {
            ward.dispatcher().send(_data.connection_id, _data.server_id, {
                client_id: _data.client_id,
                success: false,
                reason: _error_reason,
                error_id: _error_id,
                command_addr: ["response_ccp_auth"]
            });
        }

    }
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

var check_mail = function (_mail) {
    return true;
};

module.exports = {
    requests: {
        reg: game.reg,
        auth: game.auth,
        check_token: game.check_token,
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