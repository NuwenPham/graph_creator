/**
 * Created by Cubla on 03.11.2017.
 */

var request = require('request');

var mapper = {
    add: function (_data) {
        var token_id = _data.event.token_id;
        var name = _data.event.name;
        var password = _data.event.password;
        var is_public = _data.event.is_public;

        if (ward.tokens().check_token(token_id)) {
            var t = ward.tokens().get_token(token_id);
            var uid = t.user_id;

            if(!ward.maps().is_exist_by_name(name)){
                ward.dispatcher().send(_data.connection_id, _data.server_id, {
                    client_id: _data.client_id,
                    success: false,
                    text: "map with such name already exist",
                    error_id: ERROR.ALREADY_EXIST,
                    command_addr: ["response_add"]
                });
                return;
            }

            var mid = ward.maps().add_map({
                name: name,
                password: password,
                is_public: is_public,
                owner: uid
            });

            ward.save();

            ward.dispatcher().send(_data.connection_id, _data.server_id, {
                client_id: _data.client_id,
                mid: mid,
                success: true,
                command_addr: ["response_add"]
            });

        }
    },
    remove: function (_data) {
        var token_id = _data.event.token_id;
        var mid = _data.event.id;
        if (ward.tokens().check_token(token_id)) {
            var t = ward.tokens().get_token(token_id);
            var uid = t.user_id;
            ward.maps().remove_map(mid);
            ward.save();
            if(!user.data){
                ward.dispatcher().send(_data.connection_id, _data.server_id, {
                    client_id: _data.client_id,
                    success: true,
                    command_addr: ["response_remove"]
                });
                return;
            }
        }

    },
    observe: function (_data) {
        var token_id = _data.event.token_id;
        if (ward.tokens().check_token(token_id)) {
            var t = ward.tokens().get_token(token_id);
            var uid = t.user_id;

        }
    },
    list: function (_data) {
        var token_id = _data.event.token_id;
        var error_reason = "";
        var error_id = "";

        if (ward.tokens().check_token(token_id)) {
            var t = ward.tokens().get_token(token_id);
            var uid = t.user_id;
            var user = ward.users().get_user_by_id(uid);

            var maps = ward.maps().map_list();
            ward.dispatcher().send(_data.connection_id, _data.server_id, {
                client_id: _data.client_id,
                list : maps,
                success: true,
                command_addr: ["response_maps"]
            });
        }
    },
    add_link: function (_data) {
        var token_id = _data.event.token_id;
        var first_edge = _data.event.first_edge;
        var second_edge = _data.event.second_edge;
        if (ward.tokens().check_token(token_id)) {
            var t = ward.tokens().get_token(token_id);
            var uid = t.user_id;
            var user = ward.users().get_user_by_id(uid);

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
        list: mapper.list,
        add: mapper.add,
        remove: mapper.remove
    }
};

var ERROR = {
    CHAR_ERROR: "CHAR_ERROR",
    PASSWORD_INCORRECT: "PASSWORD_INCORRECT",
    ALREADY_EXIST: "ALREADY_EXIST",
    UNKNOWN: "UNKNOWN"
};



