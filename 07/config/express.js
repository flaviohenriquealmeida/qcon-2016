var express = require('express');
var app = express()
	,consign = require('consign');

app.use(express.static('public'));

consign({cwd: 'app'})
	.include('api')
	.into(app);

module.exports = app;






