'use strict';

var fs = require('fs');
var https = require('https');
var exec = require('child_process').exec;

var download = function(url, dest, cb) {
	fs.access(dest, function(err){
		if(err && err.code == 'ENOENT'){
			var file = fs.createWriteStream(dest);
			var request = https.get(url, function(response) {
				response.pipe(file);
				file.on('finish', function() {
					file.close(function(){
						fs.chmod(dest, '700', cb);
					});
				});
			});
			return;
		} 
		
		cb();
	});
}  

var init = function(options){
	var webrootPath = options.webrootPath;
	var host = options.host;
	var callback = options.callback;
	
	var cmd = __dirname + '/certbot-auto certonly --webroot -w ' + webrootPath + ' -d ' + host;
	
	download('https://dl.eff.org/certbot-auto', __dirname + '/certbot-auto', function(){		
		exec(cmd, function (error, stdout, stderr) {
			if (error !== null) {
				console.log('exec error: ' + error);
				return callback(error);
			}
			console.log(stdout);
			console.log(stderr);
			return callback();
		});
	});
}

module.exports = init;

