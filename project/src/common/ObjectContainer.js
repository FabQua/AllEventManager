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
     * @returns {ObjectContainer}
     */
    function ObjectContainer() {

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
         * @param {mixed} element the element to add.
         * @returns {string} the UID for the added element.
         */
        this.addElement = function (element) {
            var UID = _UNIQUEKEYGEN.getUniqueKey();
            
            _elements.push(element);
            _UIDs.push(UID);
            
            return UID;
        };

        /**
         * 
         * @param {mixed} UID
         * @returns {undefined}
         */
        this.removeElement = function (UID) {
            var index = _UIDs.indexOf(UID);

            if (index !== -1) {
                _elements.splice(index, 1);
                _UIDs.splice(index, 1);
            }
        };

        /**
         * Returns <code>false</code>, if there is no element in this
         * ObjectContainer, else <code>false</code>.
         * 
         * @returns {boolean}
         */
        this.isEmpty = function () {
            return _elements.length === 0;
        };

        /**
         * Returns the number ob elements in this ObjectContainer.
         * @returns {Number} the element count.
         */
        this.getSize = function () {
            return _elements.length;
        };

        /**
         * Returns <code>true</code> if there is an element with the UID in
         * this ObjectContainer.
         * @param {string} UID
         * @returns {boolean} <code>true</code> if the element is in this
         * container, else <code>false</code>.
         */
        this.contains = function (UID) {
            return _UIDs.indexOf(UID) !== -1;
        };
        
        /**
         * Returns <code>true</code> as long as the element is at least one
         * time in this ObjectContainer, else <code>false</code>.
         * 
         * @param {mixed} element
         * @returns {boolean} <code>true</code> if the element is in this
         * container, else <code>false</code>.
         */
        this.containsElement = function (element) {
            return _elements.indexOf(element) !== -1;
        };
        
        /**
         * Returns the first UID of the element. Since the element can be
         * present multiple times in this ObjectContainer, it could be not
         * the UID you expected. The safe way is using the UID returned by
         * addElement.
         * 
         * @param {mixed} element the element to search for.
         * @returns {null|string} the first <code>UID</code> if the element
         * is present, else <code>false</code>
         */
        this.getUID = function (element) {
            var UID = null;
            var index = _elements.indexOf(element);
            
            if(index !== -1) {
                UID = _UIDs[index];
            }
            
            return UID;
        };
    }

    return ObjectContainer;
};