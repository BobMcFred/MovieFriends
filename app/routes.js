var http = require('http');

module.exports = function(app, passport, fs, Movie, userMovie) {

    // welcome page with login links
    app.get('/', function(req, res) {
        res.render('index.ejs'); // load the index.ejs file
    });

    // show the login form
    app.get('/login', function(req, res) {

        // render the page and pass in any flash data if it exists
        res.render('login.ejs', { message: req.flash('loginMessage') }); 
    });

    // process the login form
    app.post('/login', passport.authenticate('local-login', {
        successRedirect : '/home', // redirect to the secure profile section
        failureRedirect : '/login', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));

    // =====================================
    // SIGNUP ==============================
    // =====================================
    // show the signup form
    app.get('/signup', function(req, res) {

        // render the page and pass in any flash data if it exists
        res.render('signup.ejs', { message: req.flash('signupMessage') });
    });

    // process the signup form
    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect : '/home', // redirect to the secure profile section
        failureRedirect : '/signup', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));

    // =====================================
    // PROFILE SECTION =====================
    // =====================================
    // we will want this protected so you have to be logged in to visit
    // we will use route middleware to verify this (the isLoggedIn function)
    app.get('/profile', isLoggedIn, function(req, res) {
        res.render('profile.ejs', {
            user : req.user // get the user out of session and pass to template
        });
    });
    
    // =====================================
    // HOME SECTION ========================
    // =====================================
    // we will want this protected so you have to be logged in to visit
    // we will use route middleware to verify this (the isLoggedIn function)
    app.get('/home', isLoggedIn, function(req, res) {
        res.render('home.ejs', {
            user : req.user // get the user out of session and pass to template
        });
    });

    // =====================================
    // LOGOUT ==============================
    // =====================================
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });
    
    
    // Add movie to the database
    app.post('/addmovie', function(req, res) {
        var theMovie = new Movie({
        	title : req.body.title,
        	poster : req.body.poster,
        	suggestedBy : req.body.suggestedBy
        });
        
        theMovie.save(function(err, theMovie) {
        	  if (err) res.send(err);
        	  console.dir(theMovie);
        	  res.send({msg : 'Success'});
        });
    });
    
    // Add movie to the user database
    app.post('/addusermovie', function(req, res) {
        var theMovie = new userMovie({
        	title : req.body.title,
        	poster : req.body.poster,
        	user : req.body.user,
        	comment : req.body.comment
        });
        
        theMovie.save(function(err, theMovie) {
        	  if (err) res.send(err);
        	  console.dir(theMovie);
        	  res.send({msg : 'Success'});
        });
    });
    
    // Get list of movies
    app.get('/allmovies', function(req, res) {
        Movie.find(function(err, movies){
        	if (err) res.send(err);
        	
        	res.send(movies);
        });
    });
    
    // Get list of movies
    app.post('/onemovie', function(req, res) {
    	
        Movie.findById(req.body.id, function(err, movies){
        	if (err) res.send(err);
        	
        	res.send(movies);
        });
    });
    
    // Get list of user movies
    app.post('/usermovies', function(req, res) {
        userMovie.find({'user' : req.body.user}, function(err, movies){
        	if (err) res.send(err);
        	
        	res.send(movies);
        });
    });
    
    // Delete user movie
    app.delete('/deletemovie', function(req, res) {
        userMovie.findByIdAndRemove(req.body.id, function(err, movies){
        	if (err) res.send(err);
        	
        	res.send({msg : 'Success'});
        });
    });
    
    // Search movie using external api
    app.post('/search', function(req, res){
    	var input = req.body.title;
    	var title = input.split(' ').join('+');
    	var options = {
    			host: 'www.omdbapi.com',
    			port: 80,
    			path: '/?t=' + title + '&r=json',
    			method: 'GET'	
    	};
    	var getRequest = http.request(options, function(response){
    		response.setEncoding('utf8');
    		response.on('data', function(chunk){
    			console.log(chunk);
    			res.send(chunk);
    		});
    	});
    	getRequest.end();
    });
};

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on 
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}