class UUID {
    constructor(X) {
        this.uInt8Array = new Uint8Array(16)

        // generate a new uuid
        if(!X){
            this.uInt8Array = this.v4()
        }
        // test X for uuid URN
        else if (typeof X === 'string' &&  this.testURN(X)) {
            this.uInt8Array = this.URNToUint8Array(X)
        }
        // test if X was proably supposed to be a uuid in some form
        else if (X.length >= 36){
            throw `'${X}' is not a valid UUID`
        }

        // generate uuid by specified version number
        else if (X.length <= 2) {
            switch (X) {
                case 4:
                    this.uInt8Array = this.v4()
                    break

                //add other versions...

                default:
                    this.uInt8Array = this.v4()
                    break
            }
        }
        __proto__.toString = function (){
            return this.URN
        }
    }
    toString(){
        return this.URN
    }
    // uuid parts (https://tools.ietf.org/html/rfc4122#section-4.1.2)
    get timeLow() { return this.uInt8Array.slice(0, 4) }
    get timeMid() { return this.uInt8Array.slice(4, 6) }
    get timeHighAndVersion() { return this.uInt8Array.slice(6, 8) }
    get clockSeqAndReserved() { return this.uInt8Array.slice(8, 9) }
    get clockSeqLow() { return this.uInt8Array.slice(9, 10) }
    get node() { return this.uInt8Array.slice(10, 16) }

    /* Uniform Resource Name
            based on the ABNF specification (https://tools.ietf.org/html/rfc4122)
            time-low "-" time-mid "-" time-high-and-version "-" clock-seq-and-reserved  clock-seq-low "-" node
    */
    get URN() {
        let urn = new String()
        return urn.concat(
            this.uInt8ArrayTohexArray(this.timeLow).join(''),
            `-`,
            this.uInt8ArrayTohexArray(this.timeMid).join(''),
            `-`,
            this.uInt8ArrayTohexArray(this.timeHighAndVersion).join(''),
            `-`,
            this.uInt8ArrayTohexArray([this.clockSeqAndReserved[0], this.clockSeqLow[0]]).join(''),
            `-`,
            this.uInt8ArrayTohexArray(this.node).join('')
        )

    }
    // the uuid version being used
    get version() {
        let octetInt = this.timeHighAndVersion[1]
        let octetBin = Number(octetInt).toString(2)
        while (octetBin.length < 8) {
            // add zeros to fix length
            octetBin = String(0).concat(octetBin)
        }
        let versionBinary = octetBin.slice(4, 8)
        let versionInt = parseInt(versionBinary, 2)
        return versionInt
    }

    // UUID Version 4 Generator (https://tools.ietf.org/html/rfc4122#section-4.4)
    v4() {
        /*
        4.4.  Algorithms for Creating a UUID from Truly Random or Pseudo-Random Numbers

            The version 4 UUID is meant for generating UUIDs from truly-random or
            pseudo-random numbers.

            The algorithm is as follows:

            o  Set the two most significant bits (bits 6 and 7) of the
               clock_seq_hi_and_reserved to zero and one, respectively.

            o  Set the four most significant bits (bits 12 through 15) of the
               time_hi_and_version field to the 4-bit version number from
               Section 4.1.3.

            o  Set all the other bits to randomly (or pseudo-randomly) chosen
               values.
        */
        let uuid = new Uint8Array(16)
        /*
            time-low
            in v4 its just 32 bits of random numbers.
        */
        uuid[0] = this.randomBitArray(8).join('').toString(10)
        uuid[1] = this.randomBitArray(8).join('').toString(10)
        uuid[2] = this.randomBitArray(8).join('').toString(10)
        uuid[3] = this.randomBitArray(8).join('').toString(10)

        /*
            time_mid
            in v4 its just 16 bits of random numbers.
        */
        uuid[4] = this.randomBitArray(8).join('').toString(10)
        uuid[5] = this.randomBitArray(8).join('').toString(10)

        /*
            time_hi_and_version
            this is a ticky part, becuase the documentation seems to disagree
            with itself about where to to place the 4 bit version information.
            in the section about versioning it say to use bits 4-7 (https://tools.ietf.org/html/rfc4122#section-4.1.3).
            in the v4 algorithm section it say to use bit 12-15 (https://tools.ietf.org/html/rfc4122#section-4.4).
            im going to follow the v4 algorithm instructions and make the last 4 bits '0100'
        */
        uuid[6] = this.randomBitArray(8).join('').toString(10)
        uuid[7] = this.randomBitArray(4).concat([0, 1, 0, 0]).join('').toString(10)

        /*
            clock-seq-and-reserved
            bits 6-7 need to be '01'. (https://tools.ietf.org/html/rfc4122#section-4.4)
            this is only 8 bits long.
        */
        uuid[8] = this.randomBitArray(6).concat([0, 1]).join('').toString(10)

        /*
            clock-seq-low
            random 8 bits
        */
        uuid[9] = this.randomBitArray(8).join('').toString(10)

        /*
            node
            in v4 this is random 48 bits
        */
        uuid[10] = this.randomBitArray(8).join('').toString(10)
        uuid[11] = this.randomBitArray(8).join('').toString(10)
        uuid[12] = this.randomBitArray(8).join('').toString(10)
        uuid[13] = this.randomBitArray(8).join('').toString(10)
        uuid[14] = this.randomBitArray(8).join('').toString(10)
        uuid[15] = this.randomBitArray(8).join('').toString(10)

        return uuid
    }

