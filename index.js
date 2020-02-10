require('dotenv').config()

var express = require('express');
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

app.use(express.static(__dirname + '/public'));

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', function (socket) {
    console.log('a user connected');
});

http.listen(process.env.PORT, function () {
    console.log(`Chatroom server is listening on port ${process.env.PORT}`);
});
