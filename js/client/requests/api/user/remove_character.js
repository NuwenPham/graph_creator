/**
 * Created by Cubla on 05.05.2018.
 */
(function (_export) {
    var name = "js/client/requests/api/user/remove_character";
    var libs = [
        "js/client/basic",
        "js/client/requests/request",
    ];

    define(name, libs, function () {
        var request = require("js/client/requests/request");
        var remove_character = request.inherit({
            constructor: function page(_options) {
                var base = {
                    token_id: -1,
                    char_id: -1,
                    command_addr:  ["api", "user", "remove_character"]
                };
                Object.extend(base, _options);
                request.prototype.constructor.call(this, base);
                this.__token_id = base.token_id;
                this.__char_id = base.char_id;
            },
            data: function () {
                var data = request.prototype.data.call(this);
                data.token_id = this.__token_id;
                data.char_id = this.__char_id;
                return data;
            }
        });

        return remove_character;
    })
})(window);