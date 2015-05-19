window.onload = function() {
	var canvas = window.document.getElementById('canvas');
	var width = canvas.width / 2.0;
	var height = canvas.height / 2.0;
	var _2d = canvas.getContext('2d');
	_2d.font = '14px monospace';
	_2d.fillStyle = '#990';
	var players = {};
	window.plss = players;
	var socket = io();
	socket.on('iam', function(data) {
		window.iAm = data.uuid;
		console.log('you are', iAm);
		players[iAm] = {x: width, y: height,smoothX: width, smoothY: height};
	});
	socket.on('player move', function(data) {
		if(!players[data.uuid]) {
			players[data.uuid] = {x: 0, y: 0, smoothX: data.x, smoothY: data.y};
		}
		players[data.uuid].x = data.x;
		players[data.uuid].y = data.y;
	});
	socket.on('left', function(data) {
		console.log('who left:', data.uuid);
		delete players[data.uuid];
	});
	function move(x,y) {
		if (!window['iAm']) return;
		players[iAm].x = x;
		players[iAm].y = y;
		socket.emit('player move', {x: x, y: y});
	}
	canvas.onmousemove = function(e) {
		move(e.offsetX, e.offsetY);
	}
	canvas.addEventListener('touchmove', function(e) {
		e.preventDefault();
		console.log(e.changedTouches);
		move(e.changedTouches[0].pageX, e.changedTouches[0].pageY);
	});
	var elapsed = 0;
	function frame(current) {
		var delta = (current - elapsed) / 1000;
		// move players (including myself)
		_2d.clearRect(0, 0, 640, 480);
		for(var k in players) {
			var player = players[k];
			var distanceX = (player.x - player.smoothX) / 8;
			var distanceY = (player.y - player.smoothY) / 8;
			player.smoothX += distanceX;
			player.smoothY += distanceY;
			_2d.fillStyle = k == window.iAm ? '#f00' : '#00f';
			_2d.fillRect(player.smoothX - 5, player.smoothY - 5, 10, 10);
			_2d.fillStyle = k == window.iAm ? '#ff0' : '#0ff';
			_2d.fillRect(player.x - 5, player.y - 5, 10, 10);
			if (k === iAm) {
				_2d.fillStyle = '#990'
				_2d.fillText('current time:' + current.toFixed(3), 10, 20);
				_2d.fillText('delta:' + delta.toFixed(4), 10,40);
				_2d.fillText('fps:' + (1.0 / delta).toFixed(4), 10, 60);
				_2d.fillText('x:' + player.x.toFixed(4) + ' y:' + player.y.toFixed(4), 10, 80);
				_2d.fillText('sx:' + player.smoothX.toFixed(4) + ' sy:' + player.smoothY.toFixed(4), 10, 100);
				_2d.fillText('dx:' + Math.abs(distanceX).toFixed(4) + ' dy:' + Math.abs(distanceY).toFixed(4), 10, 120);
			}
		}
		elapsed = current;
		requestAnimationFrame(frame);
	}
	requestAnimationFrame(frame);
}
