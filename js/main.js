/**
 * Created by Cubla on 07.08.2017.
 */
(function(_export){
    var libs = [
        "js/utils/pixi.min.js",
        "js/utils/leaflet/leaflet-src.js",

        "js/baseClass",
        "js/types/point",
        "js/client/dispatcher",
        "js/client/navigation"
    ];

    define(libs, function(){
        load_css("css/center.css");

        var v = Object.create(null);
        _export.v = v;

        var point = require("js/types/point");
        var navigation = require("js/client/navigation");
        v.point = point;


         var d = require("js/client/dispatcher");
         var dispatcher = new d();

        _export.nav = new navigation();


        //_export.nav = new navigation();
        //var page = location.hash !== undefined && (location.hash).slice(1);
        //_export.nav.open( page || "hello_page" );

         var handshake_handler = function (_data) {

             _export.server = Object.create(null);
             _export.server.server_id = _data.server_id;

             var page = location.hash !== undefined && (location.hash).slice(1);

             var query = nav.parse_query();
             if(query.state) {
                 sessionStorage.setItem("code", query.code);
                 location.href = location.origin + location.pathname + "#" + query.state;
                 return;
             }


             _export.nav.open( page || "hello_page" );
         };

         dispatcher.on("new_connection", handshake_handler);
         _export.dispatcher = dispatcher;


        var before_open = function () {return false;};

        nav.on("before_open", before_open);

    });
})(window);
