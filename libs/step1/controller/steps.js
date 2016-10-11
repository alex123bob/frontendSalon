angular.module('stepOne.controller.steps', [])
    .controller('steps', [
        '$scope',
        function ($scope, $elem) {
            var imagePrefix = './resources/img/'

            function Scope() {
                this.$$watchers = [];
            }

            Scope.prototype.$watch = function (watchFunc, listenerFunc) {
                var watcher = {
                    watchFunc: watchFunc,
                    listenerFunc: listenerFunc
                };

                this.$$watchers.push(watcher);
            }

            Scope.prototype.$digest = function () {
                this.$$watchers.forEach(function (watcher, index, self) {
                    watcher.listenerFunc();
                });
            }
            // let's have a try
            var scope = new Scope();
            scope.$watch(
                function () {
                    console.log('this is watch Function. currently we have nothing special to do.');
                },
                function () {
                    console.log('hey, I am listener function for every watcher. I am triggered. YAY! 😄');
                }
            )
            scope.$digest();

            $scope.visualArr = [
                {
                    title: 'Start by creating Scope Class',
                    content: 'Angular scopes are plain old JavaScript objects, \
                                on which you can attach properties just like you \
                                would on any other object. Scopes are created using \
                                the Scope constructor. \
                                <br />Let\'s make the simplest possible version of it:',
                    urls: [imagePrefix + 'createScopeClass.jpeg']
                },
                {
                    title: 'Watching Object Properties: $watch And $digest',
                    content: '$watch and $digest are two sides of the same coin. \
                                Together they form the core of what Angular scopes are all about: \
                                Reacting to changes in data. \
                                With $watch you can attach a watcher to a scope.<br /> \
                                A watcher is something that is notified when a change occurs in the scope. \
                                You create a watcher by providing two functions to $watch:<br /> \
                                A watch function, which specifies the piece of data you\'re interested in.<br />\
                                A listener function which will be called whenever that data changes.',
                    urls: [imagePrefix + 'watchAndListener.jpeg']
                },
                {
                    title: 'Test with $watch Function',
                    content: 'Let\'s have a try:',
                    urls: [
                        imagePrefix + 'watchTest.jpeg',
                        imagePrefix + 'consoleTestResult.jpeg'
                    ]
                }
            ];
        }
    ]);