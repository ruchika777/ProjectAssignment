var mongoose = require('mongoose');

var serverSchema = new mongoose.Schema({
	//id:String,
	name:String,
	ip:String,
	type:{type:{$in:['API','UI','Standalone']}},
	projectID:{type: mongoose.Schema.Types.ObjectId,ref:'project'},
	projectgroupID:{type: mongoose.Schema.Types.ObjectId,ref:'projectgroup'},
	username:{type:String,default:'root'},
	giturl:String
});

module.exports = serverSchema;