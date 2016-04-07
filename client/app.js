var app = angular.module('App', []);
app.controller('AppController', ['$scope', '$http', function($scope, $http) {
	// Defaults.
	$scope.gpioData = [];

	// Local methods.
	var refresh = function(){
	
		$http.get('/GetGPIO').then(
			function success(response){
				$scope.gpioData = response.data;
				console.log('refreshed');
			},
			function error (response){
				console.log("Error getting GPIO status.");
			}
		);
	};
	
	var toggleGPIO = function(gpio){
		console.log("Toggle " + gpio.id);
		$http.post('/ToggleGPIO', gpio).then(
			function success(response){
				$scope.gpioData = response.data;
				console.log('toggled');
			},
			function error (response){
				console.log("Error toggling GPIO status.");
			}
		);
	};
	
	// Scope methods (bindable);
	$scope.toggleGPIO = function(gpio){
		toggleGPIO(gpio);
	};
	
	// Code to perform on load.
	refresh();
		
}]);