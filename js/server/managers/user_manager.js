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
        if (this.__mail_on_id[_mail] === undefined) {
            return false;
        }
        return this.get_user_by_id(this.__mail_on_id[_mail]);
    },
    save: function () {
        var user_result = [];
        var a = 0;
        while( a < this.__index_on_id.length){
            var uid = this.__index_on_id[a];
            var u = this.__users[uid];
            user_result.push(u.save());
            a++;
        }

        return {
            users: user_result,
            index_on_id: this.__index_on_id,
            mail_on_id: this.__mail_on_id,
            count: this.__count
        }
    },
    restore: function (_data) {
        if (_data) {
            //this.__users = _data.users;

            var rest_users = {};
            var a = 0;
            while(a < _data.users.length){
                var u_data = _data.users[a];
                var user_inst = new User();
                user_inst.restore(u_data);
                rest_users[u_data.id] = user_inst;
                a++;
            }

            this.__users = rest_users;
            this.__index_on_id = _data.index_on_id;
            this.__mail_on_id = _data.mail_on_id;
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
    remove_eve_char: function (_char) {
        this.__characters[_char].destructor();
        delete this.__characters[_char];
    },
    characters: function () {
        return this.__characters;
    },
    has_char: function (_char_name) {
        return this.__characters[_char_name] != undefined;
    },
    mail: function () {
        return this.__mail;
    },
    id: function () {
        return this.__id;
    },
    password: function () {
        return this.__password;
    },
    save: function () {
        var characters_result = [];

        for(var k in this.__characters){
            var char = this.__characters[k];
            characters_result.push(char.save());
        }

        return {
            characters: characters_result,
            id: this.__id,
            mail: this.__mail,
            password: this.__password
        }
    },
    restore: function (_data) {
        //_data.characters
        var rest_chars = {};
        var a = 0;
        while( a < _data.characters.length){
            var char_data = _data.characters[a];
            var evechar = new EVEChar();
            evechar.restore(char_data);
            rest_chars[char_data.char_name] = evechar;
            a++;
        }

        this.__characters = rest_chars;
        this.__id = _data.id;
        this.__mail = _data.mail;
        this.__password = _data.password;
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

        this.__base = base.base ;
        this.__id = base.id;
        this.__char_name = base.char_name;
        this.__expires_on = base.expires_on;
        this.__scopes = base.scopes;
        this.__character_owner_hash = base.character_owner_hash;
        this.__access_token = base.access_token;
        this.__token_type = base.token_type;
        this.__images = base.images;
        this.__refresh_token = base.refresh_token;

        this.__init();
    },
    destructor: function () {
        basic.prototype.destructor.call(this);
    },
    __init: function () {

    },
    char_name: function () {
        return this.__char_name;
    },
    images: function () {
        return this.__images;
    },
    save: function () {
        return {
            base: this.__base ,
            id: this.__id,
            char_name: this.__char_name,
            expires_on: this.__expires_on,
            scopes: this.__scopes,
            character_owner_hash: this.__character_owner_hash,
            access_token: this.__access_token,
            token_type: this.__token_type,
            images: this.__images,
            refresh_token: this.__refresh_token
        }
    },
    restore: function (_data) {
        this.__base = _data.base;
        this.__id = _data.id;
        this.__char_name = _data.char_name;
        this.__expires_on = _data.expires_on;
        this.__scopes = _data.scopes;
        this.__character_owner_hash = _data.character_owner_hash;
        this.__access_token = _data.access_token;
        this.__token_type = _data.token_type;
        this.__images = _data.images;
        this.__refresh_token = _data.refresh_token;
    }
});




module.exports = users;