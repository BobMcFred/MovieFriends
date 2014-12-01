	// create the module and name it scotchApp
	var app = angular.module('app', ['ngRoute']);

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
	});
	
	app.controller('homeController', function($scope) {
	});