var createError = require('http-errors');
var express = require('express');
var path = require('path');
var logger = require('morgan');
var auth = require('./middlewares/auth');
global.mongoose = require('mongoose');
global.Schema = mongoose.Schema;
mongoose.Promise = require('bluebird');

global.app = express();
global.router = express.Router();

var http = require('http-server').createServer(app);
var mongo_server = process.env.mongo_server ||'localhost:27017';

mongoose.connect('mongodb://priyanka:secret@123@ds145184.mlab.com:45184/sviet_clg' , {useNewUrlParser: true});

global.models = require('./models/');
global.helper = require('./helpers/_helper');


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');


/*for making middleware authentication as on /off */
app.use(auth('on'))

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});


// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.listen(3000, function() {
    console.log("server started on port 3000");
})

module.exports = app;
