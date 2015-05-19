var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var uuid = require('uuid');

app.use(express.static('public'));

io.on('connection', function(socket) {
	//console.log('a user connected');
	var user = uuid();
	socket.emit('iam',{uuid:user});
	socket.on('disconnect',function() {
		io.emit('left', {uuid:user});
	});
	socket.on('player move', function(data) {
		socket.broadcast.emit('player move', {uuid:user, x:data.x, y:data.y});
	});
});

http.listen(51914, function() {
	console.log('listening on *:51914');
});
