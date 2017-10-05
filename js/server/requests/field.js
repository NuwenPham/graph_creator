/**
 * Created by Cubla on 19.08.2017.
 */

var field = {
    request_move_loc: function (_data) {
        var event = _data.event;
        var game_id = _data.event.game_id;
        var game = global.games[game_id];
        var field = game.field();

        var result = field.set_pos(event.col, event.row);

        dispatcher.send(_data.connection_id, _data.server_id, {
            client_id: _data.client_id,
            command: ["response_move_loc"],
            success: result.success,
            message: result.message || ""
        });
    },

    request_field_data: function (_data) {
        var game_id = _data.event.game_id;
        var game = global.games[game_id];
        var field = game.field();

        // ну я не буду запрашивать несуществующую игру пока что

        dispatcher.send(_data.connection_id, _data.server_id, {
            client_id: _data.client_id,
            command: ["response_field_data"],
            cols: field._opts.cols,
            rows: field._opts.rows,
            empty_field_col: field._empty_field.x,
            empty_field_row: field._empty_field.y
        });
    }
};
module.exports = {
    methods: field,
    requests: {
        request_move_loc: field.request_move_loc,
        request_field_data: field.request_field_data
    }
};