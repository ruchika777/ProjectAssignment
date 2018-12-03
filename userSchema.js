var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
	name:String,
	password:String,
	allowedServerID:{type: mongoose.Schema.Types.ObjectId,
				ref: 'server'},
	publickey:String
});

module.exports = userSchema;