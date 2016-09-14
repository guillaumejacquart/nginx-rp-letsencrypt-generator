var mu = require('mu2'); // notice the "2" which matches the npm repo, sorry..
var fs = require('fs');
var Path = require('path');

function createRPVhost(options){
	var path = options.path;
	var host = options.host;
	var proxy_pass = options.proxy_pass;	
	var symlinkPath = options.symlinkPath;
	var fullchain = options.fullchain;	
	var privkey = options.privkey;
	var callback = options.callback;
	
	var configFile = Path.join(path, host);
	var wstream = fs.createWriteStream(configFile);

	mu.root = __dirname + '/templates'
	mu.compileAndRender('ssl.mu', {
		host: host,
		proxy_pass: proxy_pass,
		fullchain: fullchain,
		privkey: privkey
	})
	.on('data', function (data) {
		wstream.write(data);
	})
	.on('end', function(){
		var symlinkFile = Path.join(symlinkPath, host);
		fs.symlink(configFile, symlinkFile, callback);
	});
}

module.exports = createRPVhost;