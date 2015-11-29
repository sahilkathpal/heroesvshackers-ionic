angular.module('starter.home', [])
.controller('home.IndexCtrl', ['$scope', '$location', 'Auth', '$http', 'urls',
	function ($scope, $location, Auth, $http, urls) {

		if (! Auth.getActiveUserProfile()) {
			$location.path('/login');
		}

		$scope.friends = [];
		$http.get(urls.tool + '/mobile/friends/' + Auth.getActiveUserProfile().id)
			.then(function (data) {
				$scope.friends = data.data;
			});

		// $scope.$on('$ionicView.enter', function(e) {
		// 	refreshData();  	
		// });
	}
]);

angular.module('starter.home')
.controller('home.UserCtrl', ['$scope', '$location', 'Auth', '$stateParams', 'urls', '$http', '$rootScope',
	function ($scope, $location, Auth, $stateParams, urls, $http, $rootScope) {

		if (! Auth.getActiveUserProfile()) {
			$location.path('/login');
		}

		$scope.friend = {};
		$http.get(urls.tool + '/mobile/friends/' + Auth.getActiveUserProfile().id + '/' + $stateParams.userId)
			.then(function (data) {
				$scope.friend = data.data;
			})
			.catch(fail);

		$scope.obj = {
			user_id: $scope.friend.id
		};

		$scope.sendMoney = sendMoney;

		function sendMoney () {
			if ($scope.obj.amount > Auth.getActiveUserProfile().balance) {
				alert('You don\'t have sufficient balance' );
				return;
			}
			if ($scope.obj.amount != 0 && ! $scope.obj.amount) {
				alert('Please set an amount');
				return;
			}
			var assetToken = makeAssetToken($scope.obj.amount, $scope.obj.message);
			var payload = {
				address: $scope.friend.address,
				assetToken: assetToken,
				user_id: $scope.friend.id,
				sender_id: Auth.getActiveUserProfile().id,
				message: $scope.obj.message || 'No message..',
				amount: $scope.obj.amount
			};
			$scope.processing = true;
			$http.post(urls.node + '/send', payload)
				.then(function (data) {
					$scope.processing = false;
					alert('Token has been sent.');
				}).catch(fail);
			$http.post(urls.tool + '/mobile/users/' + Auth.getActiveUserProfile().id + '/deduct/' + $scope.obj.amount);
			var u = JSON.parse(localStorage.user);
			u.balance -= $scope.obj.amount;
			localStorage.user = JSON.stringify(u);
			Auth.setActiveUserProfile(u);
			$rootScope.$broadcast('balance-updated', u.balance);
		}
		function makeAssetToken (amount, message) {
			message = message || 'no-message';
			String.prototype.hashCode = function(){
				var hash = 0;
				if (this.length == 0) return hash;
				for (i = 0; i < this.length; i++) {
					char = this.charCodeAt(i);
					hash = ((hash<<5)-hash)+char;
					hash = hash & hash; // Convert to 32bit integer
				}
				return hash;
			}
			return message + message.hashCode();
		}

		function fail (err) {
			console.log(err);
			alert('Something went wrong!');
		}

		// $scope.$on('$ionicView.enter', function(e) {
		// 	refreshData();  	
		// });
	}
]);

