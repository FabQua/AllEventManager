module.exports = function () {
    var ObjectContainer = (require("src/common/ObjectContainer.js"))();

    describe("UniqueObjectContainer", function () {
        /**
         * 
         * @type ObjectContainer
         */
        var container;
        var elementToAdd;
        var UID;

        beforeEach(function () {
            container = new ObjectContainer();
        });

        it("should return a UID for adding an element", function () {
            // add object
            elementToAdd = {};

            UID = container.addElement(elementToAdd);
            expect(UID).not.toBeNull();

            // add String
            elementToAdd = "foo";

            UID = container.addElement(elementToAdd);
            expect(UID).not.toBeNull();

            // add function
            elementToAdd = function () {
                return true;
            };

            UID = container.addElement(elementToAdd);
            expect(UID).not.toBeNull();

            // add Number
            elementToAdd = Math.random();

            UID = container.addElement(elementToAdd);
            expect(UID).not.toBeNull();

            // add Boolean
            elementToAdd = true;

            UID = container.addElement(elementToAdd);
            expect(UID).not.toBeNull();
        });

        it("should be able add all type of elements", function () {
            expect(container.getSize()).toBe(0);

            // add object
            elementToAdd = {};

            UID = container.addElement(elementToAdd);
            expect(container.getSize()).toBe(1);
            expect(container.contains(UID)).toBeTruthy();
            expect(container.containsElement(elementToAdd)).toBeTruthy();

            // add String
            elementToAdd = "foo";

            UID = container.addElement(elementToAdd);
            expect(container.getSize()).toBe(2);
            expect(container.contains(UID)).toBeTruthy();
            expect(container.containsElement(elementToAdd)).toBeTruthy();

            // add function
            elementToAdd = function () {
                return true;
            };

            UID = container.addElement(elementToAdd);
            expect(container.getSize()).toBe(3);
            expect(container.contains(UID)).toBeTruthy();
            expect(container.containsElement(elementToAdd)).toBeTruthy();

            // add Number
            elementToAdd = Math.random();

            UID = container.addElement(elementToAdd);
            expect(container.getSize()).toBe(4);
            expect(container.contains(UID)).toBeTruthy();
            expect(container.containsElement(elementToAdd)).toBeTruthy();

            // add Boolean
            elementToAdd = true;

            UID = container.addElement(elementToAdd);
            expect(container.getSize()).toBe(5);
            expect(container.contains(UID)).toBeTruthy();
            expect(container.containsElement(elementToAdd)).toBeTruthy();
        });

        it("should remove an added element", function () {
            expect(container.getSize()).toBe(0);

            // add object
            elementToAdd = {};

            UID = container.addElement(elementToAdd);
            container.removeElement(UID);
            
            expect(container.getSize()).toBe(0);

            // add String
            elementToAdd = "foo";

            UID = container.addElement(elementToAdd);
            container.removeElement(UID);
            
            expect(container.getSize()).toBe(0);

            // add function
            elementToAdd = function () {
                return true;
            };

            UID = container.addElement(elementToAdd);
            container.removeElement(UID);
            
            expect(container.getSize()).toBe(0);

            // add Number
            elementToAdd = Math.random();

            UID = container.addElement(elementToAdd);
            container.removeElement(UID);
            
            expect(container.getSize()).toBe(0);

            // add Boolean
            elementToAdd = true;

            UID = container.addElement(elementToAdd);
            container.removeElement(UID);
            
            expect(container.getSize()).toBe(0);
        });

        it("should add an element twice", function () {
            elementToAdd = {
                name: "RKaczmarek"
            };
            
            expect(container.getSize()).toBe(0);

            container.addElement(elementToAdd);
            container.addElement(elementToAdd);

            expect(container.getSize()).toBe(2);
        });
        
        it("should return the same UID after insertion", function () {
            elementToAdd = {};
            
            UID = container.addElement(elementToAdd);
            expect(UID).toBe(container.getUID(elementToAdd));
        });
        
        it("should return different UID for the same"
                + " element, which was added twice", function () {
            elementToAdd = {};
            
            UID = container.addElement(elementToAdd);
            var UID2 = container.addElement(elementToAdd);
            
            expect(UID).toBe(container.getUID(elementToAdd));
            container.removeElement(UID);
            expect(UID2).toBe(container.getUID(elementToAdd));
        });
        
        it("should return the element for the UID", function () {
            var elements = [{}, "test", function() {}, 5, false];
            
            for(var i = 0; i < elements.length; i++) {
                UID = container.addElement(elements[i]);
                expect(container.getElement(UID)).toBe(elements[i]);
            }
        });

        it("should remove the correct element", function () {
            var testobjectA = {};
            var testobjectB = {};

            var UIDA = container.addElement(testobjectA);
            var UIDB = container.addElement(testobjectB);

            container.removeElement(UIDA);
            
            expect(container.getElement(UIDA)).toBeNull();
            expect(container.getElement(UIDB)).toBe(testobjectB);
        });
    });
};