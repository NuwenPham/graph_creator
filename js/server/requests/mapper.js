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
        var map_id = _data.event.id;
        if (ward.tokens().check_token(token_id)) {
            var t = ward.tokens().get_token(token_id);
            var uid = t.user_id;
            var map = ward.maps().get_map(map_id);
            map.add_user(uid);
            ward.save();
            ward.dispatcher().send(_data.connection_id, _data.server_id, {
                client_id: _data.client_id,
                success: true,
                command_addr: ["response_observe"]
            });
            return;
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
    },
    topo: function (_data) {
        var token_id = _data.event.token_id;
        if (ward.tokens().check_token(token_id)) {
            var t = ward.tokens().get_token(token_id);
            var map_id = _data.event.map_id;
            var map = ward.maps().get_map(map_id);
            var systems = map.systems_data();
            var links = map.links_data();

            var out_systems = [];
            var a = 0;
            while (a < systems.length) {
                var os = systems[a];
                out_systems.push({
                    solar_system_id: os.solar_system_id,
                    name: ward.sde().get_system(os.solar_system_id).name
                });
                a++;
            }

            ward.dispatcher().send(_data.connection_id, _data.server_id, {
                client_id: _data.client_id,
                systems: out_systems,
                links: links,
                success: true,
                command_addr: ["response_maps"]
            });
        }
    }

};


module.exports = {
    requests: {
        list: mapper.list,
        observe: mapper.observe,
        add: mapper.add,
        topo: mapper.topo,
        remove: mapper.remove
    }
};

var ERROR = {
    CHAR_ERROR: "CHAR_ERROR",
    PASSWORD_INCORRECT: "PASSWORD_INCORRECT",
    ALREADY_EXIST: "ALREADY_EXIST",
    UNKNOWN: "UNKNOWN"
};



