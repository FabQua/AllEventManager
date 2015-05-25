(function () {
    /**
     * 
     * @type EventManager
     */
    var EventManager = (function () {
    /**
     * 
     * @type EventExtractor
     */
    var EventExtractor = (function () {
    /**
     * 
     * @type RegExp
     */
    var STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;
    /**
     * 
     * @type RegExp
     */
    var ARGUMENT_NAMES = /([^\s,]+)/g;

    /**
     * 
     * @param {function} func
     * @returns {Array}
     */
    function getParamNames(func) {
        var fnStr = func.toString().replace(STRIP_COMMENTS, '');
        var result = fnStr.slice(fnStr.indexOf('(') + 1, fnStr.indexOf(')')).match(ARGUMENT_NAMES);
        if (result === null) {
            result = [];
        }
        return result;
    }

    /**
     * Inspects the property and returns <code>true<code> if the property
     * matches an Event Manager's event handler.
     * 
     * @param {String} propName the property name to inspect.
     * @param {function} value the property value to inspect.
     * @returns {boolean} <code>true</code> if the property is a generic like
     * event handler.
     */
    function isEventHandler(propName, value) {
        var isEventHandler = false;

        if (propName.substr(0, 2) === "on" && typeof value === "function") {
            var args = getParamNames(value);

            if (args.length === 1 && args[0] === "event") {
                isEventHandler = true;
            }
        }

        return isEventHandler;
    }

    /**
     * 
     * @returns {EventExtractor}
     */
    function EventExtractor() {

        /**
         * Creates an array of events that are present in the context's properties.
         * 
         * @param {object} context the context.
         * @returns {Array} the array with events.
         */
        this.extractEventHandler = function (context) {
            var events = [];
            if (context !== null && typeof context === "object") {
                for (var prop in context) {
                    if (isEventHandler(prop, context[prop])) {
                        events.push({
                            eventType: prop.charAt(2).toLowerCase()
                                    + prop.substr(3, prop.length - 3).toLowerCase(),
                            eventHandler: context[prop]
                        });
                    }
                }
            }

            return events;
        };
    }

    return EventExtractor;
})();
    /**
     * 
     * @type UniqueObjectContainer
     */
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
    /**
     * 
     * @type EventExtractor
     */
    var _eventExtractor = new EventExtractor();


    /**
     * 
     * @param {String} name
     * @returns {EventManager}
     */
    function EventManager(name) {
        this.name = name;
        
        /**
         * 
         * @type Number
         */
        var _length = 0;

        /**
         * The container for all elements that are used by this EventManager.
         * It contains all contexts, their handlers and all event types. This
         * container returns the UIDs for this elements.
         * 
         * @type UniqueObjectContainer
         */
        var _uniqueObjectContainer = new UniqueObjectContainer();

        /**
         * Contains all event handler UIDs and the context UID it belongs to.
         * The EHUID is the key and the value is the CUID.
         * 
         * @type Array
         */
        var _eventHandlerContext = [];

        /**
         * Contains all event handler UIDs and the event type UID it belongs to.
         * The EHUID is the key and the value is the ETUID.
         * 
         * @type Array
         */
        var _eventHandlerType = [];

        /**
         * Contains all event handler UIDs of the event handlers that belong to
         * the context object. The CUID is the index and it contains an array of
         * EHUIDs.
         * 
         * @type Array
         */
        var _contextMembership = [];

        /**
         * Contains all event handler UIDs of the event handlers that belong to
         * the event type. The ETUID is the index and the value is an array of
         * EHUIDs.
         * 
         * @type Array
         */
        var _eventTypeMembership = [];

        /**
         * Returns <code>true</code> if the context is already registered, else
         * <code>false</code>.
         * @param {object} context
         * @returns {Boolean}
         */
        function isRegistered(context) {
            return _uniqueObjectContainer.contains(context);
        }

        /**
         * 
         * @param {String} EHUID
         * @param {String} ETUID
         * @returns {undefined}
         */
        function setEventHandlerType(EHUID, ETUID) {
            if (typeof EHUID === "string" && !(EHUID in _eventHandlerType)) {
                _eventHandlerType[EHUID] = ETUID;
            }
        }

        /**
         * 
         * @param {String} EHUID
         * @returns {String} the ETUID.
         */
        function getEventHandlerType(EHUID) {
            var ETUID = null;

            if (EHUID in _eventHandlerType) {
                ETUID = _eventHandlerType[EHUID];
            }

            return ETUID;
        }

        /**
         * 
         * @param {String} EHUID
         * @returns {undefined}
         */
        function removeEventHandlerType(EHUID) {
            if (EHUID !== null && typeof EHUID === "string"
                    && EHUID in _eventHandlerType) {
                delete _eventHandlerType[EHUID];
            }
        }

        /**
         * 
         * @param {String} EHUID
         * @param {String} CUID
         * @returns {undefined}
         */
        function setEventHandlerContext(EHUID, CUID) {
            if (typeof EHUID === "string" && !(EHUID in _eventHandlerContext)) {
                _eventHandlerContext[EHUID] = CUID;
            }
        }

        /**
         * 
         * @param {String} EHUID
         * @returns {String} the CUID.
         */
        function getEventHandlerContext(EHUID) {
            var CUID = null;

            if (EHUID in _eventHandlerContext) {
                CUID = _eventHandlerContext[EHUID];
            }

            return CUID;
        }

        /**
         * 
         * @param {String} EHUID
         * @returns {undefined}
         */
        function removeEventHandlerContext(EHUID) {
            if (EHUID !== null && typeof EHUID === "string"
                    && EHUID in _eventHandlerContext) {
                delete _eventHandlerContext[EHUID];
            }
        }

        /**
         * 
         * @param {String} ETUID
         * @returns {Array}
         */
        function addEventTypeMembership(ETUID) {
            if (typeof ETUID === "string" && !(ETUID in _eventTypeMembership)) {
                _eventTypeMembership[ETUID] = [];
            }

            return _eventTypeMembership[ETUID];
        }

        /**
         * 
         * @param {String} ETUID
         * @returns {null|Array}
         */
        function getEventTypeMembership(ETUID) {
            var eventTypeMS = null;

            if (typeof ETUID === "string" && ETUID in _eventTypeMembership) {
                eventTypeMS = _eventTypeMembership[ETUID];
            }

            return eventTypeMS;
        }

        /**
         * 
         * @param {String} ETUID
         * @returns {undefined}
         */
        function removeEventTypeMembership(ETUID) {
            if (ETUID !== null && typeof ETUID === "string"
                    && ETUID in _eventTypeMembership) {
                delete _eventTypeMembership[ETUID];
            }
        }

        /**
         * 
         * @param {String} CUID
         * @returns {Array}
         */
        function addContextMembership(CUID) {
            if (typeof CUID === "string" && !(CUID in _contextMembership)) {
                _contextMembership[CUID] = [];
            }

            return _contextMembership[CUID];
        }

        /**
         * 
         * @param {String} CUID
         * @returns {null|Array}
         */
        function getContextMembership(CUID) {
            var contextMS = null;

            if (typeof CUID === "string" && CUID in _contextMembership) {
                contextMS = _contextMembership[CUID];
            }

            return contextMS;
        }

        /**
         * 
         * @param {Number} CUID
         * @returns {undefined}
         */
        function removeContextMembership(CUID) {
            if (typeof CUID === "string" && CUID in _contextMembership) {
                delete _contextMembership[CUID];
            }
        }

        /**
         * 
         * @param {String} EHUID
         * @returns {null|object}
         */
        function getContextForEventHandler(EHUID) {
            var context = null;

            if (EHUID && typeof EHUID === "string") {
                var CUID = _eventHandlerContext[EHUID];

                context = _uniqueObjectContainer.getElement(CUID);
            }

            return context;
        }

        function registerContext(context) {
            _uniqueObjectContainer.addElement(context);

            var CUID = _uniqueObjectContainer.getUID(context);
            var contextMS = addContextMembership(CUID);

            var events = _eventExtractor.extractEventHandler(context);
            events.forEach(function (event) {
                _uniqueObjectContainer.addElement(event.eventHandler);
                _uniqueObjectContainer.addElement(event.eventType);

                var EHUID = _uniqueObjectContainer.getUID(event.eventHandler);
                var ETUID = _uniqueObjectContainer.getUID(event.eventType);

                setEventHandlerContext(EHUID, CUID);
                setEventHandlerType(EHUID, ETUID);

                var eventTypeMS = getEventTypeMembership(ETUID);

                if (eventTypeMS === null) {
                    eventTypeMS = addEventTypeMembership(ETUID);
                }

                contextMS.push(EHUID);
                eventTypeMS.push(EHUID);
                setEventHandlerType(EHUID, ETUID);
            });
            
            _length++;
        }

        function unregisterContext(context) {
            var CUID = _uniqueObjectContainer.getUID(context);
            var contextMS = getContextMembership(CUID);

            if (contextMS !== null) {
                contextMS.forEach(function (EHUID) {
                    var ETUID = getEventHandlerType(EHUID);

                    var eventTypeMS = getEventTypeMembership(ETUID);

                    eventTypeMS.splice(eventTypeMS.indexOf(EHUID), 1);

                    if (eventTypeMS.length === 0) {
                        removeEventTypeMembership(ETUID);
                        _uniqueObjectContainer.removeElement(_uniqueObjectContainer.getElement(ETUID));
                    }

                    removeEventHandlerType(EHUID);
                    removeEventHandlerContext(EHUID);

                    _uniqueObjectContainer.removeElement(_uniqueObjectContainer.getElement(EHUID));
                });

                removeContextMembership(CUID);
            }

            _uniqueObjectContainer.removeElement(context);
            
            _length--;
        }

        /**
         * 
         * @param {object} context
         * @returns {undefined}
         */
        this.register = function (context) {
            if (!isRegistered(context)) {
                registerContext(context);
            }
        };

        /**
         * 
         * @param {object} context
         * @returns {undefined}
         */
        this.unregister = function (context) {
            if (isRegistered(context)) {
                unregisterContext(context);
            }
        };

        /**
         * 
         * @param {String} eventType
         * @param {object} data
         * @returns {undefined}
         */
        this.dispatchEvent = function (eventType, data) {
            if (eventType !== null && typeof eventType === "string") {
                var ETUID = _uniqueObjectContainer.getUID(eventType);
                var eventTypeMS = getEventTypeMembership(ETUID);

                if (eventTypeMS !== null) {
                    eventTypeMS.forEach(function (EHUID) {
                        var eventHandler = _uniqueObjectContainer.getElement(EHUID);
                        var context = getContextForEventHandler(EHUID);

                        if (eventHandler !== null) {
                            try {
                                eventHandler.call(context, data);
                            } catch (err) {
                                console.log(err);
                            }
                        }
                    });
                }
            }
        };

        /**
         * Returns <code>true</code>, if at least one context is
         * registered in this EventManager.
         * 
         * @returns {boolean}
         */
        this.hasMembers = function () {
            return _uniqueObjectContainer.getSize() > 0;
        };
        
        /**
         * 
         * @returns {Number}
         */
        this.getSize = function () {
            return _length;
        };
    }

    return EventManager;
})();

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
})();