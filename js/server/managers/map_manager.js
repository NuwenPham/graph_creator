/**
 * Created by Cubla on 20.09.2017.
 */

var basic = require("./../basic");
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
        //this.start_poll();
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
    is_exist: function (_mid) {
        return this.__index_on_id.indexOf(_mid) != -1;
    },
    is_exist_by_name: function (_name) {
        return this.__name_on_id[_name] === undefined;
    },
    start_poll: function () {
        var a = 0;
        while(a < this.__index_on_id.length){
            var mid = this.__index_on_id[a];
            var map = this.__maps[mid];
            var users = map.users();

            var b = 0;
            while( b < users.length){
                var uid = users[b];
                var user = ward.users().get_user_by_id(uid);



                b++;
            }

            a++;
        }
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

        this.__init();
    },
    destructor: function () {
        basic.prototype.destructor.call(this);
    },
    __init: function () {
    },
    add_user: function () {

    },
    remove_user: function () {

    },
    add_system: function () {

    },
    remove_system: function () {

    },
    add_link: function () {

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
    save: function () {
        return {
            password: this.__password,
            name: this.__name,
            is_public: this.__is_public,
            owner: this.__owner,
            admins: this.__admins,
            id: this.__id,
            users: this.__users,
            links: this.__links
        }
    }
});


module.exports = Maps;