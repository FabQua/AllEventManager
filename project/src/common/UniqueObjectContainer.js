module.exports = function () {
    /**
     * 
     * @type UniqueKeyGen
     */
    var UniqueKeyGen = (require("project/src/common/UniqueKeyGen.js"))();
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
};