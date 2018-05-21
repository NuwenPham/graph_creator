/**
 * Created by Cubla on 05.05.2018.
 */
(function (_export) {
    var name = "js/client/requests/api/mapper/topo";
    var libs = [
        "js/client/basic",
        "js/client/requests/request"
    ];

    define(name, libs, function () {
        var request = require("js/client/requests/request");
        var list = request.inherit({
            constructor: function page(_options) {
                var base = {
                    token_id: -1,
                    map_id: -1,
                    command_addr:  ["api", "mapper", "topo"]
                };
                Object.extend(base, _options);
                request.prototype.constructor.call(this, base);
                this.__map_id = base.map_id;
                this.__token_id = base.token_id;
            },
            data: function () {
                var data = request.prototype.data.call(this);
                data.map_id = this.__map_id;
                data.token_id = this.__token_id;
                return data;
            }
        });

        return list;
    })
})(window);