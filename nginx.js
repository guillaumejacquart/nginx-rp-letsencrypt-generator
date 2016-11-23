var mu = require('mu2'); // notice the "2" which matches the npm repo, sorry..
var fs = require('fs');
var Path = require('path');

function createRPVhost(options){
	var path = options.path;
	var domain = options.domain;
	var proxy_pass = options.proxy_pass;	
	var symlinkPath = options.symlinkPath;
	var fullchain = options.fullchain;	
	var privkey = options.privkey;
	var callback = options.callback;
	
	var configFile = Path.join(path, domain);
	
	var wstream = fs.createWriteStream(configFile);

	mu.root = __dirname + '/templates'
	mu.compileAndRender('ssl.mu', {
		domain: domain,
		proxy_pass: proxy_pass,
		fullchain: fullchain,
		privkey: privkey
	})
	.on('data', function (data) {
		wstream.write(data);
	})
	.on('end', function(){
		var symlinkFile = Path.join(symlinkPath, domain);
		fs.symlink(configFile, symlinkFile, callback);
	});
}

module.exports = createRPVhost;