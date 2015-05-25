module.exports = function () {
    var EventExtractor = (require("src/event/EventExtractor.js"))();
    var eventExtractor = new EventExtractor();

    describe("EventExtractor", function () {
        var testObject;
        var events;
        
        beforeEach(function () {
            testObject = {};
            events = [];
        });
        
        
        it("should extract all event handler of objects", function () {
            testObject = {
                onFirst: function(event) {},
                onSecond: function(event) {}
            };
            
            testObject.onThird = function(event) {};
            
            events = eventExtractor.extractEventHandler(testObject);
            
            expect(events.length).toBe(3);
            expect(events[0].eventType).toBe("first");
            expect(events[1].eventType).toBe("second");
            expect(events[2].eventType).toBe("third");
            
            expect(events[0].eventHandler).toBe(testObject.onFirst);
            expect(events[1].eventHandler).toBe(testObject.onSecond);
            expect(events[2].eventHandler).toBe(testObject.onThird);
        });
        
        it("should extract all event handler of class objects", function () {
            function TestObject() {
                this.onFirst = function(event) {};
                this.onSecond = function(event) {};
            }
            testObject = new TestObject();
            testObject.onThird = function(event) {};
            
            events = eventExtractor.extractEventHandler(testObject);
            
            expect(events.length).toBe(3);
            expect(events[0].eventType).toBe("first");
            expect(events[1].eventType).toBe("second");
            expect(events[2].eventType).toBe("third");
            
            expect(events[0].eventHandler).toBe(testObject.onFirst);
            expect(events[1].eventHandler).toBe(testObject.onSecond);
            expect(events[2].eventHandler).toBe(testObject.onThird);
        });
        
        it("should not extract non event handler", function () {
            function TestObject() {
                this.noFirst = function(event) {};
                this.onSecond = function(nonEvent) {};
            }
            testObject = new TestObject();
            testObject.onThird = 5;
            testObject.onFourth = {};
            
            events = eventExtractor.extractEventHandler(testObject);
            
            expect(events.length).toBe(0);
        });
    });
};