module.exports = function () {
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
};