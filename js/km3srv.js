var KM3srv = (function() {
    var self = {};

    self.ws = null;

    var onopen = function() {
        'use strict';
        self.ws.send("hello");
    };

    var onmessage = function (raw_message) {
        'use strict';
        var message = JSON.parse(raw_message.data);
        console.log(message);
        if(message.kind == "info") {
            RBA.log( message.data );
        }
        if(message.kind == "status") {
            var statusLbl = $("#statusLabel");
            statusLbl.removeClass("label-success label-warning label-danger");
            if(message.data == "busy") {
                statusLbl.addClass("label-warning");
            }
            if(message.data == "ready") {
                statusLbl.addClass("label-success");
            }
        }
        if(message.kind == "event") {
            draw_event(message.data);
        }
        if(message.kind == "token") {
            var token = message.data;
            $("#tokenLabel").text(token);
            $("#tokenLabel").data('clipboard-text', token);
            RBA.log( "Your token for remote display is " + token + "." );
        }
    };

    self.connect = function(hostname, port) {
        var url = "ws://" + hostname + ":" + port + "/test";
        self.ws = new WebSocket(url);
        RBA.log( "Connecting to " + hostname + ":" + port);
        self.ws.onopen = onopen;
        self.ws.onmessage = onmessage;
    }

    self.Connection = function(hostname, port) {

        self.connect(hostname, port);

        $("#loadEventBtn").click(function(){
            var det_id = $("#detectorInput").val();
            var run_id = $("#runInput").val();
            var event_id = $("#eventInput").val();
            self.ws.send("event/" + det_id + "/" + run_id + "/" + event_id);
        });


        $("#connectToKm3srvBtn").click(function(){
            var hostname = $("#km3srvHostInput").val();
            var port = $("#km3srvPortInput").val();
            console.log(hostname);
            console.log(port);
            self.ws.close();
            self.connect(hostname, port);
        });



    };

    return self;

}());
