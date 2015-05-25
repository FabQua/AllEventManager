(function () {
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

    describe("UniqueKeyGen", function () {
        /**
         * 
         * @type UniqueKeyGen
         */
        var keygen;

        beforeEach(function () {
            keygen = new UniqueKeyGen();
        });
        
        it("should return a key", function () {
            expect(keygen.getUniqueKey()).not.toBeNull();
        });

        it("should never return the same key", function () {
            var currentKey = keygen.getUniqueKey();
            
            for(var i = 0; i < 1000; i++) {
                var nextKey = keygen.getUniqueKey();
                expect(currentKey).not.toBe(nextKey);
                
                currentKey = nextKey;
            }
        });
        
        it("should create exact this first values", function() {
            var firstKeys = [
                "00",
                "01",
                "02",
                "03",
                "04",
                "05",
                "06",
                "07",
                "08",
                "09",
                "0a",
                "0b",
                "0c",
                "0d",
                "0e",
                "0f",
                "010"
            ];
            
            expect(keygen.getUniqueKey()).toBe(firstKeys[0]);
            expect(keygen.getUniqueKey()).toBe(firstKeys[1]);
            expect(keygen.getUniqueKey()).toBe(firstKeys[2]);
            expect(keygen.getUniqueKey()).toBe(firstKeys[3]);
            expect(keygen.getUniqueKey()).toBe(firstKeys[4]);
            expect(keygen.getUniqueKey()).toBe(firstKeys[5]);
            expect(keygen.getUniqueKey()).toBe(firstKeys[6]);
            expect(keygen.getUniqueKey()).toBe(firstKeys[7]);
            expect(keygen.getUniqueKey()).toBe(firstKeys[8]);
            expect(keygen.getUniqueKey()).toBe(firstKeys[9]);
            expect(keygen.getUniqueKey()).toBe(firstKeys[10]);
            expect(keygen.getUniqueKey()).toBe(firstKeys[11]);
            expect(keygen.getUniqueKey()).toBe(firstKeys[12]);
            expect(keygen.getUniqueKey()).toBe(firstKeys[13]);
            expect(keygen.getUniqueKey()).toBe(firstKeys[14]);
            expect(keygen.getUniqueKey()).toBe(firstKeys[15]);
            expect(keygen.getUniqueKey()).toBe(firstKeys[16]);
        });
    });
})();