    // utils
    URNToUint8Array(U) {
        let hexArray = new Array(16)
        hexArray[0] = U.slice(0, 2)
        hexArray[1] = U.slice(2, 4)
        hexArray[2] = U.slice(4, 6)
        hexArray[3] = U.slice(6, 8)
        hexArray[4] = U.slice(9, 11)
        hexArray[5] = U.slice(11, 13)
        hexArray[6] = U.slice(14, 16)
        hexArray[7] = U.slice(16, 18)
        hexArray[8] = U.slice(19, 21)
        hexArray[9] = U.slice(21, 23)
        hexArray[10] = U.slice(24, 26)
        hexArray[11] = U.slice(26, 28)
        hexArray[12] = U.slice(28, 30)
        hexArray[13] = U.slice(30, 32)
        hexArray[14] = U.slice(32, 34)
        hexArray[15] = U.slice(34, 36)

        let uInt8Array = new Uint8Array(16)
        for (let i = 0; i < 16; i++) {
            uInt8Array[i] = parseInt(hexArray[i], 16)
        }
        return uInt8Array
    }
    testURN(U) {
        let hex = '[0-9abcdefABCDEF]'
        let urnRegex = RegExp(`^${hex}{8}-${hex}{4}-${hex}{4}-${hex}{4}-${hex}{12}$`,'g')
        let result = urnRegex.test(U)
        return result
    }
    randomBitArray(length) {
        let octets = new Array(length)

        for (let i = 0; i < length; i++) {
            // create a random number e.g. 0.14941616108708966
            let randomFloat = Math.random()

            // lets rounds the random float to be 1 or 0
            let binaryDigit = Math.round(randomFloat)

            // add the binary digit to our octet array
            octets[i] = binaryDigit
        }
        return octets
    }
    uInt8ArrayToBinArray(A) {
        let BinaryArray = new Array()
        for (let i of A) {
            let BinaryString = Number(i).toString(2)
            while (BinaryString.length < 8) {
                // add zeros to fix length
                BinaryString = String(0).concat(BinaryString)
            }
            BinaryArray.push(BinaryString)
        }
        return BinaryArray
    }
    uInt8ArrayTohexArray(A) {
        let BinaryArray = this.uInt8ArrayToBinArray(A)
        let HexryArray = new Array()
        for (let i of BinaryArray) {
            let HexString = parseInt(i, 2).toString(16)
            while (HexString.length < 2) {
                // add zeros to fix length
                HexString = String(0).concat(HexString)
            }
            HexryArray.push(HexString)
        }
        return HexryArray
    }

    get binaryArray() {
        return this.uInt8ArrayToBinArray(this.uInt8Array)
    }
    get binaryString() {
        return this.binaryArray.join('')
    }
    get hexadecimalArray(){
        return this.uInt8ArrayTohexArray(this.uInt8Array)
    }
    get hexadecimalString(){
        return this.uInt8ArrayTohexArray(this.uInt8Array).join('')
    }
}