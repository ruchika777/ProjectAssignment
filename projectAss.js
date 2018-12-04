var express = require('express');
var http = require('http');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
var serverSchema = require('./serverSchema');
var projectSchema = require('./projectSchema');
var projectGroupSchema = require('./projectGroupSchema');
var userSchema = require('./userSchema');
app.listen(3000);

mongoose.connect('mongodb://localhost/ProjectDB', {useNewUrlParser : true}, function(err, db){
	if(err){
		console.log(err);
	}

	else console.log("Connected...");
});

var server1 = mongoose.model('Server', serverSchema);
var project1 = mongoose.model('Project', projectSchema);
var projectgroup1 = mongoose.model('ProjectGroup',projectGroupSchema);
var user1 = mongoose.model('User', userSchema);

app.get('/', (req,res)=>{
	res.send("Hey!");
});

///Server

app.post('/addServer', (req,res)=>{
	var server01 = new server1({
		name : req.body.name,
		ip : req.body.ip,
		type : req.body.type,
		projectID : req.body.projectID,
		projectgroupID : req.body.projectgroupID,
		giturl : req.body.giturl
	});

	console.log(req.body);

	server01.save(function(err, db){
	if(err){
		res.send(err);
	}
	else{
		res.send("Successfully Inserted...");
	}
});
});

app.get('/allServers', (req, res)=>{
	server1.find().then(servers => {
		res.send(servers);
	});
});

app.put('/updateServer/:serverID', (req, res)=>{
	server1.findOneAndUpdate({_id:req.params.serverID}, {$set:{
		name : req.body.name,
		ip : req.body.ip,
		type : req.body.type,
		// project : req.body.project,
		// projectgroup : req.body.projectgroup,
		 giturl : req.body.giturl
		}}, {new : true}).then(ser1 =>{
			if(!ser1){
				return res.status(404).send({
                message: "Server not found with id " + req.params.empId
            });
			}
			else res.send(ser1);
		    console.log(req.body);
		});
});

app.delete('/deleteServer/:serverID',(req, res)=>{
	server1.remove({_id: req.params.serverID}).then(ser1 =>{
		if(!ser1){
			return res.status(404).send({
                message: "Server not found with id " + req.params.empId
            });    
		}
		else  res.send("Server details removed...");
	});
});

//GroupBy projectID & projectGroupID

app.get('/ServerlistByProjectID', (req, res)=>{
	server1.aggregate([
        {
            $group: {
                _id: '$projectID',  
                ServerName: {'$push':'$name'},
                count: {$sum: 1}
            }
        }
    ], function (err, result) {
        if (err) {
            next(err);
        } else {
            res.json(result);
        }
    });

})


app.get('/ServerlistByProjectGroupID', (req, res)=>{
	server1.aggregate([
        {
            $group: {
                _id: '$projectgroupID',  
                ServerName: {'$push':'$name'},
                count: {$sum: 1}
            }
        }
    ], function (err, result) {
        if (err) {
            next(err);
        } else {
            res.json(result);
        }
    });

})

///POPULATE METHOD
app.get('/ServerlistByProjectIDProjectGroupIDs', (req, res)=>{
	server1.find({}).populate('projectID').populate('projectgroupID').exec(function(err, data){
		if(err){
			res.send(err);
			console.log(err);
		}
		else{
			res.send(data);
			console.log("Done...");
		}
	});
});


///Project 

app.post('/addProject', (req, res)=>{

		var proj = new project1({
		name : req.body.name,
		url : req.body.url
	});

	console.log(req.body);


	proj.save(function(err, db){
	if(err){
		res.send(err);
	}
	else{
		res.send("Project details Successfully Inserted...");
	}
});

});

app.get('/allProjects', (req, res)=>{
	project1.find().then(projs => {
		res.send(projs);
	});
});

app.put('/updateProject/:id', (req, res)=>{
	project1.findOneAndUpdate({_id:req.params.id}, {$set:{
		//id: req.params.id,
		name : req.body.name,
		url : req.body.url
	}}, {new : true}).then(proj1 => {
		if(!proj1){
			return res.status(404).send({
                message: "Project not found with id " + req.params.id
            });

		}

		else res.send(proj1);
		console.log(req.body);
	});
});


app.delete('/deleteProject/:projID',(req, res)=>{
	project1.remove({_id: req.params.projID}).then(proj1 =>{
		if(!proj1){
			return res.status(404).send({
                message: "Project not found with id " + req.params.projID
            });    
		}
		else  res.send("Project details removed...");
	});
});


//ProjectGroup

app.post('/addProjectGroup', (req, res)=>{

	
	var projGrp = new projectgroup1({
		name : req.body.name
	});

	console.log(req.body);


	projGrp.save(function(err, db){
	if(err){
		res.send(err);
	}
	else{
		res.send("Successfully Inserted...");
	}
});

});

app.get('/allProjectGroups', (req, res)=>{
	projectgroup1.find().then(projGrps => {
		res.send(projGrps);
	});
});


app.put('/updateProjectGroup/:projGrpID', (req, res)=>{
	projectgroup1.findOneAndUpdate({_id:req.params.projGrpID}, {$set:{
		name : req.body.name
		
			}}, {new : true}).then(projgrpid => {
		if(!projgrpid){
			return res.status(404).send({
                message: "ProjectGroup not found with id " + req.params.projgrpid
            });

		}

		else res.send(projgrpid);
		console.log(req.body);
	});
});

app.delete('/deleteProjectGroup/:projID',(req, res)=>{
	projectgroup1.remove({_id: req.params.projID}).then(projGrpID =>{
		if(!projGrpID){
			return res.status(404).send({
                message: "Project group not found with id " + req.params.projGrpID
            });    
		}
		else  res.send("Project group details removed...");
	});
});

///User

app.post('/addUser', (req, res)=>{

	
	var user= new user1({
		name : req.body.name,
		password : req.body.password,
		allowedServerID: req.body.allowedServerID,
		publickey : req.body.publickey
	});

	console.log(req.body);


	user.save(function(err, db){
	if(err){
		res.send(err);
	}
	else{
		res.send("Successfully Inserted...");
	}
});

});

app.get('/allProjectUsers', (req, res)=>{
	user1.find().then(users => {
		res.send(users);
	});
});


app.put('/updateUsers/:usrid', (req, res)=>{
	user1.findOneAndUpdate({_id:req.params.usrid}, {$set:{
		name : req.body.name,
		password : req.body.password,
		publickey : req.body.publickey
		
			}}, {new : true}).then(usr => {
		if(!usr){
			return res.status(404).send({
                message: "Project user not found with id " + req.params.usrid
            });

		}

		else res.send(usr);
		console.log(req.body);
	});
});

app.delete('/deleteProjectUser/:projUserID',(req, res)=>{
	user1.remove({_id: req.params.projUserID}).then(userID =>{
		if(!userID){
			return res.status(404).send({
                message: "Project user not found with id " + req.params.projUserID
            });    
		}
		else  res.send("Project user details removed...");
	});
});



















