/**
 * Created by Cubla on 10.08.2017.
 */
(function (_export) {
    var name = "js/client/test";
    var libs = [
        "js/basic"
    ];

    define(name, libs, function () {
        var basic = require("js/basic");

        var test = basic.inherit({
            constructor: function dispatcher(_options) {
                var options = {};
                Object.extend(options, _options);
                basic.prototype.constructor.call(this, options);

                this._init();
            },

            _init: function () {
                this._client_id = dispatcher.add(this._core_handler.bind(this));
            },

            _core_handler: function (_data) {
                //debugger;
            },

            create_game: function () {
                dispatcher.send(this._client_id, {
                    server_id: server.server_id,
                    command: ["api", "game", "create_game"]
                });
            },

            join_game: function (_game_id) {
                dispatcher.send(this._client_id, {
                    server_id: server.server_id,
                    command: ["api", "game", "join_game"],
                    game_id: _game_id
                });
            },

            users_list: function (_game_id) {
                dispatcher.send(this._client_id, {
                    server_id: server.server_id,
                    command: ["api", "game", "users_list"],
                    game_id: _game_id
                });
            },

            games_list: function () {
                dispatcher.send(this._client_id, {
                    server_id: server.server_id,
                    command: ["api", "game", "games_list"]
                });
            },

            leave_game: function (_game_id) {
                dispatcher.send(this._client_id, {
                    server_id: server.server_id,
                    command: ["api", "game", "leave_game"],
                    game_id: _game_id
                });
            }

        });
        return test;
    })
})(window);