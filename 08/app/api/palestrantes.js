var mongoose = require('mongoose');

module.exports = function(app) {
	
	var Palestrante = mongoose.model('Palestrante');
	
	app.route('/palestrantes')
		.get(function(req, res) {
			Palestrante
				.find()
				.then(function(palestrantes) {
					res.json(palestrantes);		
				});
		});
};