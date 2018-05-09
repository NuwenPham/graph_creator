/**
 * Created by Cubla on 20.09.2017.
 */

var basic = require("./../basic");

var users = basic.inherit({
    constructor: function ward(_options) {
        var options = {};
        Object.extend(options, _options);
        basic.prototype.constructor.call(this, options);

        this.__users = {};
        this.__index_on_id = {};
        this.__count = 0;

        this.__init();
    },

    destructor: function () {
        basic.prototype.destructor.call(this);
    },

    __init: function () {
        this.__id = 0;
        this.__ready_promise = new promise();
        this.__is_ready = true;
        this.__ready_promise.resolve();
    },

    add_user: function (_string_id, _data) {
        if (this.__users[_string_id]) {
            return -1;
        }

        var id = this.__count++;
        this.__users[_string_id] = {
            index: id,
            data: _data
        };
        this.__index_on_id[id] = _string_id;
        return id;
    },

    remove_user: function (_string_id) {
        if (!this.__users[_string_id]) {
            return false;
        }

        var index = this.__users[_string_id].index;
        delete this.__users[_string_id];
        delete this.__index_on_id[index];
    },

    get_user_string_id_by_index: function (_index) {
        if (!this.__index_on_id[_index]) {
            return false;
        }
        return this.__index_on_id[_index];
    },

    get_user_by_id: function (_user_id) {
        var str_id = this.__index_on_id[_user_id];
        if (!str_id) {
            return false;
        }
        return this.__users[str_id];
    },

    get_user_by_mail: function (_string_id) {
        if (!this.__users[_string_id]) {
            return false;
        }
        return this.__users[_string_id];
    },

    attach_eve_account: function (_string_id, _character_data) {
        var user = this.__users[_string_id];
        if (!user) {
            return false;
        }

        if (!user.data.eve_data) {
            user.data.eve_data = {
                characters: {}
            };
        }

        user.data.eve_data.characters[_character_data.char_id] = {
            char_name: _character_data.char_name,
            expires_on: _character_data.expires_on,
            scopes: _character_data.scopes,
            character_owner_hash: _character_data.character_owner_hash,
            access_token: _character_data.access_token,
            token_type: _character_data.token_type,
            images: _character_data.images,
            refresh_token: _character_data.refresh_token
        };

        return true;
    },

    update_character_data: function (_user_id, _character_id, _new_data) {
        var string_id = this.__index_on_id[_user_id];
        if (!string_id) {
            return false;
        }

        var user = this.__users[string_id];
        if (!user) {
            return false;
        }

        var characters = user.data.eve_data.characters;
        var character = characters[_character_id];

        for (var k in _new_data) {
            character[k] = _new_data[k];
        }

        return true;
    },
    ready_promise: function () {
        return this.__ready_promise.native;
    },
    is_ready: function () {
        return this.__is_ready;
    },
    save: function () {
        return {
            users: this.__users,
            index_on_id: this.__index_on_id,
            count: this.__count
        }
    },
    restore: function (_data) {
        if (_data) {
            this.__users = _data.users;
            this.__index_on_id = _data.index_on_id;
            this.__count = _data.count;
        }
    }
});




var user_counter = "user_counter";
var prefix = "users";
var make_key = function (_key) {
    return prefix + "_" + _key;
};

module.exports = users;