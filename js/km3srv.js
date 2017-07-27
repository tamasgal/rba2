var KM3srv = (function() {
    var self = {};

    self.Connection = function(url) {
        var ws = new WebSocket(url);

        $("#loadEventBtn").click(function(){
            var det_id = $("#detectorInput").val();
            var run_id = $("#runInput").val();
            var event_id = $("#eventInput").val();
            ws.send("event/" + det_id + "/" + run_id + "/" + event_id);
        });


        ws.onopen = function() {
            'use strict';
            ws.send("hello");
        };

        ws.onmessage = function (raw_message) {
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
    };

    return self;

}());
