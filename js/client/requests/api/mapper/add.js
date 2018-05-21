/**
 * Created by Cubla on 05.05.2018.
 */
(function (_export) {
    var name = "js/client/requests/api/mapper/add";
    var libs = [
        "js/client/basic",
        "js/client/requests/request"
    ];

    define(name, libs, function () {
        var request = require("js/client/requests/request");
        var add = request.inherit({
            constructor: function page(_options) {
                var base = {
                    token_id: -1,
                    password: "",
                    name: "",
                    command_addr:  ["api", "mapper", "add"]
                };
                Object.extend(base, _options);
                request.prototype.constructor.call(this, base);
                this.__token_id = base.token_id;
                this.__password = base.password;
                this.__name = base.name;
            },
            data: function () {
                var data = request.prototype.data.call(this);
                data.token_id = this.__token_id;
                data.password = this.__password;
                data.name = this.__name;
                return data;
            }
        });

        return add;
    })
})(window);