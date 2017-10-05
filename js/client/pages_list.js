(function (_export) {
    var name = "js/client/pages_list";
    var libs = [
        "js/client/pages/auth",
        "js/client/pages/hello_page",
        "js/client/pages/main_menu",
        "js/client/pages/error_404",
        "js/client/pages/game_field",
        "js/client/pages/games_list",
        "js/client/pages/reg",
        "js/client/pages/game_field_2"
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