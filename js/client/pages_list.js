(function (_export) {
    var name = "js/client/pages_list";
    var libs = [
        "js/client/pages/graph_editor",
        "js/client/pages/hello_page",
        "js/client/pages/auth",
        "js/client/pages/reg",
        "js/client/pages/error_page",
        "js/client/pages/ccp_auth_page",
        "js/client/pages/ccp_auth_response",
        "js/client/pages/ccp_refresh_token",
        "js/client/pages/chars_list",
        "js/client/pages/common_page"
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