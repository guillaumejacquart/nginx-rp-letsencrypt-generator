var le = require('./le');
var nginx = require('./nginx');
var program = require('commander');

function init(){ 
	program
	  .version('0.0.1')
	  .option('-d, --domain [domain]', 'Set the domain you want the certificate for')
	  .option('-p, --nginx-proxy-pass [http uri or socket]', 'The nginx proxy pass for the domain')
	  .option('-lc, --le-config-dir [path]', 'The root config path for lets encrypt [/etc/letsencrypt]', '/etc/letsencrypt')
	  .option('-lw, --le-webroot-path [path]', 'The root path for lets encrypt static file [/var/www/html]', '/var/www/html')
	  .option('-nc, --nginx-config-path [path]', 'The root path for nginx config file [/etc/nginx/sites-available]', '/etc/nginx/sites-available')
	  .option('-ncl, --nginx-config-symlink-path [path]', 'The root path for nginx config simlink file [/etc/nginx/sites-enabled]', '/etc/nginx/sites-enabled')
	  .parse(process.argv);
	 
	var options = {
		domain: program.domain,
		nginxProxyPass: program.nginxProxyPass,
		leConfigDir: program.leConfigDir,
		leWebrootPath: program.leWebrootPath,
		nginxConfigPath: program.nginxConfigPath,
		nginxConfigSymlinkPath: program.nginxConfigSymlinkPath,
	}

	var errors = [];

	if(!options.domain){
		errors.push('You must fill out the domain option !');
	}

	if(!options.nginxProxyPass){
		errors.push('You must fill out the proxy path option !');
	}

	if(errors.length > 0){
		errors.forEach(function(e){
			console.log(e);
		});
		return;
	}

	le({
		configDir: options.leConfigDir,
		webrootPath: options.leWebrootPath,
		domain: options.domain,
		email: options.email,
		callback: function(err){
			
			if(err){			
				console.log(err.stack);
				return;
			}
			
			var privkey = options.leConfigDir + '/live/' + options.domain + '/privkey.pem';
			var fullchain = options.leConfigDir + '/live/' + options.domain + '/fullchain.pem';
			
			nginx({
				path: options.nginxConfigPath,
				domain: options.domain,
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
}

module.exports = init;