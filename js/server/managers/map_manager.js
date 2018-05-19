/**
 * Created by Cubla on 20.09.2017.
 */

var basic = require("./../basic");
var esi = require("./../esi");
var Maps = basic.inherit({
    constructor: function maps(_options) {
        var options = {};
        Object.extend(options, _options);
        basic.prototype.constructor.call(this, options);

        this.__maps = {};
        this.__index_on_id = [];
        this.__name_on_id = {};
        this.__count = 0;
        
        this.__init();
    },
    destructor: function () {
        basic.prototype.destructor.call(this);
    },
    __init: function () {

    },
    add_map: function (_options) {
        var mid = this.__count++;

        var base = {
            id: mid,
            password: null,
            name: "",
            is_public: true
        };
        Object.extend(base, _options);
        var map = new Map(base);
        this.__maps[mid] = map;

        this.__index_on_id.push(mid);
        this.__name_on_id[base.name] = mid;

        ward.save();

        map.start();

        return mid;
    },
    remove_map: function (_mid) {
        var index = this.__index_on_id.indexOf(_mid);
        delete this.__maps[_mid];
        this.__index_on_id.splice(index, 1);
        ward.save();
    },
    map_list: function () {
        var list = [];
        var a = 0;

        while(a < this.__index_on_id.length){
            var mid = this.__index_on_id[a];
            var map = this.__maps[mid];
            list.push({
                is_public: map.is_public(),
                name: map.name(),
                has_password: map.has_password(),
                id: mid
            });
            a++;
        }
        return list;
    },
    get_map: function(_mid){
        return this.__maps[_mid];
    },
    is_exist: function (_mid) {
        return this.__index_on_id.indexOf(_mid) != -1;
    },
    is_exist_by_name: function (_name) {
        return this.__name_on_id[_name] === undefined;
    },

    save: function () {
        var maps_res = {};
        for(var k in this.__maps){
            var map = this.__maps[k];
            maps_res[k] = map.save();
        }

        var index_on_id = this.__index_on_id;

        return {
            count: this.__count,
            name_on_id: this.__name_on_id,
            index_on_id: index_on_id,
            maps: maps_res
        }
    },
    restore: function (_data) {
        console.log("Maps manager restoring START...");
        if(_data) {
            for (var k in _data.maps) {
                var map_data = _data.maps[k];
                var map = new Map();
                this.__maps[k] = map;
                map.restore(map_data);
                map.start();
            }
            this.__index_on_id = _data.index_on_id;
            this.__name_on_id = _data.name_on_id;
            this.__count = _data.count;
        }
        console.log("Maps manager restoring END...");
    }

});

