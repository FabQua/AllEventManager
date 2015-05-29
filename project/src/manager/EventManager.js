module.exports = function () {
    /**
     * 
     * @type EventExtractor
     */
    var EventExtractor = (require("project/src/event/EventExtractor.js"))();
    /**
     * 
     * @type ObjectContainer
     */
    var ObjectContainer = (require("project/src/common/ObjectContainer.js"))();
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
         * @type ObjectContainer
         */
        var _objectContainer = new ObjectContainer();

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
            return _objectContainer.containsElement(context);
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

                context = _objectContainer.getElement(CUID);
            }

            return context;
        }

        function registerContext(context) {
            var CUID = _objectContainer.addElement(context);
            var contextMS = addContextMembership(CUID);

            var events = _eventExtractor.extractEventHandler(context);
            events.forEach(function (event) {
                var ETUID = _objectContainer.getUID(event.eventType);
                
                if(ETUID === null) {
                    ETUID = _objectContainer.addElement(event.eventType);
                }
                
                var EHUID = _objectContainer.addElement(event.eventHandler);

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
            var CUID = _objectContainer.getUID(context);
            var contextMS = getContextMembership(CUID);

            if (contextMS !== null) {
                contextMS.forEach(function (EHUID) {
                    var ETUID = getEventHandlerType(EHUID);

                    var eventTypeMS = getEventTypeMembership(ETUID);

                    eventTypeMS.splice(eventTypeMS.indexOf(EHUID), 1);

                    if (eventTypeMS.length === 0) {
                        removeEventTypeMembership(ETUID);
                        _objectContainer.removeElement(ETUID);
                    }

                    removeEventHandlerType(EHUID);
                    removeEventHandlerContext(EHUID);

                    _objectContainer.removeElement(EHUID);
                });

                removeContextMembership(CUID);
            }

            _objectContainer.removeElement(CUID);
            
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
                var ETUID = _objectContainer.getUID(eventType);
                var eventTypeMS = getEventTypeMembership(ETUID);

                if (eventTypeMS !== null) {
                    eventTypeMS.forEach(function (EHUID) {
                        var eventHandler = _objectContainer.getElement(EHUID);
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
            return _objectContainer.getSize() > 0;
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
};