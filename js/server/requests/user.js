/**
 * Created by Cubla on 03.11.2017.
 */

var request = require('request');

var user = {
    characters: function (_data) {
        var token_id = _data.event.token_id;
        var error_reason = "";
        var error_id = "";

        if (ward.tokens().check_token(token_id)) {
            var t = ward.tokens().get_token(token_id);
            var uid = t.user_id;
            var u = ward.users().get_user_by_id(uid);
            var char_out = [];

            var char_list = u.characters();
            for (var k in char_list) {
                if (!char_list.hasOwnProperty(k)) return;
                var char_data = char_list[k];
                char_out.push({
                    id: k,
                    char_name: char_data.char_name(),
                    images: char_data.images()
                });
            }
            ward.dispatcher().send(_data.connection_id, _data.server_id, {
                client_id: _data.client_id,
                success: true,
                characters: char_out,
                command_addr: ["response_characters"]
            });
        }
    },
    remove_character: function (_data) {
        var token_id = _data.event.token_id;
        var char_id = _data.event.char_id;
        if (ward.tokens().check_token(token_id)) {
            var t = ward.tokens().get_token(token_id);
            var uid = t.user_id;
            var u = ward.users().get_user_by_id(uid);

            u.remove_eve_char(char_id);
            ward.save();
            ward.dispatcher().send(_data.connection_id, _data.server_id, {
                client_id: _data.client_id,
                success: true,
                command_addr: ["response_remove_character"]
            });
        }
    }
};

module.exports = {
    requests: {
        characters: user.characters,
        remove_character: user.remove_character
    }
};


