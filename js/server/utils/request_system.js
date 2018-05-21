/**
 * Created by Cubla on 17.05.2018.
 */
var request = require("request");

/* CONSTANTS */
var HOST = config.eve_esi_server.host;
var PROTO = config.eve_esi_server.proto;
var SERVER = config.eve_esi_server.server;
var CONTENT_TYPE = config.eve_esi_server.content_type;
var PORT = config.eve_esi_server.port;

var COUNT_RQUESTS_BY_TICK = config.poll_settings.count_requests_by_tick;
var POLL_TIMEOUT = config.poll_settings.timeout;

var _GET = 0;
var _POST = 1;

var _PUBLIC = 0;
var _BEARER = 1;
var _PUT = 2;
var _DELETE = 3;

var counter = 0;
var reqsys = function () {
    this.__queue = [];
    this.__request_count_in_time = COUNT_RQUESTS_BY_TICK;
    this.__poll_timeout = POLL_TIMEOUT;

    // ----------------------------------------
    //  METHOD |   | GET | POST | PUT | DELETE |
    //  -------|---|-----|------|-----|--------|
    //  TYPE   |   |   0 |   1  |  2  |    3   |
    // --------|---|-----|------|-----|--------|
    //  PUBLIC | 0 |  00 |  01  | 02  |   03   |
    //  BEARER | 1 |  10 |  11  | 12  |   13   |
    this.__methods = [
        [_esi_public_get_request, _esi_bearer_get_request],
        ["post_public", _esi_bearer_post_request],
        ["put_public", "put_bearer"],
        ["delete_public", "delete_bearer"]
    ];

    this.start();
};

reqsys.prototype = {
    get_public: function (_path, _options, _callback) {
        var rid = counter++;

        this.__queue.push({
            args: [_path, _options, _callback],
            type: _PUBLIC,
            method: _GET,
            path: _path,
            options: _options,
            callback: _callback,
            id: rid
        });

        return rid;
    },
    get_bearer: function (_access_token, _path, _options, _callback) {
        var rid = counter++;

        this.__queue.push({
            args: [_access_token, _path, _options, _callback],
            access_token: _access_token,
            type: _BEARER,
            method: _GET,
            path: _path,
            options: _options,
            callback: _callback,
            id: rid
        });

        return rid;
    },
    post_public: function (_path, _options, _callback) {
        var rid = counter++;

        this.__queue.push({
            args: [_path, _options, _callback],
            type: _PUBLIC,
            method: _POST,
            path: _path,
            options: _options,
            callback: _callback,
            id: rid
        });

        return rid;
    },
    post_bearer: function (_access_token, _path, _options, _callback) {
        var rid = counter++;

        this.__queue.push({
            args: [_access_token, _path, _options, _callback],
            access_token: _access_token,
            type: _BEARER,
            method: _POST,
            path: _path,
            options: _options,
            callback: _callback,
            id: rid
        });

        return rid;
    },
    remove_request: function (_rid) {
        var a = 0;
        while (a < this.__queue.length) {
            var info = this.__queue[a];
            if (info.id == _rid) {
                this.__queue.splice(a, 1);
                return;
            }
            a++;
        }
    },
    tick: function () {
        var reqs = this.__queue.splice(0, this.__request_count_in_time);
        var a = 0;
        while (a < reqs.length) {
            var reqdata = reqs[a];
            this.__methods[reqdata.method][reqdata.type].apply(this, reqdata.args);
            a++;
        }
    },
    start: function () {
        var loop = function () {
            this.tick();
            this.__tid = setTimeout(loop.bind(this), this.__poll_timeout);
        }.bind(this);
        loop();
    },
    stop: function () {
        clearTimeout(this.__tid);
    }
};



var _esi_public_get_request = function (_path, _options, _callback) {
    var host = PROTO + "//" + HOST + "/";
    var addr = host + _path;

    var base_opts = Object.extend({
        datasource: SERVER
    }, _options);

    var arr = [];
    for (var k in base_opts) {
        var val = base_opts[k];
        arr.push(k + "=" + val);
    }
    var query = arr.join("&");
    addr += "?" + query;

    console.log("GET PUBLIC ESI:\n%s", addr);
    var options = {
        url: addr
    };

    var start_time = +new Date;
    var on_response = function (_error, _body, _data) {
        console.log("response time: ", (+new Date - start_time));
        console.log("GET PUBLIC ESI RESPONSE");
        _callback(_error, _body, JSON.parse(_data));
    }.bind(this);
    request.get(options, on_response);
};

var _esi_bearer_get_request = function (_access_token, _path, _options, _callback) {
    var host = PROTO + "//" + HOST + "/";
    var addr = host + _path;

    var base_opts = Object.extend({
        datasource: SERVER
    }, _options);

    var arr = [];
    for (var k in base_opts) {
        var val = base_opts[k];
        arr.push(k + "=" + val);
    }
    var query = arr.join("&");
    addr += "?" + query;

    console.log("GET BEARER ESI: %s", addr);
    var options = {
        url: addr,
        pool: {maxSockets: Infinity},
        port: PORT,
        headers: {
            Authorization: "Bearer " + _access_token,
            "Content-Type": CONTENT_TYPE,
            Host: HOST
        }
    };

    var start_time = +new Date;
    var on_response = function (_error, _body, _data) {
        console.log("GET BEARER ESI RESPONSE. response time: ", (+new Date - start_time));
        _callback(_error, _body, JSON.parse(_data));
    }.bind(this);

    request.get(options, on_response);
};

var _esi_bearer_post_request = function (_access_token, _path, _options, _callback) {
    var host = PROTO + "//" + HOST + "/";
    var addr = host + _path;

    var base_opts = {
        datasource: SERVER
    };

    var arr = [];
    for (var k in base_opts) {
        var val = base_opts[k];
        arr.push(k + "=" + val);
    }
    var query = arr.join("&");
    addr += "=" + query;

    console.log("POST BEARER ESI: \n%s", addr);
    var options = {
        url: addr,
        headers: {
            Authorization: "Bearer " + _access_token,
            "Content-Type": CONTENT_TYPE,
            Host: HOST
        },
        form: _options || {}
    };

    var start_time = +new Date;
    var on_response = function (_error, _body, _data) {
        console.log("response time: ", (+new Date - start_time));
        console.log("GET BEARER ESI RESPONSE");
        _callback(_error, _body, JSON.parse(_data));
    }.bind(this);
    request.post(options, on_response);
};




module.exports = reqsys;