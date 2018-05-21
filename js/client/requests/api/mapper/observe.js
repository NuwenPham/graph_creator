/**
 * Created by Cubla on 05.05.2018.
 */
(function (_export) {
    var name = "js/client/requests/api/mapper/observe";
    var libs = [
        "js/client/basic",
        "js/client/requests/request",
    ];

    define(name, libs, function () {
        var request = require("js/client/requests/request");
        var observe = request.inherit({
            constructor: function page(_options) {
                var base = {
                    token_id: -1,
                    id: -1,
                    command_addr:  ["api", "mapper", "observe"]
                };
                Object.extend(base, _options);
                request.prototype.constructor.call(this, base);
                this.__token_id = base.token_id;
                this.__id = base.id;
            },
            data: function () {
                var data = request.prototype.data.call(this);
                data.token_id = this.__token_id;
                data.id = this.__id;
                return data;
            }
        });

        return observe;
    })
})(window);