(function () {
    var UniqueObjectContainer = (function () {
    /**
     * 
     * @type UniqueKeyGen
     */
    var UniqueKeyGen = (function () {
    /**
     * 
     * @returns {UniqueKeyGen}
     */
    function UniqueKeyGen() {
        var id = 0,
                level = 0;

        function setNextUniqueKey() {
            if (id === 9007199254740992) {
                id = 0;
                level++;
            } else {
                id++;
            }
        }

        this.getUniqueKey = function () {
            var uniqueKey = level.toString(16) + id.toString(16);

            setNextUniqueKey();

            return uniqueKey;
        };
    }

    return UniqueKeyGen;
})();
    /**
     * 
     * @type UniqueKeyGen
     */
    var _UNIQUEKEYGEN = new UniqueKeyGen();


    /**
     * 
     * @returns {UniqueObjectContainer}
     */
    function UniqueObjectContainer() {

        /**
         * The list of all elements on this container. The index of the element
         * is the same as the index of the UID.
         * 
         * @type Array the list of elements.
         */
        var _elements = [];

        /**
         * 
         * 
         * @type Array
         */
        var _UIDs = [];

        /**
         * 
         * @param {mixed} element
         * @returns {null|String}
         */
        this.getUID = function (element) {
            var UID = null;
            var index = _elements.indexOf(element);

            if (index !== -1) {
                UID = _UIDs[index];
            }

            return UID;
        };

        /**
         * Returns the element which was stored under the given UID.
         * @param {String} UID
         * @returns {null|mixed} the element.
         */
        this.getElement = function (UID) {
            var element = null;
            var index = _UIDs.indexOf(UID);

            if (index !== -1) {
                element = _elements[index];
            }

            return element;
        };

        /**
         * 
         * @param {mixed} element
         */
        this.addElement = function (element) {
            if (!this.contains(element)) {
                var UID = _UNIQUEKEYGEN.getUniqueKey();

                _elements.push(element);
                _UIDs.push(UID);
            }
        };

        /**
         * 
         * @param {mixed} element
         * @returns {undefined}
         */
        this.removeElement = function (element) {
            var index = _elements.indexOf(element);

            if (index !== -1) {
                _elements.splice(index, 1);
                _UIDs.splice(index, 1);
            }
        };

        /**
         * Returns <code>false</code>, no element is, else <code>false</code>.
         * 
         * @returns {boolean}
         */
        this.isEmpty = function () {
            return _elements.length === 0;
        };

        /**
         * 
         * @returns {Number} the element count.
         */
        this.getSize = function () {
            return _elements.length;
        };

        /**
         * 
         * @param {mixed} element
         * @returns {boolean} <code>true</code> if the element is in this
         * container, else <code>false</code>.
         */
        this.contains = function (element) {
            return _elements.indexOf(element) !== -1;
        };
    }

    return UniqueObjectContainer;
})();

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
})();