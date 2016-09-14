'use strict';

var LE = require('letsencrypt');
var staticServer = require('node-static');
var http = require('http');
var le_store = require('le-store-certbot');
var le_challenge = require('le-challenge-fs');
var le;

var init = function(options){
	var configDir = options.configDir;
	var webrootPath = options.webrootPath;
	var domain = options.domain;
	var email = options.email;
	var callback = options.callback;
	
	// Storage Backend
	var leStore = leStore.create({
		configDir: configDir,
		debug: false
	});


	// ACME Challenge Handlers
	var leChallenge = le_challenge.create({
		webrootPath: webrootPath,
		debug: false
	});

	var file = new staticServer.Server(webrootPath);
	 
	http.createServer(function (request, response) {
		request.addListener('end', function () {
			file.serve(request, response);
		}).resume();
	}).listen(80);
	startLECheck(leStore, leChallenge, domain, email, callback);
}

function leAgree(opts, agreeCb) {
	// opts = { email, domains, tosUrl }
	agreeCb(null, opts.tosUrl);
}

var startLECheck = function(leStore, leChallenge, domain, email){

	le = LE.create({
		server: LE.stagingServerUrl,                           // or LE.productionServerUrl
		store: leStore,                                        // handles saving of config, accounts, and certificates
		challenges: { 'http-01': leChallenge },                // handles /.well-known/acme-challege keys and tokens
		challengeType: 'http-01',                              // default to this challenge type
		agreeToTerms: leAgree,                                 // hook to allow user to view and accept LE TOS
		debug: false,
		log: function (debug) {
			console.log(debug);
		}
	});
	
	// Check in-memory cache of certificates for the named domain
	le.check({ domains: [domain] }).then(function (results) {
		if (results) {
			// we already have certificates
			return;
		}

		// Register Certificate manually
		le.register({
			domains: [domain],                              	// CHANGE TO YOUR DOMAIN (list for SANS)
			email: email,                      					// CHANGE TO YOUR EMAIL
			agreeTos: 'tosUrl',                             	// set to tosUrl string (or true) to pre-approve (and skip agreeToTerms)
			rsaKeySize: 2048,                               	// 2048 or higher
			challengeType: 'http-01',                       	// http-01, tls-sni-01, or dns-01
		}).then(function (results) {
			console.log('success');
			callback(null, results);
		}, function (err) {
			console.error('[Error]: ');
			console.error(err.stack);
			
			callback(err);
		});

	});
}

init({
	configDir: 'letsencrypt/etc',
	webrootPath: 'webroot',
	domain: 'nam.kicks-ass.org',
	email: 'contact@guillaumejacquart.com',
	callback: function(err, result){
		console.log(err || results);
	}
});

