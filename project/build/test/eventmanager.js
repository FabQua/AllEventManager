module.exports = function () {
    /**
     * 
     * @type EventManager
     */
    var EventManager = (require("src/manager/EventManager.js"))();

    describe("EventManager", function () {
        /**
         * 
         * @type EventManager
         */
        var eventManager;

        beforeEach(function () {
            eventManager = new EventManager();
        });

        it("should be able to add elements", function () {
            var testObject = {
                onFirst: function(event) {},
                onSecond: function(event) {}
            };
            var testObject2 = {
                onFirst: function(event) {},
                onSecond: function(event) {}
            };
            var testObject3 = {
                onFirst: function(event) {},
                onSecond: function(event) {}
            };

            expect(eventManager.hasMembers()).toBeFalsy();
            expect(eventManager.getSize()).toBe(0);

            // add object
            eventManager.register(testObject);
            expect(eventManager.hasMembers()).toBeTruthy();
            expect(eventManager.getSize()).toBe(1);
            
            // add object
            eventManager.register(testObject2);
            expect(eventManager.hasMembers()).toBeTruthy();
            expect(eventManager.getSize()).toBe(2);
            
            // add object
            eventManager.register(testObject3);
            expect(eventManager.hasMembers()).toBeTruthy();
            expect(eventManager.getSize()).toBe(3);
        });
        
        it("should be able to remove elements", function () {
            var testObject = {
                onFirst: function(event) {},
                onSecond: function(event) {}
            };
            var testObject2 = {
                onFirst: function(event) {},
                onSecond: function(event) {}
            };
            var testObject3 = {
                onFirst: function(event) {},
                onSecond: function(event) {}
            };

            // add object
            eventManager.register(testObject);
            eventManager.register(testObject2);
            eventManager.register(testObject3);
            
            eventManager.unregister(testObject);
            expect(eventManager.getSize()).toBe(2);
            
            eventManager.unregister(testObject2);
            expect(eventManager.getSize()).toBe(1);
            
            eventManager.unregister(testObject3);
            expect(eventManager.getSize()).toBe(0);
            expect(eventManager.hasMembers()).toBeFalsy();
        });
        
        it("should call the event handler on dispatching events", function () {
            var firstCalled = false;
            
            var testObject = {
                secondCalled: false,
                thirdCalled: false,
                onFirstCalled: function(event) {
                    firstCalled = true;
                },
                onSecondCalled: function(event) {
                    this.secondCalled = true;
                }
            };
            
            testObject.onThirdCalled = function(event) {
                this.thirdCalled = true;
            };

            // add object
            eventManager.register(testObject);
            
            eventManager.dispatchEvent("firstcalled", {});
            eventManager.dispatchEvent("secondcalled", {});
            eventManager.dispatchEvent("thirdcalled", {});
            
            expect(firstCalled).toBeTruthy();
            expect(testObject.secondCalled).toBeTruthy();
            expect(testObject.thirdCalled).toBeTruthy();
        });
    });
};