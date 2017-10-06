(function (_export) {
    var name = "js/client/pages_list";
    var libs = [
        "js/client/pages/graph_editor",
        "js/client/pages/error_page"
    ];
    define(name, libs, function () {
        var obj = {};
        var a = 0;
        while( a < libs.length){
            var path = libs[a];
            var arr_path = path.split("/");
            var last_hop = arr_path[arr_path.length - 1];
            obj[last_hop] = require(path);
            a++;
        }
        return obj;
    })
})(window);