/**
 * Created by Cubla on 19.08.2017.
 */

var _game = require("./../game/game.js");
var _field_requests = require("./field.js");

var game = {
    reg: function (_data) {


        ward.dispatcher().send(_data.connection_id, _data.server_id, {
            client_id: _data.client_id,
            command_addr: ["response_reg"]
        });
    }
};
module.exports = {
    requests: {
        reg: game.reg
    }
};