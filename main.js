var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var request = require('request');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// We will be using only one route.
// use $-> NODE_ENV=production npm start --> to replicate prod enviroment
app.use('/apiproxy', function(req, res) {
  var url = 'https://phoenixworkgroup.atlassian.net/rest/api/latest' + req.url;
  req.pipe(request(url)).pipe(res);
});

app.get('/', function(req,res){
	res.render('index.ejs', { message: 'Thank You'});
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Are you trying to find a black hole? (⊙.◎)');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
	// set locals, only providing error in development
	if(err.status == 404){
		res.status(404);
		if (req.accepts('html')) {
			res.render('index.ejs', { message: err.message});
		}
		else{
			res.send({ error: err.message });
	    	return;
		}
	}
	else
	{
		res.locals.message = err.message;
		res.locals.error = req.app.get('env') === 'development' ? err : {};
		// render the error page
		res.status(err.status || 500);
		res.render('error');
	}
});

module.exports = app;
