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
        this.__index_on_id = [];
        this.__mail_on_id = {};
        this.__count = 0;

        this.__init();
    },
    destructor: function () {
        basic.prototype.destructor.call(this);
    },
    __init: function () {

    },
    add_user: function (_data) {
        var base = {
            mail: "",
            password: ""
        };
        Object.extend(base, _data);

        if (this.__mail_on_id[base.mail]) {
            return -1;
        }
        var uid = this.__count++;

        this.__users[uid] = new User({
            id: uid,
            mail: base.mail,
            password: base.password
        });
        this.__index_on_id.push(uid);
        this.__mail_on_id[base.mail] = uid;
        return uid;
    },
    remove_user: function (_id) {
        if (this.__index_on_id[_id] == -1) {
            return false;
        }

        var index = this.__index_on_id.indexOf(_id);
        this.__index_on_id.splice(index, 1);

        var user = this.__users[_id];
        var mail = user.mail();

        delete this.__mail_on_id[mail];

        user.destructor();
        delete this.__users[_id];
    },
    get_user_by_id: function (_uid) {
        var user = this.__users[_uid];
        if (!user) {
            return false;
        }
        return user;
    },
    get_user_by_mail: function (_mail) {
        if (!this.__mail_on_id[_mail]) {
            return false;
        }
        return this.get_user_by_id(this.__mail_on_id[_mail]);
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


var User = basic.inherit({
    constructor: function User(_options) {
        var base = {
            id: -1,
            mail: "",
            password: "",
            characters: {}
        };
        Object.extend(base, _options);
        basic.prototype.constructor.call(this, base);

        this.__id = base.id;
        this.__mail = base.mail;
        this.__password = base.password;
        this.__characters = base.characters;
        
        this.__init();
    },
    destructor: function () {
        basic.prototype.destructor.call(this);
    },
    __init: function () {
        
    },
    add_eve_char: function (_options) {
        var base = {
            char_name: "",
            expires_on: "",
            scopes: "",
            character_owner_hash: "",
            access_token: "",
            token_type: "",
            images: {},
            refresh_token: ""
        };
        Object.extend(base, _options);

        if(this.__characters[base.char_name]){
            return false;
        }

        this.__characters[base.char_name] = new EVEChar({
            char_name: base.char_name,
            expires_on: base.expires_on,
            scopes: base.scopes,
            character_owner_hash: base.character_owner_hash,
            access_token: base.access_token,
            token_type: base.token_type,
            images: base.images,
            refresh_token: base.refresh_token
        });

        return true;
    },
    mail: function () {
        return this.__mail;
    },
    password: function () {
        return this.__password;
    },
    save: function () {
        
    },
    restore: function () {
        
    }
});

var EVEChar = basic.inherit({
    constructor: function EVEChar(_options) {
        var base = {
            id: -1,
            char_name: "",
            expires_on: "",
            scopes: "",
            character_owner_hash: "",
            access_token: "",
            token_type: "",
            images: {},
            refresh_token: ""
        };
        Object.extend(base, _options);
        basic.prototype.constructor.call(this, base);

        this.__id = base.id;
        this.__init();
    },
    destructor: function () {
        basic.prototype.destructor.call(this);
    },
    __init: function () {

    },
    save: function () {

    }
});




module.exports = users;