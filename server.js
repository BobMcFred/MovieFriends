// set up ======================================================================
var express = require('express');
var app = express();
var port = process.env.PORT || 8080;
var mongoose = require('mongoose');
var passport = require('passport');
var flash = require('connect-flash');

var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');

var configDB = require('./config/database.js');

var fs = require('fs');

// configuration ===============================================================
mongoose.connect(configDB.url); // connect to database

var publicMovieSchema = new mongoose.Schema({
	  title: String,
	  poster: String,
	  suggestedBy: String,
	  comment: [{
		  username : String,
		  text : String
	  }]
});

var Movie = mongoose.model('Movie', publicMovieSchema);

var userMovieSchema = new mongoose.Schema({
	  title: String,
	  poster: String,
	  user: String,
	  comment: String
});

var userMovie = mongoose.model('userMovie', userMovieSchema);

require('./config/passport')(passport); // pass passport for configuration

// set up our express application
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser()); // get information from html forms
app.use(express.static(__dirname + '/public')); // serve static things like the script

app.set('view engine', 'ejs'); // set up ejs for templating

// required for passport
app.use(session({ secret: 'movies' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

//routes ======================================================================
require('./app/routes.js')(app, passport, fs, Movie, userMovie); // load our routes and pass in our app and fully configured passport

// launch ======================================================================
app.listen(port);
console.log('The magic happens on port ' + port);