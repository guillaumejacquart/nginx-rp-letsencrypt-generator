'use strict';

var fs = require('fs');
var https = require('https');
const spawn = require('child_process').spawn;

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
	
	var cmd = process.cwd() + '/certbot-auto';

	download('https://dl.eff.org/certbot-auto', process.cwd() + '/certbot-auto', function(){
		const ls = spawn(cmd, ['certonly', '--webroot', '-w ', webrootPath, '-d', host]);

		ls.stdout.on('data', function(data){
			console.log(data);
		});

		ls.stderr.on('data', function(data){
			console.log('stderr: ' + data);
		});

		ls.on('close', function(code){
			return callback();
		});
	});
}

module.exports = init;

