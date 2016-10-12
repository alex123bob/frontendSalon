angular.module('stepOne.controller.steps', [])
    .controller('steps', [
        '$scope',
        function ($scope, $elem) {
            var imagePrefix = './resources/img/',
                accordionMode = false;

            function Scope() {
                this.$$watchers = [];
            }
            // here we invoke lodash's isEqual functionality.'
            Scope.prototype.$$isEqual = function (newVal, oldVal, objectEquality) {
                if (objectEquality) {
                    return _.isEqual(newVal, oldVal);
                }
                else {
                    return newVal === oldVal ||
                        (isNaN(newVal) && isNaN(oldVal) &&
                            typeof newVal === 'number' && typeof oldVal === 'number');
                }
            }
            Scope.prototype.$watch = function (watchFunc, listenerFunc, objectEquality) {
                var watcher = {
                    watchFunc: watchFunc,
                    listenerFunc: listenerFunc || function () { },
                    objectEquality: !!objectEquality
                };

                this.$$watchers.push(watcher);
            }
            Scope.prototype.$$digest = function () {
                var me = this,
                    listenerInvoked = false;
                this.$$watchers.forEach(function (watcher, index, self) {
                    var newVal = watcher.watchFunc(me),
                        oldVal = watcher.last;
                    if (!me.$$isEqual(newVal, oldVal, watcher.objectEquality)) {
                        watcher.listenerFunc(newVal, oldVal, me);
                        listenerInvoked = true;
                        watcher.last = (watcher.objectEquality ? _.cloneDeep(newVal) : newVal);
                    }
                });
                return listenerInvoked;
            }
            Scope.prototype.$digest = function () {
                var invoked = false,
                    ttl = 10; // short for Time To Live
                do {
                    invoked = this.$$digest();
                    if (invoked && !(ttl--)) {
                        throw "Exception: 10 digest iterations reached!";
                    }
                } while (invoked);
            }
            // the first parameter is a functionality consisting of current scope and locals.
            Scope.prototype.$eval = function (expr, locals){
                return expr(this, locals);
            }
            // $apply is touted as the standard way to integrate external libraries into Angular environment.
            Scope.prototype.$apply = function (expr){
                try {
                    return this.$eval(expr);
                }
                finally {
                    // actually in real Angular source code, after we execute the optional expression,
                    // angular will internally invoke $rootScope.$digest, in which all watchers in 
                    // current application will be notified and execute corresponding listener functionality.
                    this.$digest();
                }
            }

            var test = new Scope();
            test.counter = 0;
            test.$watch(
                function (scope){
                    return scope.testVal;
                },
                function (newVal, oldVal, scope){
                    scope.counter++;
                }
            )
            test.$apply(function (scope){
                scope.testVal = 'this is just a test';
            });
            console.log(test.counter === 1);

            $scope.$on('collapseOthers', function (ev, index) {
                if (accordionMode) {
                    $scope.$broadcast('collapseExcept', index);
                }
                else {
                    // do nothing;
                }
            });

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
                },
                {
                    title: 'Recursively Comparison',
                    content: 'For now we\'ve been comparing the old value to the new with the strict equality operator ===. \
                                This is fine in most cases, as it detects changes to all primitives (numbers, strings, etc.) \
                                and also detects when an object or an array changes to a new one. \
                                But there is also another way Angular can detect changes, \
                                and that\'s detecting when something inside an object or an array changes. \
                                That is, you can watch for changes in value, not just in reference.<br /> \
                                Value-based dirty-checking implies that we have to iterate through everything \
                                contained in the old and new values if they are objects or arrays. \
                                If there\'s any difference in the two values, the watcher is dirty. \
                                If the value has other objects or arrays nested within, \
                                those will also be recursively compared by value.<br /> \
                                In order to notice changes in value, \
                                we also need to change the way we store the old value for each watcher. \
                                It isn\'t enough to just store a reference to the current value, \
                                because any changes made within that value will also be applied to the reference we\'re holding. \
                                We would never notice any changes since essentially $$areEqual would always get \
                                two references to the same value. \
                                For this reason we need to make a deep copy of the value and store that instead.',
                    urls: [
                        imagePrefix + 'objectEqualityCodeSnippetOne.jpeg',
                        imagePrefix + 'objectEqualityCodeSnippetTwo.jpeg',
                        imagePrefix + 'objectEqualityComparisonConsoleOutput.jpeg'
                    ]
                },
                {
                    title: 'Break Time to Think IT Through Carefully',
                    content: 'Checking by value is obviously a more sophisticated operation \
                                than just checking a reference. Sometimes a lot more complicate. \
                                Walking a nested data structure takes time, \
                                and holding a deep copy of it also takes up memory.<br /> \
                                That\'s why Angular does not do value-based dirty checking by default. \
                                You need to explicitly set the flag to enable it.'
                },
                {
                    title: 'Quirky NaN',
                    content: 'In JavaScript, NaN (Not-a-Number) is not equal to itself. \
                                This may sound strange, and that\'s because it is. \
                                If we don\'t explicitly handle NaN in our dirty-checking function, \
                                a watch that has NaN as a value will always be dirty.\
                                For value-based dirty-checking this case is already handled for us by \
                                the Lo-Dash isEqual function. For reference-based checking we need to handle it ourselves. \
                                Let\'s do that by tweaking the $$isEqual function:',
                    urls: [
                        imagePrefix + 'quirkyNaN.jpeg',
                        imagePrefix + 'quirkyNaNConsoleOutput.jpeg'
                    ]
                },
                {
                    title: 'Before We Talk About $apply',
                    content: 'Before we move into the next famous function which is the household name of AngularJs: \
                                $apply, we need to look at one functionality and implement it in our on way. \
                                <font color="green" size="+3">$eval</font> <br />\
                                So what is the purpose of such a seemingly roundabout way to invoke a function? \
                                One could argue that $eval makes it just slightly more explicit that some piece of \
                                code is dealing specifically with the contents of a scope. \
                                $eval is also a building block for $apply, \
                                which is what we\'ll be looking at next.<br /><br /> \
                                However, probably the most interesting use of $eval only comes when we start discussing \
                                expressions instead of raw functions. Just like with $watch, \
                                you can give $eval a string expression. It will compile that expression and execute it \
                                within the context of the scope. We will implement this later in the future.',
                    urls: [
                        imagePrefix + 'implementationOfEval.jpeg'
                    ]
                },
                {
                    title: '$apply: Integrate External Code Snippet With The Digest Cycle',
                    content: '$apply takes a function as an argument. It executes that function using $eval, \
                                and then kick-starts the digest cycle by invoking $digest. \
                                Here is a simple implementation:<br /> \
                                The $digest call is done in a finally block to \
                                make sure the digest will happen even if the function throws an exception.<br />\
                                The big idea of $apply is that we can execute some code that isn\'t aware of Angular. \
                                That code may still change things on the scope, \
                                and $apply makes sure that any watches on the scope will pick up on those changes. \
                                When people talk about integrating code to the "Angular lifecycle" using $apply, \
                                this is essentially what they mean. There really isn\'t much more to it than that.',
                    urls: [
                        imagePrefix + 'applyImplementation.png',
                        imagePrefix + 'applyInAction.png',
                        imagePrefix + 'applyExecutionResult.png'
                    ]
                },
                {
                    title: 'Wrap It Up',
                    content: 'We\'ve already come a long way, \
                                and have a perfectly usable implementation of an Angular-style dirty-checking scope system. \
                                But there\'s a lot more to Angular scopes than this, such as $evalAsync, scopePhases, \
                                $$postDigest and exceptionHandler etc.<br /><br /> \
                                Perhaps most significantly, scopes in Angular are not always standalone, \
                                disconnected objects. Instead, scopes can inherit from other scopes, \
                                and watches can watch things not only on the scope they are attached to, \
                                but also on that scope\'s parents. This approach, while conceptually quite simple, \
                                is often a source of much confusion to newcomers.<br /><br /> \
                                Here I\'d like to recommend you a book called "Know Your AngularJS Inside Out", which is\
                                available on eBook now. In this book it will create your own implementation of AngularJS\
                                piece by piece. Then you will thoroughly know how this framework ticks.',
                    urls: [
                        imagePrefix + 'thanksForComing.png'
                    ]
                }
            ];
        }
    ]);