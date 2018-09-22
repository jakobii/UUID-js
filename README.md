# uuid-js
[RFC 4122](https://tools.ietf.org/html/rfc4122) UUID for Javascript.





Create a new UUID object.
```js
id = new uuid()
console.log(
    id.URN,
    id.uInt8Array,
    id.binaryArray,
    id.binaryString,
    id.hexadecimalArray,
    id.hexadecimalString,
    id.testURN(id.URN),
    id.version,
)
```


Create a UUID object from an existing UUID string.
```js
id = new uuid(`ae4cea8b-8ba3-1514-35af-00de329d27ed`)
console.log(
    id.URN,
    id.uInt8Array,
    id.binaryArray,
    id.binaryString,
    id.hexadecimalArray,
    id.hexadecimalString,
    id.testURN(id.URN),
    id.version,
)
```

