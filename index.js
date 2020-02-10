var app = require('express')();
var http = require('http').createServer(app);

app.get('/', function(req, res){
  res.send('<h1>Hello world</h1>');
});

http.listen(process.env.PORT, function(){
  console.log(`Chatroom server is listening on port ${process.env.PORT}`);
});
