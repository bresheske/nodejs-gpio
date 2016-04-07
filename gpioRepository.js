var repo = function() {};
var fs = require('fs');
var gpiodata = [
	{
		groupName: "Upstairs",
		data: [
			{
				name: "Bedroom",
				status: "off",
				id: 18
			},
			{
				name: "Kitchen",
				status: "off",
				id: 23
			},
			{
				name: "Hallway",
				status: "off",
				id: 24
			},
			{
				name: "Stairwell",
				status: "off",
				id: 25
			}
		]
	},
	{
		groupName: "Downstairs",
		data: [
			{
				name: "Hallway",
				status: "off",
				id: 12
			},
			{
				name: "Office",
				status: "off",
				id: 16
			},
			{
				name: "Bedroom",
				status: "off",
				id: 20
			},
			{
				name: "Livingroom",
				status: "off",
				id: 21
			}
		]
	}
];

// Local methods.
var checkStatus = function(id, callback){
	
	var file = "/sys/class/gpio/gpio" + id + "/value";
	fs.readFile(file, 'utf8', function(err, data) {
		// replacing all whitespace chars.  Seems to come back with a newline char.
		data = data.replace(/^\s+|\s+$/g, '');
		console.log("GPIO" + id + ":" + data);
		var val = data == "0"
			? true
			: false;
		callback(val);
	});
};

var writeStatus = function(id, value){
	var val = value == true
		? 0 
		: 1;
	console.log("Writing: ID: " + id + ", " + val);
	fs.writeFileSync('/sys/class/gpio/gpio' + id + '/value', val);
};

var toggleStatus = function(id){
	checkStatus(id, function(value){
		var val = !value;
		console.log("Toggling " + id + ". Current: " + value + ", New: " + val);
		writeStatus(id, val);
	});
};

var openAll = function() {
	gpiodata.forEach(function(group){
		group.data.forEach(function(gpiostatus){
			var file = '/sys/class/gpio/';
			
			// Unexport first.
			try{
				fs.writeFileSync(file + 'unexport', gpiostatus.id);
			}
			catch(ex){
				console.log("Warning: error unexporting id " + gpiostatus.id + ". Might not be exported. Ignoring...");
			}
			
			// Now export.
			fs.writeFileSync(file + 'export', gpiostatus.id);
			
			// Set directions
			fs.writeFileSync(file + 'gpio' + gpiostatus.id + '/direction', 'out');
		});
	});
};

// Public methods.
repo.prototype.toggleStatus = function(id){
	toggleStatus(id);
};

repo.prototype.openAll = function(){
	openAll();
};

repo.prototype.getAll = function(callback){
	var data = gpiodata;
	
	var count = 0;
	var total = 8;
	data.forEach(function(group){
		group.data.forEach(function(gpiostatus){
			// Get the status, set the result.
			checkStatus(gpiostatus.id, function(val){
				gpiostatus.status = val ? "on" : "off";
				
				count++;
				if (count === total)
					callback(data);
			});
		});
	});
};

module.exports = new repo();