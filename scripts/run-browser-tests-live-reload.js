#!/usr/bin/env node

var budo = require('budo');
var url = require('url');
var qs = require('querystring');


budo([__dirname+'/../tests/browser-test-runner-live.js'], {
	live: true,
	stream: process.stdout,
	port: 9966,
	debug: true,
	open: true,
	title: 'store.js browser tests',
	middleware: function(req, res, next) {
		if (url.parse(req.url).pathname === '/api') {

			if (req.method == 'POST') {
			    var body = '';

			    req.on('data', function (data) {
			        body += data;
			        // Too much POST data, kill the connection!
			        // 1e6 === 1 * Math.pow(10, 6) === 1 * 1000000 ~~~ 1MB
			        if (body.length > 1e6)
			            req.connection.destroy();
			    });

			    req.on('end', function () {
			        var post = qs.parse(body);
			        var data = [];
			        if ( typeof post['json'] == 'string') {
			        	try{
			        		data = JSON.parse(decodeURIComponent(post['json']));
			        	} catch(e){}
			        }

			        if ( typeof post['namespace'] == 'string') {
			        	data['_namespace'] = decodeURIComponent(post['namespace']);
			        }

			        res.statusCode = 200
				    res.end(JSON.stringify(data));
			    });
			}
	      
	    } else if (url.parse(req.url).pathname === '/pull.json') {
	    	var data = null;
	    	var query = qs.parse(url.parse(req.url).query);
	    	var name = decodeURIComponent(query['namespace']) || 'pull.json';
	    	try {
	    		data = require('../tests/' + name );
	    	}catch(e){}

	    	res.statusCode = 200
	    	res.end(JSON.stringify(data));

	    } else {
	      next()
	    }
	}
})
