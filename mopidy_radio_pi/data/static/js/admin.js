$(document).ready(function () {

    OpenWebSocketAdmin();

});


var OpenWebSocketAdmin = function () {
    if ("WebSocket" in window) {
        ws = new WebSocket("ws://192.168.1.66:6680/radio-pi_app/piWs?clientId=" + $('#hdnCurrentUser').val());
        ws.onopen = function () {

        };
        ws.onmessage = function (evt) {
            var received_msg = evt.data;
            var received_msg_obj = jQuery.parseJSON(received_msg);
            console.log(received_msg_obj);
        };
        ws.onclose = function () {

        };
    } else {
        alert('WebSockets NOT supported by your Browser!');
    }
}