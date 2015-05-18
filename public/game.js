window.onload = function() {
	var socket = io();
	window.iosock = socket;
	socket.on('iam', function(data) {
		console.log('you are', data.uuid);
	});
	socket.on('player move', function(data) {
		console.log('player', data.uuid, 'moved to', data.x, data.y);
	});
	var canvas = window.document.getElementById('canvas');
	var _2d = canvas.getContext('2d');
	_2d.font = '20px monospace';
	_2d.fillStyle = '#990';
	var mouseX = 320;
	var mouseY = 240;
	var smoothX = mouseX;
	var smoothY = mouseY;
	canvas.onmousemove = function(e) {
		//console.log('x',e.offsetX,'y',e.offsetY);
		mouseX = e.offsetX;
		mouseY = e.offsetY;
		socket.emit('player move', {x:mouseX,y:mouseY});
	}
	var elapsed = 0;
	function frame(current) {
		var delta = (current - elapsed) / 1000;
		var distanceX = (mouseX - smoothX) / 8;
		var distanceY = (mouseY - smoothY) / 8;
		smoothX += distanceX;
		smoothY += distanceY;
		_2d.clearRect(0, 0, 640, 480);
		_2d.fillStyle = '#0f0'
		_2d.fillRect(smoothX - 10, smoothY - 10, 20, 20);
		_2d.fillStyle = '#ff0'
		_2d.fillRect(mouseX - 10, mouseY - 10, 20, 20);
		_2d.fillStyle = '#990'
		_2d.fillText('current time:' + current.toFixed(3), 10, 20);
		_2d.fillText('delta:' + delta.toFixed(4), 10,40);
		_2d.fillText('fps:' + (1.0 / delta).toFixed(4), 10, 60);
		_2d.fillText('x:' + mouseX + ' y:' + mouseY, 10, 80);
		_2d.fillText('sx:' + smoothX.toFixed(4) + ' sy:' + smoothY.toFixed(4), 10, 100);
		_2d.fillText('dx:' + Math.abs(distanceX).toFixed(4) + ' dy:' + Math.abs(distanceY).toFixed(4), 10, 120);
		elapsed = current;
		requestAnimationFrame(frame);
	}
	requestAnimationFrame(frame);
}
