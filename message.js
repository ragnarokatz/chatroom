// message.js

// Broadcast to all open connections
function broadcast(data) {
    Object.keys(connections).forEach(function (key) {
        var connection = connections[key];
        if (connection.connected) {
            connection.send(data);
        }
    });
}

// Send a message to a connection by its connectionID
function sendToConnectionId(connectionID, data) {
    var connection = connections[connectionID];
    if (connection && connection.connected) {
        connection.send(data);
    }
}

module.exports.processMessage = function processRequest(message, connection) {

}