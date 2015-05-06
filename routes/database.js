

var mysql = require('mysql');
var mongo = require('mongoskin');
var util = require('util');
var pool = mysql.createPool({
	host : 'cmpe281db.cz6ctmawxgpd.us-west-2.rds.amazonaws.com',
	user : 'kbhanushali',
	password : 'Vistaar22',
	port : '3306',
	database : 'cmpe281db'
});




var db = mongo.db("mongodb://roosterxie:xls110110@ds031631.mongolab.com:31631/cmpe272", {native_parser:true});
var mongoconn = db.collection('ctest', {strict: true});

exports.fetch_data = function(req,res){
	var pt = 'kanban';
	var pn = 'demo';
	
	var projectId = 1;
	var taskField = {name:"task name",};
	var taskData = {};
	//create_task()
	create_project(1,pt,pn,function(err,result){});
	
//	pool.getConnection(function(err, connection) {
//		if(err){
//			console.log('error');
//			console.log(err);
//		}
//		connection.query('SELECT * FROM tenant WHERE tenantid = ? limit 1',[1],function(err, tenantdata){
//			connection.release();
//			if(tenantdata.length > 0){
//				console.log(tenantdata);
//				testmongo.find().toArray(function (err, items) {
//					if(err){
//						console.log(err.toString());
//					}
//				      console.log('mongdb: ', items);
//				      res.json(items);
//				    });
//				//user logged in
////				var userObject = user[0];
////				var current_time = new Date();
////
////				//current time
////				var newData = {
////						last_login:current_time
////				};
////				
////				//add last_login time to user object and update the database
////				edit_user_profile(userObject.membershipNo, newData, function(err, result){
////					
////				});
//			}
//			//callback(err, user);
//		});
//	});
	
	
};

//
//function create_task(projectId,taskField,taskData,callback){
//	
//	pool.getConnection(function(err, connection) {
//		if(err){
//			console.log(err);
//		}
//		connection.query('INSERT INTO tenant_schema SET ?',[taskField],function(err, result2){
//			if(err)
//				console.log(err);
//			
//			mongoconn.findOne({projectid:projectId},function(err,result){
//				console.log(result);
//				
//			});
//			mongoconn.update(projectData,function (err, result) {
//				if(err){
//					console.log(err.toString());
//				}
////				check for true in result for success
//				callback(err,'true');
//		    });
//			
//		});
//	});
//}






function create_task(projectId,taskField,taskData,callback){
//	var jsonResult;
	pool.getConnection(function(err, connection) {
		if(err){
			console.log(err);
		}
		connection.query('INSERT INTO tenant_schema (projectid,fieldname,fieldtype) VALUES ?',[taskField],function(err, result2){
			if(err)
				console.log('error 11 '+err);
			
			mongoconn.findOne({projectid:projectId},function(err,result){
				console.log(result);
//				jsonResult = result;
			    var ret = merge_options(result,taskData);
//			    console.log('id '+ret["_id"]);
				console.log(util.inspect(ret, {showHidden: false, depth: null}));
//				var id = {_id:"\""+ret["_id"]+"\""};
//				console.log(util.inspect(id, {showHidden: false, depth: null}));
				mongoconn.update({projectid:projectId},ret,function (err, result) {
					if(err){
						console.log(err.toString());
					}
//					check for true in result for success
					console.log('result '+result);
					callback(err,'true');
			    });
			});
			
			
		});
	});
}



function merge_options(obj1,obj2){
    var obj3 = {};
    for (var attrname in obj1) { obj3[attrname] = obj1[attrname]; }
    for (var attrname in obj2) { obj3[attrname] = obj2[attrname]; }
    return obj3;
}


function update_task(projectId, oldTaskData, newTaskData, callback) {

	console.log('task name ' + oldTaskData["task name"]);
	mongoconn.update({
		projectid : projectId,
		"task" : {
			"$elemMatch" : {
				"task name" : oldTaskData["task name"]
			}
		}
	}, {
		$set : {
			"task.$" : newTaskData
		}
	}, function(err, result) {
		if (err) {
			console.log(err.toString());
		}
		console.log('result ' + result);
		console.log('success');
		// check for true in result for success
		callback(err, 'true');
	});

}


function update_card(projectId,oldCardData,newCardData,callback){

	console.log('card name '+oldCardData["card name"]);
	mongoconn.update({projectid:projectId,"card":{"$elemMatch" : {"card name":oldCardData["card name"]}}},{$set:{"card.$":newCardData}},function (err, result) {
	if(err){
	console.log(err.toString());
	}
	console.log('result '+result);
	console.log('success');
	// check for true in result for success
	callback(err,'true');
	   });
	
}



