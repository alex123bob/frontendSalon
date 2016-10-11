angular.module('stepOne.controller.steps', [])
    .controller('steps', [
        '$scope',
        function ($scope, $elem){
            
            function Scope(){

            }

            $scope.visualArr = [
                {
                    title: 'Start by creating Scope Class',
                    content: 'Angular scopes are plain old JavaScript objects, on which you can attach properties just like you would on any other object. Scopes are created using the Scope constructor. Let\'s make the simplest possible version of it:',
                    url: './resources/img/createScopeClass.png'
                },
                {
                    content: 'test2',
                    url: 'https://ss0.bdstatic.com/5aV1bjqh_Q23odCf/static/superman/img/logo/logo_white_fe6da1ec.png'
                }
            ];
        }
    ]);