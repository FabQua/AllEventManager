module.exports = function () {
    var UniqueObjectContainer = (require("src/common/UniqueObjectContainer.js"))();

    describe("UniqueObjectContainer", function () {
        /**
         * 
         * @type UniqueObjectContainer
         */
        var container;

        beforeEach(function () {
            container = new UniqueObjectContainer();
        });

        it("should be able add all type of elements", function () {
            var elementToAdd;

            expect(container.getSize()).toBe(0);

            // add object
            elementToAdd = {};

            container.addElement(elementToAdd);
            expect(container.getSize()).toBe(1);
            expect(container.contains(elementToAdd)).toBeTruthy();

            // add String
            elementToAdd = "foo";

            container.addElement(elementToAdd);
            expect(container.getSize()).toBe(2);
            expect(container.contains(elementToAdd)).toBeTruthy();

            // add function
            elementToAdd = function () {
                return true;
            };

            container.addElement(elementToAdd);
            expect(container.getSize()).toBe(3);
            expect(container.contains(elementToAdd)).toBeTruthy();

            // add Number
            elementToAdd = Math.random();

            container.addElement(elementToAdd);
            expect(container.getSize()).toBe(4);
            expect(container.contains(elementToAdd)).toBeTruthy();

            // add Boolean
            elementToAdd = true;

            container.addElement(elementToAdd);
            expect(container.getSize()).toBe(5);
            expect(container.contains(elementToAdd)).toBeTruthy();
        });

        it("should return a UID for an added element", function () {
            var elementToAdd;
            var uId;

            // add object
            elementToAdd = {};

            container.addElement(elementToAdd);

            uId = container.getUID(elementToAdd);
            expect(uId).not.toBeNull();

            // add String
            elementToAdd = "foo";

            container.addElement(elementToAdd);

            uId = container.getUID(elementToAdd);
            expect(uId).not.toBeNull();

            // add function
            elementToAdd = function () {
                return true;
            };

            container.addElement(elementToAdd);

            uId = container.getUID(elementToAdd);
            expect(uId).not.toBeNull();

            // add Number
            elementToAdd = Math.random();

            container.addElement(elementToAdd);

            uId = container.getUID(elementToAdd);
            expect(uId).not.toBeNull();

            // add Boolean
            elementToAdd = true;

            container.addElement(elementToAdd);

            uId = container.getUID(elementToAdd);
            expect(uId).not.toBeNull();
        });

        it("should remove an added element", function () {
            var elementToAdd;

            expect(container.getSize()).toBe(0);

            // add object
            elementToAdd = {};

            container.addElement(elementToAdd);
            container.removeElement(elementToAdd);
            
            expect(container.getSize()).toBe(0);

            // add String
            elementToAdd = "foo";

            container.addElement(elementToAdd);
            container.removeElement(elementToAdd);
            
            expect(container.getSize()).toBe(0);

            // add function
            elementToAdd = function () {
                return true;
            };

            container.addElement(elementToAdd);
            container.removeElement(elementToAdd);
            
            expect(container.getSize()).toBe(0);

            // add Number
            elementToAdd = Math.random();

            container.addElement(elementToAdd);
            container.removeElement(elementToAdd);
            
            expect(container.getSize()).toBe(0);

            // add Boolean
            elementToAdd = true;

            container.addElement(elementToAdd);
            container.removeElement(elementToAdd);
            
            expect(container.getSize()).toBe(0);
        });

        it("should not add an element twice", function () {
            function TestClass(name) {
                this.name = name;
            }

            var testobject = new TestClass("A");

            expect(container.getSize()).toBe(0);

            container.addElement(testobject);
            container.addElement(testobject);

            expect(container.getSize()).toBe(1);
        });
        
        it("should always return the same UID", function () {
            var element = {};
            var uId;
            
            container.addElement(element);
            uId = container.getUID(element);
            
            expect(uId).toBe(container.getUID(element));
        });
        
        it("should return the element for the UID", function () {
            var elements = [{}, "test", function() {}, 5, false];
            var uId;
            
            container.addElement(elements[0]);
            container.addElement(elements[1]);
            container.addElement(elements[2]);
            container.addElement(elements[3]);
            container.addElement(elements[4]);
            
            for(var i = 0; i < elements.length; i++) {
                uId = container.getUID(elements[i]);
                expect(container.getElement(uId)).toBe(elements[i]);
            }
        });

        it("should remove the correct element", function () {
            function TestClass(name) {
                this.name = name;
            }

            var testobjectA = new TestClass("A");
            var testobjectB = new TestClass("B");

            container.addElement(testobjectA);
            container.addElement(testobjectB);

            var UIDA = container.getUID(testobjectA);
            var UIDB = container.getUID(testobjectB);
            
            container.removeElement(testobjectA);
            
            expect(container.getElement(UIDA)).toBeNull();
            expect(container.getElement(UIDB)).toBe(testobjectB);
        });
    });
};