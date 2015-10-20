angular.module('timer-app',['ngAnimate'])
.directive('ngxTimer', ['$templateCache','$interval','$interpolate','$animate','TickTock', function($templateCache, $interval, 
	$interpolate, $animate, TickTock){
	return {
		restrict: 'EA',
		scope: {
			type: '@'
		},
		//controller: Controller,
		link: function($scope, element, iAttrs, controller) {
			function formatNumber(num){
			    return num > 9 ? '' + num: '0' + num;
			};
			function compileTemplate() {
				var template = $templateCache.get('timerTemplate.html');
				var interpolatedTemplate = $interpolate(template)($scope);
				element.html($interpolate(template)($scope));
				var elem = angular.element( document.querySelector( '#'+iAttrs.id+' .inner-box' ) );
				return elem;
			};
			function loadTempalte() {
				if ($scope.type == 'Seconds') {
					$scope.current = TickTock.funcRunner('get'+$scope.type);
					$scope.next = $scope.current+1;
					$scope.current = formatNumber($scope.current);
					$scope.next = formatNumber($scope.next);
					compileTemplate();
					$interval(function(){
					$animate.addClass(compileTemplate(),'change'); 
					$scope.current = $scope.next;
					TickTock.funcRunner('tick'+$scope.type);
					$scope.next = formatNumber(TickTock.funcRunner('get'+$scope.type) + 1) == '60' ? '00' : formatNumber(TickTock.funcRunner('get'+$scope.type) + 1);
					},1000);
				}
				else if ($scope.type == 'Minutes') {
					$scope.current = TickTock.funcRunner('get'+$scope.type);
					$scope.next = $scope.current+1;
					$scope.current = formatNumber($scope.current);
					$scope.next = formatNumber($scope.next);
					compileTemplate();
					$scope.$on('minutes', function(event,data) {
					    $animate.addClass(compileTemplate(),'change');
						$scope.current = TickTock.funcRunner('get'+$scope.type);
						$scope.next = $scope.current+1;
						$scope.current = formatNumber($scope.current);
						$scope.next = formatNumber($scope.next) == '60' ? '00' : formatNumber($scope.next);
				    });
				}
				else if ($scope.type == 'Hours') {
					$scope.current = TickTock.funcRunner('get'+$scope.type);
					$scope.next = $scope.current+1;
					$scope.current = formatNumber($scope.current);
					$scope.next = formatNumber($scope.next);
					compileTemplate();
					$scope.$on('hours', function(event,data) {
					    $animate.addClass(compileTemplate(),'change');
					    $scope.current = TickTock.funcRunner('get'+$scope.type);
						$scope.next = $scope.current+1;
						$scope.current = formatNumber($scope.current);
						$scope.next = formatNumber($scope.next) == '12' ? '00' : formatNumber($scope.next);
				    });
				}
				
			};
			loadTempalte();
		}
	};
}])
.factory('TickTock', ['$rootScope', function($rootScope){
	var seconds = 0;
	var minutes = 0;
	var hours = 0;
	var service = {};
	var returnObj = {
		funcRunner :  function (functionName) {
            return service[functionName]();
        },
        tickMinute : false,
        tickHour : false
	}
	service.getSeconds = function() {
		return seconds;
	};

	service.getMinutes = function() {
		return minutes;
	};

	service.getHours = function() {
		return hours;
	};

	service.tickSeconds = function() {
		if (seconds == 59) {
			seconds = 0;
			service.tickMinutes();
			$rootScope.$broadcast('minutes');
		}
		else {
			seconds += 1;
		}
	};

	service.tickMinutes = function() {
		
		if (minutes == 59) {
			minutes = 0;
			service.tickHours();
			$rootScope.$broadcast('hours');
		}
		else {
			minutes += 1;
		}
	};

	service.tickHours = function() {
		hours += 1;
		if (hours == 11) {
			hours = 0;
		}
		else {
			hours += 1;
		}
	};
	return returnObj;
}]);