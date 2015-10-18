angular.module('timer-app',['ngAnimate'])
.controller('timerController', ['$scope', function($scope){
	$scope.current = 0;
	$scope.next = $scope.current+1;
}])
.directive('ngxTimer', ['$templateCache','$interval','$interpolate','$animate', function($templateCache, $interval, 
	$interpolate, $animate){
	return {
		restrict: 'EA',
		controller:'timerController',
		link: function($scope, element, iAttrs, controller) {
			function loadTempalte() {
			$interval(function(){
				var template = $templateCache.get('timerTemplate.html');
				var interpolatedTemplate = $interpolate(template)($scope);
				element.html($interpolate(template)($scope));
				var elem = angular.element( document.querySelector( '#box' ) );
				$animate.addClass(elem,'change'); 
				$scope.current = $scope.next;
				$scope.next = $scope.next == 60 ? 0 : $scope.next + 1; 
			},1000);};
			loadTempalte();
		}
	};
}]);