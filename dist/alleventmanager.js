var AllEventManager = (function () {
    var
            /**
             * 
             * @type Boolean
             */
            DEBUG = false,
            /**
             * 
             * @type String
             */
            VERSION = "0.1",
            EventManager = (function () {
    var
            /**
             * 
             * @type String
             */
            SYSTEM = "AEB",
            /**
             * 
             * @type EventExtractor
             */
            EventExtractor = (function () {
    var
            /**
             * 
             * @type RegExp
             */
            STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg,
            /**
             * 
             * @type RegExp
             */
            ARGUMENT_NAMES = /([^\s,]+)/g;

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
})(),
            /**
             * 
             * @type UniqueKeyGen
             */
            UniqueKeyGen = (function () {
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
})(),
            /**
             * 
             * @type module.exports.EventExtractor
             */
            _eventExtractor = new EventExtractor(),
            /**
             * 
             * @type UniqueKeyGen
             */
            _uniqueKeyGen = new UniqueKeyGen();


    /**
     * 
     * @param {String} name
     * @returns {EventManager_L1.EventManager}
     */
    function EventManager(name) {
        this.name = name;

        /**
         * The list of all context objects of which the event handler are
         * registered. The index is the position of the CUID of the context and
         * the value is the context object.
         * 
         * @type Array the list of registered context objects.
         */
        var _context = [];

        /**
         * The list of all CUIDs. The index is the same as the index of its
         * context in the contexts array.
         * 
         * @type Array
         */
        var _CUID = [];

        /**
         * The list of all event handler.
         * @type Array
         */
        var _eventHandler = [];

        /**
         * The list of all EHUIDs. The index is the same as the index of its
         * event handler in the event handler array.
         * 
         * @type Array
         */
        var _EHUID = [];

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
            return _context.indexOf(context) !== -1;
        }

        /**
         * 
         * @param {String} EHUID
         * @param {String} eventType
         * @returns {undefined}
         */
        function setEventHandlerType(EHUID, eventType) {
            if (typeof EHUID === "string" && !(EHUID in _eventHandlerType)) {
                _eventHandlerType[EHUID] = eventType;
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
            if (typeof EHUID === "string" && !(EHUID in _eventHandlerType)) {
                _eventHandlerType[EHUID] = CUID;
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
                    && EHUID in _eventHandlerType) {
                delete _eventHandlerType[EHUID];
            }
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
         * @param {String} eventType
         * @returns {Array}
         */
        function addEventTypeMembership(eventType) {
            if (typeof eventType === "string" && !(eventType in _eventTypeMembership)) {
                _eventTypeMembership[eventType] = [];
            }
            
            return _eventTypeMembership[eventType];
        }

        /**
         * 
         * @param {String} eventType
         * @returns {null|Array}
         */
        function getEventTypeMembership(eventType) {
            var eventTypeMS = null;

            if (typeof eventType === "string" && eventType in _eventTypeMembership) {
                eventTypeMS = _eventTypeMembership[eventType];
            }

            return eventTypeMS;
        }

        /**
         * 
         * @param {String} eventType
         * @returns {undefined}
         */
        function removeEventTypeMembership(eventType) {
            if (eventType !== null && typeof eventType === "string"
                    && eventType in _eventTypeMembership) {
                delete _eventTypeMembership[eventType];
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
         * @param {function} eventHandler
         * @returns {String}
         */
        function addEventHandler(eventHandler) {
            var EHUID = _uniqueKeyGen.getUniqueKey();

            var contextIndex = _eventHandler.push(eventHandler) - 1;
            _EHUID[contextIndex] = EHUID;


            return EHUID;
        }

        /**
         * 
         * @param {String} EHUID
         * @returns {function}
         */
        function getEventHandler(EHUID) {
            var eventHandler = null;

            if (EHUID !== null && typeof EHUID === "string") {
                var index = _EHUID.indexOf(EHUID);

                if (index !== -1) {
                    eventHandler = _eventHandler[index];
                }
            }

            return eventHandler;
        }

        /**
         * 
         * @param {String} EHUID
         * @returns {undefined}
         */
        function removeEventHandler(EHUID) {
            if (typeof EHUID === "string") {
                var index = _EHUID.indexOf(EHUID);

                if (index !== -1) {
                    _eventHandler.splice(index, 1);
                    _EHUID.splice(index, 1);
                }
            }
        }

        /**
         * 
         * @param {object} context
         * @returns {null|String}
         */
        function getCUID(context) {
            var CUID = null;
            var index = _context.indexOf(context);

            if (index !== -1 && index in _CUID) {
                CUID = _CUID[index];
            }

            return CUID;
        }

        /**
         * 
         * @param {object} context
         * @returns {number}
         */
        function addContext(context) {
            var CUID = _uniqueKeyGen.getUniqueKey();

            var contextIndex = _context.push(context) - 1;
            _CUID[contextIndex] = CUID;

            return CUID;
        }

        /**
         * 
         * @param {onject} context
         * @returns {undefined}
         */
        function removeContext(context) {
            if (typeof context === "object") {
                var index = _context.indexOf(context);

                if (index !== -1) {
                    _context.splice(index, 1);
                    _CUID.splice(index, 1);
                }
            }
        }
        
        /**
         * 
         * @param {String} EHUID
         * @returns {null|object}
         */
        function getContextForEHUID(EHUID) {
            var context = null;
            
            if(EHUID && typeof EHUID === "string") {
                var CUID = _eventHandlerContext[EHUID];
                
                context = _context[_CUID.indexOf(CUID)];
            }
            
            return context;
        }

        /**
         * 
         * @param {object} context
         * @returns {undefined}
         */
        this.register = function (context) {
            if (!isRegistered(context)) {
                var CUID = addContext(context);
                var contextMS = addContextMembership(CUID);

                var events = _eventExtractor.extractEventHandler(context);
                events.forEach(function (event, index, array) {
                    var EHUID = addEventHandler(event.eventHandler);
                    var eventTypeMS = getEventTypeMembership(event.eventType);

                    if (eventTypeMS === null) {
                        eventTypeMS = addEventTypeMembership(event.eventType);
                    }

                    contextMS.push(EHUID);
                    setEventHandlerType(EHUID, event.eventType);
                    eventTypeMS.push(EHUID);
                });
            }
        };

        /**
         * 
         * @param {object} context
         * @returns {undefined}
         */
        this.unregister = function (context) {
            if (isRegistered(context)) {
                var CUID = getCUID(context);
                var contextMS = getContextMembership(CUID);

                if (contextMS !== null) {
                    contextMS.forEach(function (EHUID, index, array) {
                        var eventType = getEventHandlerType(EHUID);

                        if (eventType !== null) {
                            var eventTypeMS = getEventTypeMembership(eventType);

                            if (eventTypeMS !== null) {
                                eventTypeMS.splice(eventTypeMS.indexOf(EHUID), 1);

                                if (eventTypeMS.length === 0) {
                                    removeEventTypeMembership(eventType);
                                }
                            }

                            removeEventHandlerType(EHUID);
                        }

                        removeEventHandler(EHUID);
                    });

                    removeContextMembership(CUID);
                }

                removeContext(context);
            }
        };

        /**
         * 
         * @param {String} eventType
         * @param {object} data
         * @returns {undefined}
         */
        this.dispatchEvent = function (eventType, data) {
            if (DEBUG) {
                console.log("Dispatching event{" + eventType + "}");
            }
            if (DEBUG) {
                console.log("Event Type {" + eventType + "}");
            }

            if (eventType !== null && typeof eventType === "string") {
                var eventTypeMS = getEventTypeMembership(eventType);
                if (DEBUG) {
                    console.log("eventTypeMS{" + eventTypeMS + "}");
                }

                if (eventTypeMS !== null) {
                    eventTypeMS.forEach(function (EHUID, index, array) {
                        var eventHandler = getEventHandler(EHUID);
                        var context = getContextForEHUID(EHUID);
                        if (DEBUG) {
                            console.log("eventHandler{" + eventHandler + "}");
                        }

                        if (eventHandler !== null) {
                            try {
                                eventHandler.call(context, data);
                            } catch (err) {
                                console.log(err);
                            }
                        }
                    }, this);
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
            return _context.length > 0;
        };

        if (DEBUG) {
            /**
             * Prints debug information on console, if available.
             * 
             * @returns {undefined}
             */
            this.printDebugInfo = function () {
                console.log("Event Manager [" + this.name + "]");
                console.log("Printing Sources:");
                _context.forEach(function (context, index, array) {
                    console.log("[" + index + "]" + " => " + context.toString());
                });
                console.log("Printing CUIDs:");
                _CUID.forEach(function (CUID, index, array) {
                    console.log("[" + index + "]" + " => " + CUID);
                });
                console.log("Printing ETUIDs:");
                _EHUID.forEach(function (EHUID, index, array) {
                    console.log("[" + index + "]" + " => " + EHUID);
                });
                console.log("Printing Source Membership:");
                for (var key in _contextMembership) {
                    console.log("[" + key + "]" + " => " + _contextMembership[key]);
                }
                console.log("Printing Event Type Memberschip:");
                for (var key in _eventTypeMembership) {
                    console.log("[" + key + "]" + " => " + _eventTypeMembership[key]);
                }
                console.log("Printing Event Handler Memberschip:");
                for (var key in _eventHandlerType) {
                    console.log("[" + key + "]" + " => " + _eventHandlerType[key]);
                }
            };
        }
    }

    return EventManager;
})(),
            /**
             * 
             * @type EventManager_L1.EventManager
             */
            _eventManager = {};

    /**
     * 
     * @returns {EventManager_L1.AllEventBus}
     */
    function AllEventBus() {
        /**
         * 
         * @param {string} group
         * @param {object} context
         * @returns {undefined}
         */
        this.register = function (group, context) {
            if(!(group in _eventManager)) {
                _eventManager[group] = new EventManager(group);
            }
            
            _eventManager[group].register(context);
        };
        
        /**
         * 
         * @param {string} group
         * @param {object} context
         * @returns {undefined}
         */
        this.unregister = function (group, context) {
            if(group in _eventManager) {
                _eventManager[group].unregister(context);
                
                if(!_eventManager[group].hasMembers()) {
                    delete _eventManager[group];
                }
            }
        };
        
        /**
         * 
         * @param {string} group The group name of which event group the event
         * should be dispatched, or null if to dispatch in all groups (global)
         * @param {string} eventName
         * @param {object} data
         * @returns {undefined}
         */
        this.dispatchEvent = function(group, eventName, data) {
            if(group === null) {
                for(var groupName in _eventManager) {
                    if(_eventManager.hasOwnProperty(groupName)) {
                        _eventManager[groupName].dispatchEvent(eventName, data);
                    }
                }
            } else {
                if(group in _eventManager) {
                    _eventManager[group].dispatchEvent(eventName, data);
                }
            }
        };
        
        /**
         * 
         * @returns {undefined}
         */
        this.clear = function () {
            _eventManager = {};
        };
    }

    return new AllEventBus();
})();