var Map = basic.inherit({
    constructor: function Map(_options) {
        var base = {
            password: null,
            name: null,
            id: null,
            is_public: true,
            owner: -1,
            admins: [],
            users: [],
            links: {},
            links_index_on_id: [],
            links_counter: 0,
            systems: {},
            systems_sid_on_id: {},
            systems_index_on_id: [],
            systems_counter: 0
        };
        Object.extend(base, _options);
        basic.prototype.constructor.call(this, base);

        this.__password = base.password;
        this.__name = base.name;
        this.__id = base.id;
        this.__is_public = base.is_public;
        this.__owner = base.owner;
        this.__admins = base.admins;
        this.__users = base.users;

        this.__links = base.links;
        this.__links_counter = base.links_counter;
        this.__links_index_on_id = base.links_index_on_id;

        this.__systems = base.systems;
        this.__systems_sid_on_id = base.systems_sid_on_id;
        this.__systems_index_on_id = base.systems_index_on_id;
        this.__systems_counter = base.systems_counter;

        // not saving vars
        this.__poll_tid = -1;
        this.__is_polling = false;
        this.__init();
    },
    destructor: function () {
        basic.prototype.destructor.call(this);
    },
    __init: function () {

    },
    start: function () {
        var TICK_TIME = 10000; //ms
        this.__is_polling = true;

        var __poll_tick = function () {
            if(!this.__is_polling) return;

            this.poll(function(){
                this.__poll_tid = setTimeout(__poll_tick, TICK_TIME);
            }.bind(this));
        }.bind(this);

        __poll_tick();
    },
    stop: function () {
        this.__is_polling = false;
        clearTimeout(this.__poll_tid);
    },
    add_user: function (_uid) {
        this.__users.push(_uid);
    },
    remove_user: function (_uid) {
        var index = this.__users.indexOf(_uid);
        this.__users.splice(index);
    },
    add_system: function (_solar_system_id, _station_id, _structure_id) {
        var sid = this.__systems_counter++;
        this.__systems[sid] = new SolSystem({
            id: sid,
            solar_system_id: _solar_system_id,
            station_id: _station_id,
            structure_id: _structure_id
        });
        this.__systems_index_on_id.push(sid);
        this.__systems_sid_on_id[_solar_system_id] = sid;
        return sid;
    },
    remove_system: function () {

    },
    has_system: function (_solar_system_id) {
        return this.__systems_sid_on_id[_solar_system_id] !== undefined;
    },
    add_link: function (_sol_sys_id_from, _sol_sys_id_to) {
        var lid = this.__links_counter++;
        var link = new Link({
            id: lid,
            solar_system_id_from: _sol_sys_id_from,
            solar_system_id_to: _sol_sys_id_to
        });
        this.__links_index_on_id.push(lid);
        this.__links[lid] = link;
    },
    has_link: function (_sol_sys_id_from, _sol_sys_id_to) {
        var a = 0;
        while( a < this.__links_index_on_id.length){
            var lid = this.__links_index_on_id[a];
            var link = this.__links[lid];
            var first_condition = link.solar_system_id_from() == _sol_sys_id_from && link.solar_system_id_from() == _sol_sys_id_to;
            var second_condition = link.solar_system_id_from() == _sol_sys_id_to && link.solar_system_id_from() == _sol_sys_id_from;

            if(first_condition || second_condition){
                return true;
            }

            a++;
        }
        return false;
    },
    remove_link: function () {

    },
    is_public: function () {
        return this.__is_public;
    },
    name: function () {
        return this.__name;
    },
    has_password: function () {
        return (typeof this.__password == "string" && this.__password.length > 0);
    },
    users: function () {
        return this.__users;
    },
    /**
     poll logic:
     |- each user
     |   |- each account
     |       |- request_online -----|
     |       |- request_location ---|
     |                              |
     |------------------------------| this is bearer
     */
    poll: function (_callback) {
        console.log("\nMAP [%s] POLL starting", this.__name);
        var count_chars = 0;
        this.__chars_in_queue = {};

        var __on_loc_current = function (_cid, _err, _body, _loc_data) {
            if (_err) {
                console.log(_err);
                return;
            }

            var char_data = this.__chars_in_queue[_cid];
            char_data.done = true;
            char_data.location = _loc_data;
            this.__syncer.inc();
        };

        var __on_loc_online = function (_cid, _err, _body, _online_data) {
            if (_err) {
                console.log(_err);
                return;
            }

            var char_data = this.__chars_in_queue[_cid];
            char_data.online = _online_data;

            var user = ward.users().get_user_by_id(char_data.uid);
            var char = user.get_char(char_data.name);

            esi.location.current(char.access_token(), char.id(), __on_loc_current.bind(this, _cid));
        };

        var start_process = function (_cid) {
            var char_data = this.__chars_in_queue[_cid];
            var user = ward.users().get_user_by_id(char_data.uid);
            var char = user.get_char(char_data.name);

            if (char.is_expires()) {
                console.log("access token out");
                char.update_token(start_process.bind(this, _cid));
            } else {
                console.log("access token left: " + (char.token_time_left() / 1000 | 0 ) + " seconds");
                esi.location.online(char.access_token(), char.id(), __on_loc_online.bind(this, char.id()));
            }
        };

        var a = 0;
        while( a < this.__users.length) {
            var uid = this.__users[a];
            var user = ward.users().get_user_by_id(uid);
            var chars = user.characters();

            for (var k in chars) { // each char
                if (!chars.hasOwnProperty(k)) continue;
                var char = chars[k];

                this.__chars_in_queue[char.id()] = {
                    done: false,
                    uid: uid,
                    name: k
                };

                start_process.call(this, char.id());
                count_chars++;
            }
            a++;
        }

        if (count_chars > 0) {
            this.__syncer = new Sync({
                end: count_chars
            });
            this.__syncer.on("bearer", function () {
                console.log("MAP [%s] POLL end", this.__name);
                this.__process_map_data();
                this.__is_not_complete = false;
                _callback();
            }.bind(this));
        } else {
            console.log("0 chars");
            console.log("MAP [%s] POLL end", this.__name);
            _callback()
        }
        this.__is_not_complete = true;
    },
    /**
     |-----------------------
     |- check (map has system)
     |   |- IF TRUE
     |   |   |- check (map has link account.system, system)
     |   |       |- IF TRUE
     |   |       |    |- account update_current_system system
     |   |       |- IF NOT
     |   |            |- map add link account.system, system
     |   |            |- account update_current_system system
     |   |- IF NOT
     |       |- map add system
     |       |- map add link account.system, system
     |       |- account update_current_system system
     */
    __process_map_data: function () {
        for (var k in this.__chars_in_queue) {
            if (!this.__chars_in_queue.hasOwnProperty(k)) continue;
            var info = this.__chars_in_queue[k];
            var user = ward.users().get_user_by_id(info.uid);
            var char = user.get_char(info.name);

            if (char.location() != info.location.solar_system_id) {
                console.log("LOCATION you: " + char.location() + ", loc in: " + info.location.solar_system_id);

                if (this.has_system(info.location.solar_system_id)) {
                    if (!this.has_link(info.location.solar_system_id, char.location())) {
                        this.add_link(char.location(), info.location.solar_system_id);
                    }
                } else {
                    this.add_system(info.location.solar_system_id);
                    if (char.location() != -1) {
                        this.add_link(char.location(), info.location.solar_system_id);
                    }
                }
                char.set_location(info.location.solar_system_id);

            }
        }
        ward.save();
    },
    save: function () {
        var systems = [];
        var a = 0;
        while( a < this.__systems_index_on_id.length){
            var sysid = this.__systems_index_on_id[a];
            var sys = this.__systems[sysid];
            systems.push(sys.save());
            a++;
        }

        var links = [];
        a = 0;
        while( a < this.__links_index_on_id.length){
            var lid = this.__links_index_on_id[a];
            var link = this.__links[lid];
            links.push(link.save());
            a++;
        }

        return {
            systems: systems,
            systems_sid_on_id: this.__systems_sid_on_id,
            systems_index_on_id: this.__systems_index_on_id,
            systems_counter: this.__systems_counter,

            links: links,
            links_counter: this.__links_counter,
            links_index_on_id: this.__links_index_on_id,

            password: this.__password,
            name: this.__name,
            is_public: this.__is_public,
            owner: this.__owner,
            admins: this.__admins,
            id: this.__id,
            users: this.__users
        }
    },
    restore: function (_data) {
        console.log("--- map [" + _data.name + "] restoring START...");

        var a = 0;
        while (a < _data.systems.length) {
            var sys_info = _data.systems[a];
            var sys = new SolSystem();
            sys.restore(sys_info);
            this.__systems[sys_info.id] = sys;
            a++;
        }

        a = 0;
        while (a < _data.links.length) {
            var link_data = _data.links[a];
            var link = new Link();
            link.restore(link_data);
            this.__links[link_data.id] = link;
            a++;
        }

        this.__systems_sid_on_id = _data.systems_sid_on_id;
        this.__systems_index_on_id = _data.systems_index_on_id;
        this.__systems_counter = _data.systems_counter;

        this.__links_counter = _data.links_counter;
        this.__links_index_on_id = _data.links_index_on_id;

        this.__password = _data.password;
        this.__name = _data.name;
        this.__is_public = _data.is_public;
        this.__owner = _data.owner;
        this.__admins = _data.admins;
        this.__id = _data.id;
        this.__users = _data.users;

        console.log("--- map [" + _data.name + "] restoring END...");
    }
});

