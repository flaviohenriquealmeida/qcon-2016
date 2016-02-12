var mongoose = require('mongoose');

module.exports = function(app) {
	
	var Palestrante = mongoose.model('Palestrante');
	
	var api = {};

	api.lista = function(req, res) {
		Palestrante
			.find()
			.then(function(palestrantes) {
				res.json(palestrantes);		
			});
	};

	api.adiciona = function(req, res) {
		Palestrante
		.create(req.body)
		.then(function(palestrante) {
			res.status(200).send(palestrante);
		});
	};
	
	api.deleta = function(req, res) {
		var id = req.params.id;
		Palestrante.remove({"_id" : id})
		.then(
		function() {
			 res.status(204).end();	
		}, 
		function(err) {
			return console.error(erro);
		});
	};

	api.buscaPorId = function(req, res) {

		var _id = req.params.id;
		Palestrante.findById(_id)
		.then(function(palestrante) {
			if (!palestrante) throw new Error("Palestrante não encontrado");
				res.json(palestrante) 		
			}, 
			function(erro) {
				console.log(erro);
				res.status(404).json(erro);
			});		
	};

	api.altera = function(req, res) {

		var id = req.params.id;
		var palestrante = req.body;

		console.log(id);
		console.log(palestrante);

		Palestrante.findByIdAndUpdate(id, palestrante)
			.then(function(palestrante) {
				res.json(palestrante);
			 }, 
			 function(erro) {
			 	console.error(erro);
			 		res.status(500).json(erro);
			 	 }
			 );
	};

	return api;
};

