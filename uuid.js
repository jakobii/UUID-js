
/*
    of course read the spec for the most accurate information/terminology (https://tools.ietf.org/html/rfc4122).
    this is just to help people wrap their head around what uuids are. this is not an efficient method of generating them.
    to create a uuid correctly there are some rules to follow, but first you have to choose a uuid version.
    all version garentee uniqueness, so you can think of the different "versions" just as different "algorithms" for generating valid uniqiue ids.
    in this exemple we will use version 4 because the algorithm is easy to achieve in JS.
    simply put, a uuid is just a really big number that is created with enough random stuff to make it unique.

    example of a uuid:
        hex: f81d4fae7dec11d0a76500a0c91e6bf6
        dec: 329800735698586629295641978511506172918
        bin: 11111000000111010100111110101110011111011110110000010001110100001010011101100101000000001010000011001001000111100110101111110110

    when representing a uuid as a string the spec say to represent it as a hexidecimal and to put dashes in it lik this:
        uuid string: f81d4fae-7dec-11d0-a765-00a0c91e6bf6

    the hypens in the string representation of the uuid are there to seperate significant parts.
    the size of each part is defined in the spec (https://tools.ietf.org/html/rfc4122#section-4.1.2).
    here are the different parts:
        time-low "-" time-mid "-" time-high-and-version "-" clock-seq-and-reserved  clock-seq-low "-" node

    when using version 4, all parts can be random generated and no longer need to be represented by time.
    here is what the spec say about version 4:

        timestamp:
            (https://tools.ietf.org/html/rfc4122#section-4.1.4)
            For UUID version 4, the timestamp is a randomly or pseudo-randomly
            generated 60-bit value, as described in Section 4.4.

        clock sequence:
            (https://tools.ietf.org/html/rfc4122#section-4.1.5)
            For UUID version 4, clock sequence is a randomly or pseudo-randomly
            generated 14-bit value as described in Section 4.4.

        node:
            (https://tools.ietf.org/html/rfc4122#section-4.1.6)
            For UUID version 4, the node field is a randomly or pseudo-randomly
            generated 48-bit value as described in Section 4.4.


    the spec also mention that the uuid should contain the uuid version number. 
    4 bits are allocated for specifying the version number. 
    uuid version 4 is just the number 4 in binary. (e.g. 0100)

        version number:
            (https://tools.ietf.org/html/rfc4122#section-4.1.3)
            The version number is in the most significant 4 bits of the time
            stamp (bits 4 through 7 of the time_hi_and_version field).




    here are the Algorithm instruction we will follow:
    (https://tools.ietf.org/html/rfc4122#section-4.4)

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



/*
var a = new Uint8Array(16)
window.crypto.getRandomValues(a)
*/

class uuid {
    constructor(X) {
        this.uInt8Array = new Uint8Array(16)
        if (this.testURN(X)) {
            this.parseURN(X)
        }
        else {
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

    // UUID Version Generator (https://tools.ietf.org/html/rfc4122#section-4.4)
    v4() {
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

    parseURN(U) {
        let hexArray = new Array()
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
        hexArray[10] = U.slice(23, 25)
        hexArray[11] = U.slice(25, 27)
        hexArray[12] = U.slice(27, 29)
        hexArray[13] = U.slice(29, 31)
        hexArray[14] = U.slice(31, 33)
        hexArray[15] = U.slice(33, 35)
        for (let i = 0; i < 16; i++) {
            this.uInt8Array[i] = parseInt(hexArray[i], 16)
        }
    }
    testURN(U) {
        let urnRegex = /[0-9abcdefABCDEF]{8,}-[0-9abcdefABCDEF]{4,}-[0-9abcdefABCDEF]{4,}-[0-9abcdefABCDEF]{4,}-[0-9abcdefABCDEF]{12,}/g
        if (urnRegex.exec(U)) {
            return true
        }
        else {
            return false
        }
    }
    randomBitArray(length) {
        let octet = new Array(length)

        for (let i = 0; i < length; i++) {
            // create a random number e.g. 0.14941616108708966
            let randomFloat = Math.random()

            // lets rounds the random float to be 1 or 0
            let binaryDigit = Math.round(randomFloat)

            // add the binary digit to our octet array
            octet[i] = binaryDigit
        }
        return octet
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