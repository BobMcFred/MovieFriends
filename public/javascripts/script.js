// create the module and name it scotchApp
var app = angular.module('app', ['ngRoute']);

var page = 'home';

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
	populateFeed();
});

app.controller('homeController', function($scope) {
	populateFeed();
});

$(document).ready(function(){
	// Populate feed on page load
	populateFeed();
	
	// Populate feed every 5 seconds
	if(page=='home'){
		window.setInterval(function(){
			populateFeed();
		}, 5000);
	}
	
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
										'<h3>' + this.title + '</h3><button id="' + this._id + '"type="button" class="btn btn-warning btn-lg">Add to my list</button>' +
									'</div>' +
								'</div>' +
							'</div>';
		});
		
		// Put rows into the table
		$('#home').html(feedContent);
	});
};


$(document).on('click', 'button', function(){ 
    alert(this.id);
});