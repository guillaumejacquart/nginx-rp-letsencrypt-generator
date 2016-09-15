'use strict';

var LE = require('letsencrypt');
var staticServer = require('node-static');
var http = require('http');
var le_store = require('le-store-certbot');
var le_challenge = require('le-challenge-fs');
var le, server;


function leAgree(opts, agreeCb) {
	// opts = { email, hosts, tosUrl }
	agreeCb(null, opts.tosUrl);
}

var init = function(options){
	var configDir = options.configDir;
	var webrootPath = options.webrootPath;
	var host = options.host;
	var email = options.email;
	var callback = options.callback;
	
	// Storage Backend
	var leStore = le_store.create({
		configDir: configDir,
		debug: true
	});

	// ACME Challenge Handlers
	console.log(webrootPath);
	var leChallenge = le_challenge.create({
		webrootPath: webrootPath,
		debug: true
	});
	
	var file = new staticServer.Server('./public');

	server = require('http').createServer(function (request, response) {
		request.addListener('end', function () {
			file.serve(request, response);
		}).resume();
	})
	server.listen(8888);
	
	console.log('Creating LE object...');	
	le = LE.create({
		server: LE.stagingServerUrl,                           // or LE.productionServerUrl
		webrootPath: webrootPath,
		store: leStore,                                        // handles saving of config, accounts, and certificates
		challenges: { 'http-01': leChallenge },                // handles /.well-known/acme-challege keys and tokens
		challengeType: 'http-01',                              // default to this challenge type
		agreeToTerms: leAgree,                                 // hook to allow user to view and accept LE TOS
		debug: true,
		// log: function (debug) {
			// console.log(debug);
		// }
	});
	
	console.log('Check LE certs existing...');
	
	// Check in-memory cache of certificates for the named host
	le.check({ hosts: [host] }).then(function (results) {
		if (results) {
			// we already have certificates
			callback(null, results);
			return;
		}

		console.log('Registering LE certificates...');
		// Register Certificate manually
		le.register({
			domains: [host],                              	// CHANGE TO YOUR DOMAIN (list for SANS)
			email: email,                      					// CHANGE TO YOUR EMAIL
			agreeTos: 'tosUrl',                             	// set to tosUrl string (or true) to pre-approve (and skip agreeToTerms)
			rsaKeySize: 2048,                               	// 2048 or higher
			challengeType: 'http-01',                       	// http-01, tls-sni-01, or dns-01
		}).then(function (results) {
			console.log('success');
			server.close();
			callback(null, results);
		}, function (err) {			
			callback(err);
			server.close();
		});

	});
}

module.exports = init;

