module.exports = function () {
    /**
     * 
     * @type AllEventManager
     */
    var AllEventManager = (require("src/manager/AllEventManager.js"))();

    describe("AllEventManager", function () {
        var firstCalled;

        function WithEventHandler(name) {
            this.name = name;
            this.secondCalled = false;
            this.onFirstCalled = function (event) {
                firstCalled = true;
            };
            this.onSecondCalled = function (event) {
                this.secondCalled = true;
            };
        }

        WithEventHandler.prototype.thirdCalled = false;
        WithEventHandler.prototype.onThirdCalled = function (event) {
            this.thirdCalled = true;
        };

        function WithoutEventHandler(name) {
            this.name = name;
            this.anyFunction = function () {
            };
            this.anyProperty = {};
        }

        var testObject,
                testObject2,
                testObject3,
                groupOne = "group1",
                groupTwo = "group2",
                groupThree = "group3";

        beforeEach(function () {
            /*
             * Clear AllEventManager to be empty.
             */
            AllEventManager.clear();

            /*
             * Prepare test objects.
             */
            firstCalled = false;
            testObject = new WithEventHandler("Obj 1");
            testObject2 = new WithEventHandler("Obj 2");
            testObject3 = new WithEventHandler("Obj 3");
        });

        it("should be able to add elements", function () {
            expect(AllEventManager.getSize()).toBe(0);

            AllEventManager.register(testObject);
            expect(AllEventManager.getSize()).toBe(1);

            AllEventManager.register(testObject2);
            expect(AllEventManager.getSize()).toBe(2);

            AllEventManager.register(testObject3);
            expect(AllEventManager.getSize()).toBe(3);
        });

        it("should be able to remove elements", function () {
            AllEventManager.register(testObject);
            AllEventManager.register(testObject2);
            AllEventManager.register(testObject3);

            AllEventManager.unregister(testObject);
            expect(AllEventManager.getSize()).toBe(2);

            AllEventManager.unregister(testObject2);
            expect(AllEventManager.getSize()).toBe(1);

            AllEventManager.unregister(testObject3);
            expect(AllEventManager.getSize()).toBe(0);
        });

        it("should be able to add elements into groups", function () {
            expect(AllEventManager.getSize(groupOne)).toBe(0);
            expect(AllEventManager.getSize(groupTwo)).toBe(0);
            expect(AllEventManager.getSize(groupThree)).toBe(0);

            AllEventManager.register(testObject, groupOne);
            AllEventManager.register(testObject, groupTwo);
            AllEventManager.register(testObject, groupThree);
            expect(AllEventManager.getSize(groupOne)).toBe(1);
            expect(AllEventManager.getSize(groupOne)).toBe(1);
            expect(AllEventManager.getSize(groupOne)).toBe(1);

            AllEventManager.register(testObject2, groupOne);
            AllEventManager.register(testObject2, groupTwo);
            AllEventManager.register(testObject2, groupThree);
            expect(AllEventManager.getSize(groupOne)).toBe(2);
            expect(AllEventManager.getSize(groupOne)).toBe(2);
            expect(AllEventManager.getSize(groupOne)).toBe(2);

            AllEventManager.register(testObject3, groupOne);
            AllEventManager.register(testObject3, groupTwo);
            AllEventManager.register(testObject3, groupThree);
            expect(AllEventManager.getSize(groupOne)).toBe(3);
            expect(AllEventManager.getSize(groupOne)).toBe(3);
            expect(AllEventManager.getSize(groupOne)).toBe(3);
        });

        it("should be able to remove added elements from groups", function () {
            AllEventManager.register(testObject, groupOne);
            AllEventManager.register(testObject, groupTwo);
            AllEventManager.register(testObject, groupThree);

            AllEventManager.register(testObject2, groupOne);
            AllEventManager.register(testObject2, groupTwo);
            AllEventManager.register(testObject2, groupThree);

            AllEventManager.register(testObject3, groupOne);
            AllEventManager.register(testObject3, groupTwo);
            AllEventManager.register(testObject3, groupThree);

            AllEventManager.unregister(testObject, groupOne);
            AllEventManager.unregister(testObject, groupTwo);
            AllEventManager.unregister(testObject, groupThree);
            expect(AllEventManager.getSize(groupOne)).toBe(2);
            expect(AllEventManager.getSize(groupTwo)).toBe(2);
            expect(AllEventManager.getSize(groupThree)).toBe(2);

            AllEventManager.unregister(testObject2, groupOne);
            AllEventManager.unregister(testObject2, groupTwo);
            AllEventManager.unregister(testObject2, groupThree);
            expect(AllEventManager.getSize(groupOne)).toBe(1);
            expect(AllEventManager.getSize(groupTwo)).toBe(1);
            expect(AllEventManager.getSize(groupThree)).toBe(1);

            AllEventManager.unregister(testObject3, groupOne);
            AllEventManager.unregister(testObject3, groupTwo);
            AllEventManager.unregister(testObject3, groupThree);
            expect(AllEventManager.getSize(groupOne)).toBe(0);
            expect(AllEventManager.getSize(groupTwo)).toBe(0);
            expect(AllEventManager.getSize(groupThree)).toBe(0);
        });

        it("should be empty after clear", function () {
            AllEventManager.register(testObject);
            AllEventManager.register(testObject, groupOne);
            AllEventManager.register(testObject2);
            AllEventManager.register(testObject2, groupOne);
            AllEventManager.register(testObject3);
            AllEventManager.register(testObject3, groupOne);

            AllEventManager.clear();
            expect(AllEventManager.getSize()).toBe(0);
            expect(AllEventManager.getSize(groupOne)).toBe(0);
        });

        it("should call event handler in global scope", function () {
            AllEventManager.register(testObject);

            AllEventManager.dispatchEvent("firstcalled", {});
            AllEventManager.dispatchEvent("secondcalled", {});
            AllEventManager.dispatchEvent("thirdcalled", {});

            expect(firstCalled).toBeTruthy();
            expect(testObject.secondCalled).toBeTruthy();
            expect(testObject.thirdCalled).toBeTruthy();
        });

        it("should call event handler in specific groups", function () {
            AllEventManager.register(testObject, groupOne);

            AllEventManager.dispatchEvent("firstcalled", {}, groupOne);
            AllEventManager.dispatchEvent("secondcalled", {}, groupOne);
            AllEventManager.dispatchEvent("thirdcalled", {}, groupOne);

            expect(firstCalled).toBeTruthy();
            expect(testObject.secondCalled).toBeTruthy();
            expect(testObject.thirdCalled).toBeTruthy();
        });
    });
};