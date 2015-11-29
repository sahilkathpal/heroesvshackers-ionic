angular.module('starter.home')

.controller('LoginCtrl', ['$scope', '$location', 'Auth', '$state', 'defaults', '$http', 'urls',
	function ($scope, $location, Auth, $state, defaults, $http, urls) {
		if (Auth.getActiveUserProfile()) {
			$state.go(defaults.home);
			return;
		}

		$scope.user = {};
		$scope.waiting = false;
		$scope.login = function () {
			$scope.waiting = true;
			// Auth.setActiveUserProfile({name: 'Anil', email: 'anil@gmail.com', id: 1, age: 21});
			// localStorage.user = JSON.stringify({name: 'Anil', email: 'anil@gmail.com', id: 1, age: 21});
			// $scope.$emit('loggedin', {status:true});
			// $state.go(defaults.home);
			// window.location.reload();
			$http.post(urls.tool+'/mobile/login', $scope.user)
			.then(function (data) {
				$scope.waiting = false;
				// $scope.data = data;
				Auth.setActiveUserProfile(data.data);
				localStorage.user = JSON.stringify(data.data);
				$scope.$emit('loggedin', {status:true});
				$state.go(defaults.home);
				// window.location.reload();
			})
			.catch(function (err) {
				alert('Wrong credentials entered');
				$scope.waiting = false;
			});
		};
	}
]);