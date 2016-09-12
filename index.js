//http://socket.io/get-started/chat/
var express = require('express');
var app = require('express')();

var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static(__dirname + '/client'));

/*app.get('/', function(req, res){
  res.sendfile('index.html');
});
*/
io.on('connection', function(socket){
  console.log('a user connected');
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
  socket.on('chat message', function(msg){
    console.log('message: ' + msg);
     io.emit('chat message', msg);
  });
});

http.listen(4000, function(){
  console.log('listening on *:4000');
});