var Link = basic.inherit({
    constructor: function Map(_options) {
        var base = {
            id: -1,
            solar_system_id_from: -1, // location id
            solar_system_id_to: -1
        };
        Object.extend(base, _options);
        basic.prototype.constructor.call(this, base);

        this.__id = base.id;
        this.__solar_system_id_from = base.solar_system_id_from;
        this.__solar_system_id_to = base.solar_system_id_to;

        this.__init();
    },
    __init: function () {

    },
    solar_system_id_from: function () {
        return this.__solar_system_id_from;
    },
    solar_system_id_to: function () {
        return this.__solar_system_id_to;
    },
    save: function () {
        return {
            id: this.__id,
            solar_system_id_from: this.__solar_system_id_from,
            solar_system_id_to: this.__solar_system_id_to
        }
    },
    restore: function (_data) {
        console.log("--- --- link [" + _data.id + "] restoring START...");

        this.__id = _data.id;
        this.__solar_system_id_from = _data.solar_system_id_from;
        this.__solar_system_id_to = _data.solar_system_id_to;

        console.log("--- --- link [" + _data.id + "] restoring END...");
    }
});


var SolSystem = basic.inherit({
    constructor: function Map(_options) {
        var base = {
            id: -1,
            solar_system_id: -1, // location id
            station_id: -1,
            structure_id: -1
        };
        Object.extend(base, _options);
        basic.prototype.constructor.call(this, base);

        this.__id = base.id;
        this.__solar_system_id = base.solar_system_id;
        this.__station_id = base.station_id;
        this.__structure_id = base.structure_id;

        this.__init();
    },
    __init: function () {

    },
    solar_system_id: function () {
        return this.__solar_system_id;
    },
    station_id: function () {
        return this.__station_id;
    },
    structure_id: function () {
        return this.__structure_id;
    },
    save: function () {
        return {
            id: this.__id,
            solar_system_id: this.__solar_system_id,
            station_id: this.__station_id,
            structure_id: this.__structure_id
        }
    },
    restore: function (_data) {
        console.log("--- --- solar system [" + _data.solar_system_id + "] restoring START...");

        this.__id = _data.id;
        this.__solar_system_id = _data.solar_system_id;
        this.__station_id = _data.station_id;
        this.__structure_id = _data.structure_id;

        console.log("--- --- solar system [" + _data.solar_system_id + "] restoring END...");
    }
});

var Sync = basic.inherit({
    className: "Sync",
    constructor: function(_options){
        var base = {
            end: 0
        };
        Object.extend(base, _options);
        basic.prototype.constructor.call(this, base);
        this.__end = base.end;
        this.__count = 0;
    },
    destructor: function () {
        basic.prototype.destructor.call(this);
    },
    inc: function () {
        this.__count++;
        if(this.__count == this.__end){
            this.trigger("bearer");
        }
    }
});

module.exports = Maps;