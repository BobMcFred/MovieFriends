
// Passport was set up following a tutorial at http://scotch.io/tutorials/javascript/easy-node-authentication-setup-and-local

var LocalStrategy = require('passport-local').Strategy;

// user model
var User = require('../app/models/user');

module.exports = function(passport) {

    

    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });

    //signup
    passport.use('local-signup', new LocalStrategy({
        usernameField : 'username',
        passwordField : 'password',
        passReqToCallback : true // pass back entire request to the callback
    },
    function(req, username, password, done) {

        // asynchronous
        // User.findOne wont fire unless data is sent back
        process.nextTick(function() {

	        // check if username already exists
	        User.findOne({ 'local.username' :  username }, function(err, user) {
	            // return possible error
	            if (err)
	                return done(err);
	
	            if (user) {
	                return done(null, false, req.flash('signupMessage', 'That email is already taken.')); //shows a message at the login page
	            } else {
	
	                // if user doesn't exist, create it
	                var newUser = new User();
	
	                // set the user's information
	                newUser.local.username = username;
	                newUser.local.password = newUser.generateHash(password);
	
	                // save the user to the database
	                newUser.save(function(err) {
	                    if (err)
	                        throw err;
	                    return done(null, newUser);
	                });
	            }
	        });
        });
    }));
    
    // local login
    passport.use('local-login', new LocalStrategy({
        usernameField : 'username',
        passwordField : 'password',
        passReqToCallback : true // pass back entire request to the callback
    },
    function(req, username, password, done) { // callback with username and password from our form

        // check if username already exists
        User.findOne({ 'local.username' :  username }, function(err, user) {
            // return possible errors
            if (err)
                return done(err);

            // if no user is found, return the message
            if (!user)
                return done(null, false, req.flash('loginMessage', 'No user found.')); // req.flash is the way to set flashdata using connect-flash

            // if the user is found but the password is wrong
            if (!user.validPassword(password))
                return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.')); // create the loginMessage and save it to session as flashdata

            // return user for successful login
            return done(null, user);
        });
    }));
};