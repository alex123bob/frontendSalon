angular.module('stepOne.directive.step', [])
    .directive('step', [
        '$sce',
        function ($sce) {
            return {
                restrict: 'E',
                replace: true,
                // transclude: true,
                template: '<div class="blog-post" name="{{footnote}}">'
                + '<h3 style="cursor: pointer;"><small ng-show="footnote">{{footnote}}</small>.{{title}}</h3>'
                + '<p ng-show="show" ng-bind-html="content"></p>'
                + '<div ng-repeat="url in screencapture">'
                    + '<img ng-show="show" class="thumbnail" ng-src="{{url}}" />'
                + '</div>'
                + '</div>',
                scope: {
                    'title': '=',
                    'screencapture': '=',
                    'content': '=',
                    'show': '=',
                    'footnote': '='
                },
                link: function ($scope, $elem, $attr) {
                    $elem = angular.element($elem); // convert into jQuery element for DOM manipulation convenience.
                    $scope.content = $sce.trustAsHtml($scope.content);
                    $elem.on('click', 'h3', function (ev) {
                        $scope.show = !$scope.show;
                        $scope.show && $scope.$emit('collapseOthers', $scope.footnote);
                        $scope.$digest();
                    });
                    
                    $scope.$on('collapseExcept', function (ev, indexExcepted){
                        if ($scope.footnote != indexExcepted) {
                            $scope.show = false;
                            $scope.$digest();
                        }
                    });
                }
            }
        }
    ]);