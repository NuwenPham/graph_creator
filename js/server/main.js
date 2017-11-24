/**
 * Created by pham on 8/8/17.
 */
var promise = require("./utils/promise.js");
var leveldb = require("./utils/leveldb.js");


// дерево, по адресу которого вызывается метод
var _ward = require("./ward.js");
global.ward = new _ward();

// requests
var game = require("./requests/game").requests;
var auth = require("./requests/auth").requests;
var user = require("./requests/user").requests;
var requests_tree = {
    api: {
        game: game,
        auth: auth,
        user: user
    }
};


var client_enter_point = function (_data) {
    var connection_id = _data.connection_id;
    var data = _data.data;
    var event = data.data;
    var server_id = data.data.server_id;
    var client_id = data.client_id;

    var cmng = ward.connection_manager();
    cmng.is_exist(connection_id) && cmng.add(connection_id);

    var obj = requests_tree;
    while(event.command_addr.length != 0){
        var hop = event.command_addr.shift();
        obj = obj[hop];
    }

    obj({connection_id:connection_id, server_id:server_id, client_id:client_id, event:event});
};


ward.dispatcher().on("enter_point", client_enter_point.bind(this));


