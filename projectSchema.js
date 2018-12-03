var mongoose = require('mongoose');

var projectSchema = new mongoose.Schema({
	//id:String,
	name:String,
	url:String
});

module.exports = projectSchema;