/**
 * Created by Cubla on 19.08.2017.
 */

var _game = require("./../game/game.js");
var _field_requests = require("./field.js");

var game = {
    create_game: function (_data) {
        var _new_game = new _game();
        var game_id = _new_game.get_id();
        global.games[game_id] = _new_game;

        dispatcher.send(_data.connection_id, _data.server_id, {
            client_id: _data.client_id,
            command: ["response_create_game"],
            game_id: game_id
        });
    },
    games_list: function (_data) {
        var arr = [];
        for (var key in global.games) {
            global.games.hasOwnProperty(key) && arr.push(key);
        }
        dispatcher.send(_data.connection_id, _data.server_id, {
            client_id: _data.client_id,
            command: ["response_game_list"],
            games: arr
        });
    },
    users_list: function (_data) {
        var game = global.games[_data.event.game_id];
        var game_users = game.users();
        var arr = [];
        for (var key in game_users) {
            game_users.hasOwnProperty(key) && arr.push(key);
        }
        dispatcher.send(_data.connection_id, _data.server_id, {
            client_id: _data.client_id,
            command: ["response_users_list"],
            users: arr
        });
    },
    join_game: function (_data) {
        var game_id = _data.event.game_id;
        var game = global.games[game_id];
        var is_added = game.add_user(_data.connection_id);

        dispatcher.send(_data.connection_id, _data.server_id, {
            client_id: _data.client_id,
            command: ["response_join_game"],
            is_joined: is_added
        });
    },
    leave_game: function (_data) {
        var game_id = _data.event.game_id;
        var game = global.games[game_id];
        var is_leaved = game.delete_user(_data.connection_id);

        dispatcher.send(_data.connection_id, _data.server_id, {
            client_id: _data.client_id,
            command: ["response_leave_game"],
            is_leaved: is_leaved
        });
    }
};
module.exports = {
    requests: {
        create_game: game.create_game,
        games_list: game.games_list,
        leave_game: game.leave_game,
        users_list: game.users_list,
        join_game: game.join_game,
        field: _field_requests.requests
    }
};