function update_story(projectId,oldStoryData,newStoryData,callback){

	console.log('story name '+oldStoryData["story name"]);
	mongoconn.update({projectid:projectId,"story":{"$elemMatch" : {"story name":oldStoryData["story name"]}}},{$set:{"story.$":newStoryData}},function (err, result) {
	if(err){
	console.log(err.toString());
	}
	console.log('result '+result);
	console.log('success');
	// check for true in result for success
	callback(err,'true');
	   });
	
}



function getAllProjects(tenantId,callback){
	
	var resultNew ;
		pool.getConnection(function(err, connection) {
		if(err){
			console.log(err);
		}
			 connection.query('SELECT * FROM tenant WHERE tenant_id = ?',[tenantId],function(err, result1){
				if(err){
					console.log('error 1 '+err);
				}
			
				resultNew = result1;
				callback(err,resultNew);
				console.log("****************  " + resultNew);
		});
			 
	});
		
}



exports.fetch_task =function(projectId,tenantType,callback){
	
	var resultNew ;
		pool.getConnection(function(err, connection) {
		if(err){
			console.log(err);
		}
		console.log(projectId+' '+tenantType);
		projectId= 82;
		tenantType= 1;
		var query='SELECT fieldname FROM ref_schema WHERE tenantType = ? UNION SELECT fieldname FROM tenant_schema WHERE projectid = ?';
		//	 connection.query(query,[tenantType, projectId],function(err, result1){
				 connection.query(' SELECT fieldname FROM ref_schema WHERE tenantType = ? UNION SELECT fieldname FROM tenant_schema WHERE projectid = ?',[tenantType,projectId],function(err, result1){
		if(err){
					console.log('error 1 '+err);
				}
			
				resultNew = result1;
				console.log("****************  " + util.inspect(resultNew, {showHidden: false, depth: null}));

				callback(err,resultNew);
		});
			 
	});
		
}


function create_project(tenantId,projectType,projectName,callback){
	var projectID;
	var tenantData={tenant_id:tenantId,type:projectType};
	var projectData;
	console.log(tenantId+ ' '+projectType,' '+projectName+'in create_project');

		pool.getConnection(function(err, connection) {
		if(err){
			console.log(err);
		}
		
		//Insert into tenant table
		connection.query('INSERT INTO tenant SET ?',tenantData,function(err, result){
			if(err){
				console.log('error'+err);
			}
			
			//fetch projectid
			  connection.query('SELECT projectid FROM tenant WHERE tenant_id = ? AND type = ?',[tenantId,projectType],function(err, result1){
				if(err){
					console.log('error 1 '+err);
				}
				
				console.log("**************  " + projectID);
				console.log("fetch result "+result1.length);
				pid = result1[result1.length-1].projectid;
				console.log(pid);
				var tenantData = {projectid:pid, fieldname:'Project Name',fieldtype:'string'};
				projectID = pid;
				projectData = {projectid:pid,projectname:projectName};				
				console.log("**************  " + projectID);

				//insert into tenant_schema table
				
				connection.query('INSERT INTO tenant_schema SET ?',[tenantData],function(err, result2){
					if(err){
						console.log('error 2'+err);
					}
					console.log(result2);
					connection.release();
					mongoconn.insert(projectData,function (err, result) {
						if(err){
							console.log(err.toString());
						}
//						check for true in result for success
						callback(err,projectID);
				    });
					
			});
			
		});
		});
	});
		//return projectID;
}





function delete_project(tenantId, projectId, callback) {
	console.log('inside error');
	pool.getConnection(function(err, connection) {
		if (err) {
			console.log(err);
		}
		connection.query('DELETE FROM tenant WHERE tenant_id=' + tenantId
				+ ' AND projectid = ' + projectId, function(err, result) {
			if (err)
				console.log(err);

			mongoconn.remove({
				projectid : projectId
			}, function(err, result) {
				if (err) {
					console.log(err.toString());
				}
				// check for true in result for success
				callback(err, 'true');
			});

		});

	});
}

exports.getAllProjects = getAllProjects;
exports.create_project = create_project;
exports.create_task = create_task;
exports.delete_project = delete_project;
exports.update_task = update_task;
exports.update_story = update_story;
exports.update_card = update_card;
