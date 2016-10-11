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
                    listenerFunc: listenerFunc || function (){}
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
            // however here comes the bug.
            var ecoSys = new Scope();
            ecoSys.name = 'Earth Planet';
            ecoSys.counter = 0;

            ecoSys.$watch(
                function (scope){
                    return scope.counter;
                },
                function (newVal, oldVal, scope){
                    scope.thirdVariable = (scope.counter === 2);
                }
            )

            ecoSys.$watch(
                function (scope){
                    return scope.name;
                },
                function (newVal, oldVal, scope){
                    scope.counter++;
                }
            );
            ecoSys.$digest();
            console.log(ecoSys.counter === 1);
            ecoSys.name = 'Mercury';
            ecoSys.$digest();
            console.log(ecoSys.counter === 2);
            // now counter is equivalent to two, generally we expect that thirdVariable becomes true.
            // HOWEVER
            console.assert(ecoSys.thirdVariable === true, 'thirdVariable is not true, something goes wrong here!');

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
                },
                {
                    title: 'Pitfall of This Mechanism',
                    content: 'The core of the implementation is now there, \
                                but we\'re still far from done. For instance, \
                                there\'s a fairly typical scenario we\'re not supporting yet: \
                                The listener functions themselves may also change properties on the scope. \
                                If this happens, and there\'s another watcher looking at the property that just changed, \
                                it might not notice the change during the same digest pass:',
                    urls: [
                        imagePrefix + 'notNotifiedWhileDigesting.jpeg',
                        imagePrefix + 'notNotifiedConsoleOutput.jpeg'
                    ]
                }
            ];
        }
    ]);