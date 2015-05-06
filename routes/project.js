
var datasource = require('./database');
var projectid;
var tenantType;
var tenantid = 1;
var projectType;
var projectName;
var workDataField;



exports.afterAddCard = function(req, res) {
	var id = projectid;
	var cardField = [ [ projectid, 'card name', 'string' ],
			[ projectid, 'description', 'string' ],
			[ projectid, 'status', 'string' ], [ projectid, 'team', 'string' ] ];
	var cardData = {
		"card" : [ {
			"card name" : req.param("name"),
			"description" : req.param("desc"),
			"status" : req.param("status"),
			"team" : req.param("team")
		} ]
	};
	datasource.create_task(id, cardField, cardData, function(err, result) {
	});
	res.render('success');
};

exports.afterAddStory = function(req, res) {
	var id = projectid;
	var storyField = [ [ projectid, 'story name', 'string' ],
			[ projectid, 'description', 'string' ],
			[ projectid, 'acceptance test', 'int' ],
			[ projectid, 'due date', 'date' ],
			[ projectid, 'story points', 'int' ],
			[ projectid, 'resource name', 'string' ],
			[ projectid, 'estimated hours', 'string' ],
			[ projectid, 'remaining hours', 'string' ] ];
	var storyData = {
		"story" : [ {
			"story name" : req.param("name"),
			"description" : req.param("desc"),
			"acceptance test" : req.param("acceptanceTest"),
			"story points" : req.param("storyPoints"),
			"resource name" : req.param("resourceName"),
			"estimated hours" : req.param("estimatedHours"),
			"remaining hours" : req.param("remainingHours")
		} ]
	};
	datasource.create_task(id, storyField, storyData, function(err, result) {
	});
	res.render('success');
};


exports.afterAddProject = function(req, res) {
	console.log(tenantType + ' in afterAddProject');
	projectName = req.param("name");
	//if(tenantType ==1)
		
	datasource.create_project(tenantid, projectType, req.param("name"),
			function(err, result) {

				projectid = result;
				console.log(projectid + ' in afterAddProject');

			});
	res.render('project',{tenantType:tenantType,projectName:projectName});
	
};



exports.updateTask = function(req, res) {
	res.render('updateTask');
};

exports.afterUpdateTask = function(req, res) {

	var oldTaskData = {
		"task name" : req.param("name")
	};

	var newTaskData = {
		"task name" : req.param("name"),
		"description" : req.param("description"),
		"duration" : req.param("duration"),
		"due date" : req.param("dueDate"),
		"work done" : req.param("workDone"),
		"resource name" : req.param("resourceName")
	};

	var projectId = projectid;
	datasource.update_task(projectid, oldTaskData, newTaskData, function(err,
			result) {
	});
	res.render('success');

};

exports.afterUpdateCard = function(req, res) {

	var oldCardData = {
		"card name" : req.param("name")
	};

	var newCardData = {
		"card name" : req.param("name"),

		"description" : req.param("description"),
		"status" : req.param("status"),
		"team" : req.param("team"),
	};

	datasource.update_card(projectid, oldCardData, newCardData, function(err,
			result) {
	});
	res.render('success');

};

exports.afterUpdateStory = function(req, res) {

	var oldStoryData = {
		"story name" : req.param("name")
	};

	var newStoryData = {
		"story name" : req.param("name"),
		"description" : req.param("desc"),
		"acceptance test" : req.param("acceptanceTest"),
		"story points" : req.param("storyPoints"),
		"resource name" : req.param("resourceName"),
		"estimated hours" : req.param("estimatedHours"),
		"remaining hours" : req.param("remainingHours")
	};

	var projectId = projectid;
	datasource.update_story(projectid, oldStoryData, newStoryData, function(
			err, result) {
	});
	res.render('success');

};

exports.deleteTask = function(req, res) {
	res.render('deleteTask');
};

exports.deleteProjectWaterfall = function(req, res) {
	datasource.delete_project(1, projectid, function(err, result) {
	});
	res.render('deleteProject');
};


exports.addCard = function(req, res) {
	res.render('addCard');
};

exports.updateCard = function(req, res) {
	res.render('updateCard');
};

exports.deleteCard = function(req, res) {
	res.render('deleteCard');
};

 exports.deleteProjectKanban = function(req, res) {
 datasource.delete_project(1,projectid , function(err,result){});
 res.render('deleteProject');
 };

exports.createProject = function(req, res) {
	res.render('createProject');
};

exports.addStory = function(req, res) {
	res.render('addStory');
};

exports.deleteStory = function(req, res) {
	datasource.delete_project(1, projectid, function(err, result) {
	});
	res.render('deleteProject');
};

exports.deleteProjectScrum = function(req, res) {
	res.render('deleteProjectScrum');
};

exports.updateStory = function(req, res) {
	res.render('updateStory');
};

exports.selectProjectType = function(req, res) {
	 projectType = req.param("name");
	
	if (projectType == "Waterfall") {
		tenantType = 1;
		console.log(tenantType + 'in waterfall');
	} else if (projectType == "Scrum") {
		tenantType = 2;
		console.log(tenantType + 'in Scrum');
	} else {
		tenantType = 3;
		console.log(tenantType + 'in kanban');
	}
	res.render('addProject',{tenantType:tenantType});
};

exports.myProjects = function(req, res) {
	var results;
	datasource.getAllProjects(1, function(err, result) {

		results = result;

		res.render('myProjects', {
			results : results
		});

	});

};

exports.getProjectDetails = function(req, res) {

};



exports.addActivity = function(req, res) {
	console.log('********************'+projectid);
	var id= projectid;
	console.log(tenantType+ ' '+projectid);
	datasource.fetch_task(id,tenantType,function(err,result){
		if(err)
		console.log('error in ')
		
		workDataField = result;
	res.render('addTask',{results:result});
	});
};

exports.afterAddTask = function(req, res) {

	var taskData = "{\"activity\":[{";
	for(var i in workDataField){
		taskData = taskData + "\""+workDataField[i]+":"+req.param("workDataField[i]")+",";
	}
	taskData = taskData + "}]}";
	console.log(taskData);
	var json = JSON.parse(taskData);
	console.log(json);
	// "task name":req.param("name") , "description":req.param("desc") , "duration":req.param("duration")  , "due date":req.param("dueDate") , "work done":req.param("workDone") , "resource name":req.param("resourceName") }]};
	// datasource.create_task(id,taskData,function(err,result){});
	res.render('success');
};




