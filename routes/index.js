
/*
 * GET home page.
 */

exports.index = function(req, res) {
	res.render('index', {
		title : 'Express'
	});
};



exports.signin = function(req, res) {
	console.log(req.body.email);
	console.log(req.body.password);
}





