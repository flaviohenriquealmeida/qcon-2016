var mongoose = require('mongoose');

var schema = mongoose.Schema({
  nome: { 
    type: String, 
    required: true,
    index: {
      unique: true
    }
  }, 
  palestra: {
    type: String, 
    required: true
  }
});

mongoose.model('Palestrante', schema);
