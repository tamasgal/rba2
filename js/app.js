$(document).ready(function() {

    // var km3srv = new KM3srv.Connection("ws://maroff1.in2p3.fr:8088/test");
    var km3srv = new KM3srv.Connection("localhost", 8088);
    //var km3srv = new KM3srv.Connection("ws://evalu176.ific.uv.es:8088/test");

    var clipboard = new Clipboard('#tokenLabel');

    clipboard.on('success', function(e) {
	console.info('Action:', e.action);
	console.info('Text:', e.text);
	console.info('Trigger:', e.trigger);

	e.clearSelection();
    });

    clipboard.on('error', function(e) {
	console.error('Action:', e.action);
	console.error('Trigger:', e.trigger);
    });

});
