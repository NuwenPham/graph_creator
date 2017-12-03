/**
 * Created by Cubla on 20.09.2017.
 */

var basic = require("./../basic");

var users = basic.inherit({
    constructor: function ward(_options) {
        var options = {};
        Object.extend(options, _options);
        basic.prototype.constructor.call(this, options);

        this.__ward = options.ward;

        this.__init();
    },

    destructor: function () {
        basic.prototype.destructor.call(this);
    },

    __init: function () {
        this.__id = 0;
        this.__ready_promise = new promise();
        this.__is_ready = false;

        this.__ward.level().get(make_key(user_counter)).then(function (_data) {
            // if exist
            this.__id = parseInt(_data);
            console.log("user counter exist");
        }.bind(this), function () {
            // if not exist
            console.log("user counter creating...");
            return ward.level().set(make_key(user_counter), this.__id);
        }.bind(this)).then(function () {
            // if success set
            this.__ready_promise.resolve();
            console.log("user counter done");
            this.__is_ready = true;
        }.bind(this), function () {
            // if failed
            console.log("Something going wrong in set user_counter");
            this.__ready_promise.reject();
        }.bind(this));
    },

    add_user: function (_mail, _data) {
        var p = new promise();

        if (!this.is_ready()) p.reject("not_ready");

        ward.level().get(make_key(_mail)).then(function () {
            // if exist
            p.reject("already_exist")
        }, function (_err) {
            // if not exist
            var prarr = [];
            prarr.push(ward.level().set(make_key(_mail), {id: this.__id, data: _data}));
            prarr.push(ward.level().set(make_key(this.__id), _mail));
            prarr.push(ward.level().set(make_key(user_counter), this.__id + 1));
            return Promise.all(prarr);
        }.bind(this)).then(function () {
            // if success
            p.resolve(this.__id);
            this.__id++;
        }.bind(this), function (_err) {
            // if not success ??
            console.log("Something going wrong in set user_counter");
            p.reject(_err)
        });
        return p.native;
    },

    remove_user_by_id: function (_id) {

    },

    remove_user_by_mail: function (_id) {

    },

    get_user_mail_by_id: function (_id) {
        var p = new promise();
        ward.level().get(make_key(_id)).then(function (_mail) {
            p.resolve(_mail);
        }.bind(this), function () {
            p.reject();
        }.bind(this));
        return p.native;
    },

    get_user_by_id: function (_user_id) {
        var p = new promise();

        this.get_user_mail_by_id(_user_id).then(function (_mail) {
            return this.get_user_by_mail(_mail);
        }.bind(this), function () {
            p.reject("failed on get mail");
        }.bind(this)).then(function (_user_data) {
            p.resolve(_user_data);
        }.bind(this), function () {
            p.reject("failed get user data");
        }.bind(this));

        return p.native;
    },

    get_user_by_mail: function (_mail) {
        var p = new promise();
        ward.level().get(make_key(_mail)).then(function (_data) {
            //debugger;
            p.resolve(_data);
        }.bind(this), function (_err) {
            //console.log(_err);
            p.reject();
        }.bind(this));
        return p.native;
    },

    attach_eve_account: function (_mail, _account_data) {
        var p = new promise();
        ward.level().get(make_key(_mail)).then(function (_data) {
           // debugger;
            var user_data = _data.data;
            var accounts = user_data.eve_accounts;
            if(!accounts){
                accounts = {};
            }

            if(accounts[_account_data.char_id]){
                p.reject("such account already attached");
                return;
            }

            accounts[_account_data.char_id] = {
                char_name: _account_data.char_name,
                expires_on: _account_data.expires_on,
                scopes: _account_data.scopes,
                character_owner_hash: _account_data.character_owner_hash,
                access_token: _account_data.access_token,
                token_type: _account_data.token_type,
                refresh_token: _account_data.refresh_token
            };

            user_data.eve_accounts = accounts;
            return ward.level().set(make_key(_mail), _data);
        }.bind(this), function (_err) {
            p.reject("such user does not exist");
        }.bind(this)).then(function () {
            p.resolve();
        }.bind(this), function () {
            p.reject("can not write this mail");
        }.bind(this));
        return p.native;
    },

    update_account_data: function (_user_id, _account_id, _new_data) {
        var p = new promise();
        var mail;
        this.get_user_mail_by_id(_user_id).then(function(_data){
            mail = _data;
            return ward.level().get(make_key(mail));
        }, function () {
            //failed on get mail
            p.reject("failed on get mail");
            debugger;
        }).then(function (_data) {
            var user_data = _data.data;
            var accounts = user_data.eve_accounts;
            var acc_data = accounts[_account_id];
            if(!acc_data){
                p.reject("such account not attached");
                return;
            }
            for(var k in _new_data){
                acc_data[k] = _new_data[k];
            }
            return ward.level().set(make_key(mail), _data);
        }, function (_error) {
            // failed on get user
            p.reject("failed on get user");
            debugger;
        }).then(function () {
            p.resolve();
        }, function (_error) {
            // failed on try set data
            p.reject("failed on try set data");
            debugger;
        });
        return p.native;
    },

    ready_promise: function () {
        return this.__ready_promise.native;
    },

    is_ready: function () {
        return this.__is_ready;
    }

});




var user_counter = "user_counter";
var prefix = "users";
var make_key = function (_key) {
    return prefix + "_" + _key;
};

module.exports = users;