module.exports = function () {
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
};