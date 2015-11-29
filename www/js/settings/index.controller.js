angular.module('starter.settings', [])

.controller('settings.IndexCtrl', ['$scope', 'Auth', '$location',
	
	function ($scope, Auth, $location) {
		if (! Auth.getActiveUserProfile()) {
			$location.path('/login')
		}

		$scope.$on('balance-updated', function(e, balance) {
			$scope.user.balance = balance;
		});

		$scope.settings = {};
		$scope.settings.sms = true;
		$scope.settings.email = false;
		$scope.user = Auth.getActiveUserProfile();
		$scope.logout = logout;

		function logout () {
			Auth.setActiveUserProfile(null);
			localStorage.removeItem('user');
			$location.path('/login');
		}
	}
]);