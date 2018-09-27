# UUID-js
[RFC 4122](https://tools.ietf.org/html/rfc4122) UUID for Javascript.





Create a new UUID object.
```js
let uuid = new UUID()
console.log(
    uuid.URN, // Uniform Resource Name (e.g. ae4cea8b-8ba3-1514-35af-00de329d27ed)
    uuid.uInt8Array,
    uuid.binaryArray,
    uuid.binaryString,
    uuid.hexadecimalArray,
    uuid.hexadecimalString,
    uuid.testURN(uuid.URN),
    uuid.version,
)
```


Create a UUID object from a Uniform Resource Name string. *they are not case sensitive.*
```js
let uuid = new UUID('ae4cea8b-8ba3-1514-35af-00de329d27ed')
console.log(
    uuid.URN,
    uuid.uInt8Array,
    uuid.version,
)
```


The __toSting()__ method will return a Uniform Resource Name. Here are some common toSting() examples.
```js
let uuid = new UUID('ae4cea8b-8ba3-1514-35af-00de329d27ed')
console.log(
    uuid.toString(),     //explicit toString methods
    toString.call(uuid),
    new String(uuid),    //convert to type string
    uuid + ''            // concat uuid to a string
)
```