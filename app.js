
/**
 * Module dependencies.
 */

var http = require('http');
var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var path = require('path');
var datasource = require('./routes/database');
var project = require('./routes/project');

		
var favicon = require('serve-favicon');
var logger = require('morgan');
var methodOverride = require('method-override');
var session = require('express-session');
var bodyParser = require('body-parser');
var multer = require('multer');
var errorHandler = require('errorhandler');

var stormpath = require('express-stormpath');

var app = express();



// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname,'views'));
app.set('view engine', 'ejs');
app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(session({ resave: true,
    saveUninitialized: true,
    secret: 'uwotm8' }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(multer());
app.use(express.static(path.join(__dirname, 'public')));

console.log(__dirname);

//app.use(stormpath.init(app,{
//	apiKeyId:'26ARO268B93VBCULBIMOTWMPG',
//	apiKeySecret:'KBkKf4kgLKh0IPqWw3G81kKxAfc4bNFDzHQx53QLce0',
//	application:'https://api.stormpath.com/v1/applications/2GVun4vua9TM9OC5OrVxir',
//	secretKey:'blah',
//	}));

//app.use(stormpath.init(app, {
//	  apiKeyId: '26ARO268B93VBCULBIMOTWMPG',
//	  apiKeySecret: 'KBkKf4kgLKh0IPqWw3G81kKxAfc4bNFDzHQx53QLceah0',
//	  application: 'https://api.stormpath.com/v1/applications/2GVun4vua9TM9OC5OrVxir',
//	  secretKey: 'blah',
//	}));

// development only
if ('development' == app.get('env')) {
  app.use(errorHandler());
}
app.get('/', routes.index);
//app.get('/', datasource.fetch_data);
app.post('/signin',routes.signin);
app.get('/users', user.list);




app.get('/createProject', project.createProject);
app.get('/selectProjectType', project.selectProjectType);

app.get('/addWaterfallProject', project.addWaterfallProject);
app.post('/addTask', project.addWork);
app.get('/afterAddTask', project.afterAddTask);
app.get('/afterAddWaterfallProject', project.afterAddWaterfallProject);
app.post('/updateTask', project.updateTask);
app.get('/afterUpdateTask', project.afterUpdateTask);
app.post('/deleteTask', project.deleteTask);
app.post('/deleteProjectWaterfall', project.deleteProjectWaterfall);
app.get('/afterAddKanbanProject', project.afterAddKanbanProject);

app.get('/addKanbanProject', project.addKanbanProject);
app.post('/addCard', project.addCard);
app.get('/afterAddCard', project.afterAddCard);
app.post('/updateCard', project.updateCard);
app.get('/afterUpdateCard', project.afterUpdateCard);
app.post('/deleteCard', project.deleteCard);
app.post('/deleteProjectKanban', project.deleteProjectKanban);


app.get('/afterAddScrumProject', project.afterAddScrumProject);
app.post('/addStory', project.addStory);
app.get('/afterAddStory', project.afterAddStory);
app.post('/updateStory', project.updateStory);
app.get('/afterUpdateStory', project.afterUpdateStory);
app.post('/deleteStory', project.deleteStory); 
app.post('/deleteProjectScrum', project.deleteProjectScrum);

app.get('/myProjects', project.myProjects);

app.get('/getProjectDetails', project.getProjectDetails);


http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
