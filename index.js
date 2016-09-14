var mu = require('mu2'); // notice the "2" which matches the npm repo, sorry..
var fs = require('fs');

var wstream = fs.createWriteStream('myOutput.txt');

mu.root = __dirname + '/templates'
mu.compileAndRender('ssl.mu', {
	host: "test.dynalias.org",
	ip: "192.168.0.1",
	port: 80
})
.on('data', function (data) {
	wstream.write(data);
});