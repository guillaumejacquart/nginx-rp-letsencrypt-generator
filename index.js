var le = require('./le');
var nginx = require('./nginx');

var options = {
	host: 'nam.kicks-ass.org',
	email: 'contact@guillaumejacquart.com',
	leConfigDir: 'etc/letsencrypt',
	leWebrootPath: './public/.well-known/acme-challenge',
	nginxConfigPath: 'etc/nginx/sites-available',
	nginxConfigSymlinkPath: 'etc/nginx/sites-enabled',
	nginxProxyPass: 'http://192.168.0.21:8080',
}

le({
	configDir: options.leConfigDir,
	webrootPath: options.leWebrootPath,
	host: options.host,
	email: options.email,
	callback: function(err, result){
		
		if(err){			
			console.log(err.stack);
			return;
		}
		
		var privkey = options.leConfigDir + '/live/' + options.host + '/privkey.pem';
		var fullchain = options.leConfigDir + '/live/' + options.host + '/fullchain.pem';
		
		nginx({
			path: options.nginxConfigPath,
			host: options.host,
			symlinkPath: options.nginxConfigSymlinkPath,
			proxy_pass: options.nginxProxyPass,
			fullchain: fullchain,
			privkey: privkey,
			callback: function(err, data){
				if(err){
					console.log(err);
					return;
				}
				console.log(data);
			}
		});
	}
})