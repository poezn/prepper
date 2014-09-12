'use strict';

var FS = require('fs'),
	fileIn,
	fileOut,
    SVGO = require('svgo'),
    prefix,
    svgo,
    fileConfig;

try {
	var args = process.argv.slice(2);
	fileIn = args[0];
	fileOut = args[1];
	prefix = args.length > 2 ? args[2] : "";
	fileConfig = args.length > 3 ? args[3] : [];
} catch (e) {
	console.error(e);
	console.error("usage: node index.js [fileIn] [fileOut] [prefix] [config-file]")
}

var readConfig = function() {
	FS.readFile(fileConfig, 'utf8', function(err, data) {
		var config = JSON.parse(data);
		config.push({
			"prefixIds": {
				"prefix": prefix	
			}
		});

		svgo = new SVGO({
	    	"full": true,
	    	"js2svg": {
	    		"pretty": true
	    	},
	    	"plugins": config
	    });

		transform();
	});

};

var transform = function() {
	FS.readFile(fileIn, 'utf8', function(err, data) {

	    if (err) {
	        throw err;
	    }

	    svgo.optimize(data, function(result) {

	        FS.writeFile(fileOut, result.data, function(err) {
			    if(err) {
			        console.log(err);
			    } else {
			        console.log("The file was saved!");
			        console.log(result.info);
			    }
	        });

	    });

	});

};

readConfig();