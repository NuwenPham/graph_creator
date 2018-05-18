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
        setTimeout(this.poll.bind(this), 5000);

        //var __poll_tick = function () {
        //    console.log("START POLL!!!");
        //    this.poll();
        //    setTimeout(__poll_tick, 10000);
        //}.bind(this);
        //
        //__poll_tick();
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
        if(_data) {
            for (var k in _data.maps) {
                var map_data = _data.maps[k];
                this.__maps[k] = new Map({
                    password: map_data.password,
                    name: map_data.name,
                    is_public: map_data.is_public,
                    owner: map_data.owner,
                    admins: map_data.admins,
                    id: map_data.id,
                    users: map_data.users,
                    links: map_data.links
                });
            }
            this.__index_on_id = _data.index_on_id;
            this.__name_on_id = _data.name_on_id;
            this.__count = _data.count;
        }

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
            systems: {},
            systems_sid_on_id: {},
            systems_index_on_id: [],
            systems_counter: 0,
            links: []
        };
        Object.extend(base, _options);
        basic.prototype.constructor.call(this, base);

        this.__password = base.password;
        this.__name = base.name;
        this.__is_public = base.is_public;
        this.__owner = base.owner;
        this.__admins = base.admins;
        this.__id = base.id;
        this.__users = base.users;
        this.__links = base.links;
        this.__systems = base.systems;
        this.__systems_sid_on_id = base.systems_sid_on_id;
        this.__systems_index_on_id = base.systems_index_on_id;
        this.__systems_counter = base.systems_counter;

        this.__init();
    },
    destructor: function () {
        basic.prototype.destructor.call(this);
    },
    __init: function () {

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
        var index = this.__systems_sid_on_id.indexOf(_solar_system_id);
        return index != -1;
    },
    add_link: function () {

    },
    remove_link: function () {

    },
    has_link: function (_left, _right) {

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
    poll: function () {
        var count_chars = 0;
        this.__chars_in_queue = {};

        var a = 0;
        while( a < this.__users.length) {
            var user = ward.users().get_user_by_id(uid);
            var chars = user.characters();

            for (var k in chars) { // each char
                if (!chars.hasOwnProperty(k)) continue;
                var char = chars[k];

                this.__chars_in_queue[char.id()] = {
                    done: false
                };

                esi.location.online(char.access_token(), char.id(), function (_cid, _err, _body, _online_data) {
                    if(_err){
                        console.log(_err);
                        return;
                    }

                    esi.location.current(char.access_token(), char.id(), function (_cid, _err, _body, _loc_data) {
                        if(_err){
                            console.log(_err);
                            return;
                        }

                        var char_data = this.__chars_in_queue[_cid];
                        char_data.done = true;
                        char_data.location = _loc_data;
                        char_data.online = _online_data;
                        this.__syncer.inc();
                    }.bind(this, _cid));
                }.bind(this, char.id()));
                count_chars++;
            }

            a++;
        }

        if (count_chars > 0) {
            this.__syncer = new Sync({
                end: count_chars
            });
            this.__syncer.on("bearer", function () {
                console.log("END POLL!!!");
                this.__process_map_data();
                this.__is_not_complete = false;
                setTimeout(this.poll.bind(this), 3000);
            }.bind(this));
        } else {
            console.log("0 chars");
            console.log("END POLL!!!");
            setTimeout(this.poll.bind(this), 3000);
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
        for(var k in this.__chars_in_queue){
            if(!this.__chars_in_queue.hasOwnProperty(k)) continue;
            var info = this.__chars_in_queue[k];

        }
    },
    save: function () {
        var systems = [];
        var a = 0;
        while( a < this.__systems_index_on_id.length){
            var sysid = this.__systems_index_on_id[a];
            var sys = this.__systems[sysid];
            a++;
        }


        return {
            systems: this.__systems,
            systems_sid_on_id: this.__systems_sid_on_id,
            systems_index_on_id: this.__systems_index_on_id,
            systems_counter: this.__systems_counter,

            password: this.__password,
            name: this.__name,
            is_public: this.__is_public,
            owner: this.__owner,
            admins: this.__admins,
            id: this.__id,
            users: this.__users,
            links: this.__links
        }
    },
    restore: function () {

    }
});

var SolSystem = basic.inherit({
    constructor: function Map(_options) {
        var base = {
            solar_system_id: -1, // location id
            station_id: -1,
            structure_id: -1
        };
        Object.extend(base, _options);
        basic.prototype.constructor.call(this, base);

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
            solar_system_id: this.__solar_system_id,
            station_id: this.__station_id,
            structure_id: this.__structure_id
        }
    },
    restore: function (_data) {
        this.__solar_system_id = _data.solar_system_id;
        this.__station_id = _data.station_id;
        this.__structure_id = _data.structure_id;
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