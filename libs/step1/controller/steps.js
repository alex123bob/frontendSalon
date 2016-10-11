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

            Scope.prototype.$$digest = function () {
                var me = this,
                    listenerInvoked = false;
                this.$$watchers.forEach(function (watcher, index, self) {
                    var newVal = watcher.watchFunc(me),
                        oldVal = watcher.last;
                    if (newVal !== oldVal) {
                        watcher.listenerFunc(newVal, oldVal, me);
                        listenerInvoked = true;
                        watcher.last = newVal;
                    }
                });
                return listenerInvoked;
            }
            Scope.prototype.$digest = function (){
                var invoked = false,
                    ttl = 10; // short for Time To Live
                do {
                    invoked = this.$$digest();
                    if (invoked && !(ttl--)) {
                        throw "Exception: 10 digest iterations reached!";
                    }
                }while(invoked);
            }

            // WHAT IF there are two watchers modifying each others' variable in listener function.
            var testScope = new Scope();
            testScope.counter1 = 0;
            testScope.counter2 = 0;

            testScope.$watch(
                function (scope){
                    return scope.counter1;
                },
                function (newVal, oldVal, scope){
                    scope.counter2++;
                }
            );

            testScope.$watch(
                function (scope){
                    return scope.counter2;
                },
                function (newVal, oldVal, scope){
                    scope.counter1++;
                }
            );

            // This is gonna run until your browser crashes if we comment it out.
            // testScope.$digest();
            console.log(testScope.counter1, testScope.counter2);

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
                },
                {
                    title: 'Idempotent: Make A Little Adjustments',
                    content: '$digest now runs all watches at least once. \
                                If, on the first pass, any of the watched values has changed, \
                                the pass is marked dirty, and all watches are run for a second time. \
                                This goes on until there\'s a full pass where none of the watched values \
                                has changed and the situation is deemed stable.<br />\
                                We can now make another important realization about Angular watches: \
                                They may be run many times per each digest pass. \
                                This is why people often say watches should be idempotent: \
                                A watch should have no side effects, \
                                or only side effects that can happen any number of times. \
                                If, for example, a watch function fires an Ajax request, \
                                there are no guarantees about how many requests your app is making.',
                    urls: [
                        imagePrefix + 'idempotent.jpeg',
                        imagePrefix + 'idempotentConsoleOutput.jpeg'
                    ]
                },
                {
                    title: 'Glaring ERROR',
                    content: 'What happens if there are two watches looking at changes made by each other? \
                                That is, what if the state never stabilizes? Such a situation is shown in the code below. \
                                In the example the $digest call is commented out. \
                                Uncomment it will see the spin always stay there. SOOOOOOOOO SAD!😔<br />\
                                I just made a BOO-BOO!',
                    urls: [
                        imagePrefix + 'glaringOmission.jpeg'
                    ]
                },
                {
                    title: 'Time To Live',
                    content: '',
                    urls: [
                        imagePrefix + 'ttl.jpeg',
                        imagePrefix + 'ttlConsoleOutput.jpeg'
                    ]
                }
            ];
        }
    ]);