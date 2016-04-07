// Dependencies
var express = require('express');
var fs = require('fs');
var http = require('http');
var repo = require('./gpioRepository.js');
var bodyparser = require('body-parser');

// Local vars
var app = express();

// Enable public for jquery, bootstrap.
app.use(express.static('client'));
app.use(bodyparser.json());

// Index file.
app.get('/', function(req, res) {
	fs.readFile(__dirname + "/" + 'index.html', 'utf8', function(err, data) {
		res.end(data);
	});
});

// API for getting the GPIO.
app.get('/GetGPIO', function(req, res){
	var data = repo.getAll(function(data){
		res.json(data);
	});
});

// API for toggling a GPIO.
app.post('/ToggleGPIO', function(req, res){
	
	repo.toggleStatus(req.body.id);
	
	// return the full results.
	var data = repo.getAll(function(data){
		res.json(data);
	});
});

// Spin the server up. Control-C to cancel.
var server = app.listen(8080, function() {
	var host = server.address().address;
	var port = server.address().port;

	// Open our GPIO ports.
	console.log("Opening GPIO ports...");
	repo.openAll();
	
	console.log('Server listening at http://%s:%s', host, port);
});
