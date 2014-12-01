// create the module and name it scotchApp
var app = angular.module('app', ['ngRoute']);

var page = 'home';

var theUser;

// configure our routes
app.config(function($routeProvider) {
	$routeProvider

		// route for the profile page
		.when('/profile', {
			templateUrl : 'pages/profile.html',
			controller  : 'mainController'
		})
		
		// route for the home page
		.when('/', {
			templateUrl : 'pages/home.html',
			controller  : 'homeController'
		})
		
});

// create the controller and inject Angular's $scope
app.controller('mainController', function($scope) {
	populateUserFeed();
	page = 'profile';
});

app.controller('homeController', function($scope) {
	populateFeed();
	page = 'home';
});

$(document).ready(function(){
	
	theUser = $('#theUser').text();
	
	// Populate feed on page load
	populateFeed();
	
	// Populate feed every 5 seconds
	window.setInterval(function(){
		populateFeed();
	}, 5000);
	
	$('#divSuggest').click(function(){
		var title = $('#txtSuggest').val();
		$.post('/search', {title : title}).done(function(data){
			console.log(data);
			//alert(data.Title);
			var movie = JSON.parse(data);
			if(movie.Response == "False"){
				alert(movie.Error);
				return;
			}
			$.post('/addmovie', {title : movie.Title, poster: movie.Poster, suggestedBy : theUser}).done(function(data2){
	        	if(data2.msg == 'Success'){
	        		alert("Successfully added " + movie.Title);
	        		populateFeed();
	        	}
	        });
	    });
	});
	
});


function populateFeed(){
	// String to put into table
	var feedContent = '';
	
	// jQuery AJAX for JSON
	$.getJSON('/allmovies', function(data){
		
		console.log(data);
		
		// Make rows for every entry
		$.each(data, function(){
			
			feedContent += '<div class="row">' +
								'<div class="col-sm-4">' +
									'<div class="well">' +
										'<img src="' + this.poster + '" alt="' + this.title + '" class="img-rounded">' +
									'</div>' +
								'</div>' +
								'<div class="col-sm-8">' +
									'<div class="well">' +
										'<h3>' + this.title + '</h3><h4>Suggested by '+ this.suggestedBy +'</h4><button id="' + this._id + '"type="button" class="btn btn-warning btn-lg">Add to my list</button>' +
									'</div>' +
								'</div>' +
							'</div>';
		});
		
		// Put rows into the page
		$('#home').html(feedContent);
	});
};

function populateUserFeed(){
	
	// String to put into table
	var feedContent = '';
	
	// jQuery AJAX for JSON
	$.post('/usermovies', {user : theUser}, function(data){
		
		console.log(data);
		
		// Make rows for every entry
		$.each(data, function(){
			
			feedContent += '<div class="row">' +
								'<div class="col-sm-4">' +
									'<div class="well">' +
										'<img src="' + this.poster + '" alt="' + this.title + '" class="img-rounded">' +
									'</div>' +
								'</div>' +
								'<div class="col-sm-8">' +
									'<div class="well">' +
										'<h3>' + this.title + '</h3><button id="' + this._id + '"type="button" class="btn btn-danger btn-lg">Remove from list</button>' +
									'</div>' +
								'</div>' +
							'</div>';
		});
		
		// Put rows into the page
		$('#profile').html(feedContent);
	});
};


$(document).on('click', 'button', function(){
	if(page=="home"){
	    $.post('/onemovie', {id : this.id}).done(function(data){
	    	$.post('/addusermovie', {title : data.title, poster: data.poster, user : theUser}).done(function(data2){
	        	if(data2.msg == 'Success') alert("Successfully added");
	        });
	    });
	}
	else if(page=="profile"){
		// Send DELETE - Removes existing entries for hashtag if they exist
		$.ajax({
			type: 'DELETE',
			url: '/deletemovie',
			data: {id : this.id}
		}).done(function(data){
			if(data.msg == 'Success') alert("Successfully removed");
			populateUserFeed();
		});
		
	}
});


