var express = require('express');
var app = express()
	,consign = require('consign')
	,bodyParser = require('body-parser');

app.use(express.static('public'));
app.use(bodyParser.json());

consign({cwd: 'app'})
    .include('models')
    .then('api')
    .then('routes')
    .into(app);

module.exports = app;






