angular.module('starter.notifications', [])

.controller('notifications.IndexCtrl', ['$scope', '$http', 'urls', 'Auth', '$interval', '$location',
	function ($scope, $http, urls, Auth, $interval, $location) {

		$scope.transactions = [];
		
		$http.get(urls.tool + '/mobile/transactions/' + Auth.getActiveUserProfile().id)
				.then(gotTransactions)
				.catch(fail);
		$scope.goTo = function (id) {
			$location.path('/tab/notifications/' + id);
		}

		$interval(function () {
			$http.get(urls.tool + '/mobile/transactions/' + Auth.getActiveUserProfile().id)
				.then(gotTransactions)
				.catch(fail);
		}, 5000);

		function gotTransactions (data) {
			$scope.transactions = data.data;
		}
		function fail (err) {
			console.log(err);
		}
	}
])

.controller('notifications.ViewCtrl', ['$scope', '$http', 'urls', 'Auth', '$interval', '$stateParams',
	function ($scope, $http, urls, Auth, $interval, $stateParams) {

		$scope.transaction = {};
		
		$http.get(urls.tool + '/mobile/transactions/' + $stateParams.transactionId + '/view')
				.then(gotTransaction)
				.catch(fail);


		function gotTransaction (data) {
			$scope.transaction = data.data;
		}
		function fail (err) {
			console.log(err);
		}
	}
]);