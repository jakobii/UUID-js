var uuid = require('./uuid.js');


id = new uuid('02ad4d2a-5fd6-8414-2d98-fd120b3e9052')


console.log(
    id.toString(),
    String(id),
    toString.call(id),
    id.URN,
    id.uInt8Array,
    id.binaryArray,
    id.binaryString,
    id.hexadecimalArray,
    id.hexadecimalString,
    id.testURN(id.URN),
    id.version,
)






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