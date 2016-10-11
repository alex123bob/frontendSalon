angular.module('stepOne.directive.step', [])
    .directive('step', function (){
        return {
            restrict: 'E',
            replace: true,
            // transclude: true,
            template: '<div class="blog-post">'
                        + '<h3 style="cursor: pointer;">{{title}}<small>{{footnote}}</small></h3>'
                        + '<img ng-show="screencapture" class="thumbnail" src="{{screencapture}}" />'
                        + '<p ng-show="showContent">{{content}}</p>'
                    + '</div>',
            scope: {
                'title': '=',
                'screencapture': '=',
                'content': '=',
                'showContent': '='
            },
            link: function ($scope, $elem, $attr){
                $elem = angular.element($elem); // convert into jQuery element for DOM manipulation convenience.
                $elem.on('click', 'h3', function (ev){
                    $scope.showContent = !$scope.showContent;
                    $scope.$digest();
                });
            }
        }
    });