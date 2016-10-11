angular.module('stepOne.directive.step', [])
    .directive('step', function (){
        return {
            restrict: 'E',
            replace: true,
            // transclude: true,
            template: '<div class="blog-post">'
                        + '<h3 style="cursor: pointer;">{{title}}<small ng-show="footnote">{{footnote}}</small></h3>'
                        + '<img ng-show="show" class="thumbnail" ng-src="{{screencapture}}" />'
                        + '<p ng-show="show">{{content}}</p>'
                    + '</div>',
            scope: {
                'title': '=',
                'screencapture': '=',
                'content': '=',
                'show': '=',
                'footnote': '='
            },
            link: function ($scope, $elem, $attr){
                $elem = angular.element($elem); // convert into jQuery element for DOM manipulation convenience.
                $elem.on('click', 'h3', function (ev){
                    $scope.show = !$scope.show;
                    $scope.$digest();
                });
            }
        }
    });