global.config = require("./config.js");
require("./globals.js");

// requests
var api = require("./api");
var requests_tree = {
    api: api
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


