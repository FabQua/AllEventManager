AllEventManager - Annotation Like Loading Event Manager
===============

Description
-------------------
The AllEventManager (Annotaion Like Loading Event Manager) helps to organize
communcation between objects in a central point. It allows you to register an
object which is then scanned for properties that are event handlers.

Basic features:
- Register a context (including its event handlers)
- Unregister a context (including its event handlers)
- Group the contexts up (optional)
- Dispatch events in specific scope

# How it works

Simple example
-------
Prepare an object:
```js
var firstCalled = false;

var obj = {
    secondCalled: false,
    thirdCalled: false,
    onFirstCalled: function(event) {
        firstCalled = true;
    },
    onSecondCalled: function(event) {
        this.secondCalled = true;
    }
};

obj.onThirdCalled = function(event) {
    this.thirdCalled = true;
};
```

Case 1:
-------
```js
AllEventManager.register(obj);

AllEventManager.dispatchEvent("firstcalled", {});
AllEventManager.dispatchEvent("secondcalled", {});
AllEventManager.dispatchEvent("thirdcalled", {});

firstCalled // true
obj.secondCalled // true
obj.thirdCalled // true
```

Case 2:
```js
AllEventManager.register(obj); // register context in global scope
AllEventManager.register(obj, "group1"); // register context in group group1
AllEventManager.register(obj, "group2"); // register context in group group2

AllEventManager.dispatchEvent("firstcalled", {}); // dispatch event in global scope
AllEventManager.dispatchEvent("secondcalled", {}, "group1"); // dispatch event in group1
AllEventManager.dispatchEvent("thirdcalled", {}, "group2"); // dispatch event in group2

firstCalled // true
obj.secondCalled // true
obj.thirdCalled // true
```

Advanced example:
----------------
function Site() {
}


# Technologies
- Basic JavaScript
- Nodejs (https://nodejs.org/)
- Grunt (http://gruntjs.com/)
- Karma (https://karma-runner.github.io/0.12/index.html)
- Jasmine (https://jasmine.github.io/)

# Building
Coming soon...

# Testing
Coming soon...

# TODO
- add more tests
- add jshint to grunt tasks

# License
The MIT License (MIT)
[Read more words!](LICENSE.md)