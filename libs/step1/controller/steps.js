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
                var me = this;
                this.$$watchers.forEach(function (watcher, index, self) {
                    var newVal = watcher.watchFunc(me),
                        oldVal = watcher.last;
                    if (newVal !== oldVal) {
                        watcher.listenerFunc(newVal, oldVal, me);
                        watcher.last = newVal;
                    }
                });
            }
            // let's have a try
            var fruit = new Scope();
            fruit.name = 'Apple';
            fruit.counter = 0; // counter is to record how many times we have changed the name;
            fruit.$watch(
                function (scope){
                    return scope.name;
                },
                function (newVal, oldVal, scope){
                    scope.counter++;
                }
            );
            // before everything starts, counter is equivalent to zero
            console.assert(fruit.counter === 0, 'oops, it is apparently not zero');
            // we digest it. see what happens.
            fruit.$digest();
            console.assert(fruit.counter === 1, 'it\'s not one, what ?');
            // what if we digest again.
            fruit.$digest();
            console.assert(fruit.counter === 2, 'counter is not equal to two, the value returned by watch must have not been changed.');
            // now we change the fruit name.
            fruit.name = 'Tangerine'; // don't judge me on choosing tangerine, coz it's autumn, tangerine is the great fruit.😄
            fruit.$digest();
            console.assert(fruit.counter === 2, 'assertion failed!');


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
                },
                {
                    title: 'Test with Dirty Check',
                    content: 'Watch function of a watcher should return the piece \
                                of data whose changes we are interested in. \
                                Usually that piece of data is something that exists on the scope.',
                    urls: [
                        imagePrefix + 'tryWatchWithDirtyCheck.jpeg',
                        imagePrefix + 'watchFuncConsoleOutput.jpeg'
                    ]
                }
            ];
        }
    ]);