

var mysql = require('mysql');
var mongo = require('mongoskin');
var util = require('util');
//var pool  = mysql.createPool({
//	host     : 'cmpe281db.cz6ctmawxgpd.us-west-2.rds.amazonaws.com',
//	user     : 'kbhanushali',
//	password : 'Vistaar22',
//	port: '3306',
//	database: 'cmpe281db'
//});

var pool  = mysql.createPool({
	host     : 'localhost',
	user     : 'root',
	password : 'root123',
	port: '3306',
	database: 'cmpe281'
});


//var db = mongo.db("mongodb://roosterxie:xls110110@ds031631.mongolab.com:31631/cmpe272", {native_parser:true});
var db = mongo.db("mongodb://localhost:27017/local", {native_parser:true});
var mongoconn = db.collection('cmpe281', {strict: true});

exports.fetch_data = function(req,res){
	var pt = 'kanban';
	var pn = 'demo';
	
	var projectId = 23;
	//var taskField = {"name":"task_name",};
	var taskField = [['23','taskname','string'],['23','description','string']];
	var taskData = {"task":[{"task name":"design","description":"hello"}]};
	//create_project(1,pt,pn,function(err,result){console.log("retun "+result);});
	create_task(projectId,taskField,taskData,function(err,result){});
	
	
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
//				console.log(util.inspect(ret, {showHidden: false, depth: null}));
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


 function create_project(tenantId,projectType,projectName,callback){
	var tenantData={tenantid:tenantId,type:projectType};
	var projectData;
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
			connection.query('SELECT projectid FROM tenant WHERE tenantid = ? AND type = ?',[tenantId,projectType],function(err, result1){
				if(err){
					console.log('error 1 '+err);
				}

				var tenantData = {projectid:result1[0].projectid, fieldname:'project name',fieldtype:'string'};
				projectData = {projectid:result1[0].projectid,projectname:projectName};
				//insert into tenant_schema table
				connection.query('INSERT INTO tenant_schema SET ?',[tenantData],function(err, result2){
					if(err){
						console.log('error 2'+err);
					}
					console.log(result2);
					connection.release();
					mongoconn.insert(projectData,function (err, result) {
						if(err){
							console.log("error 3"+err.toString());
						}
//						check for true in result for success
						callback(err,'true');
				    });
					
			});
			
		});
		});
	});
		
		return projectid;
};