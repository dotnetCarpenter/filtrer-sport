"use strict"

const { subtle } = globalThis.crypto

//  sportTopics :: Array<String>
const sportTopics = [
    "Amerikansk fodbold",
    "Atletik",
    "Badminton",
    "Basketball",
    "Boksning",
    "Champions League",
    "Conference League",
    "Cykling",
    "EM håndbold",
    "EM i håndbold",
    "Engelsk fodbold",
    "Europa League",
    "Fodbold",
    "Formel 1",
    "Golf",
    "Herrelandsholdet",
    "Herreligaen",
    "Hestesport",
    "Håndbold",
    "Ishockey",
    "Kort sport",
    "Kvindelandsholdet",
    "Kvindeligaen",
    "Motorsport",
    "Pokalturneringen",
    "PostNord Danmark Rundt",
    "Sejlsport",
    "Skisport",
    "Spansk fodbold",
    "Sport",
    "Superliga",
    "Svømning",
    "Tennis",
    "Tour de France",
    "Tysk fodbold",
    "VM herrer",
    "VM i håndbold",
]

//    uInt8ToString :: Uint8 -> String
const uInt8ToString = x => x.toString (16).padStart (2, 0)

//    convertToArray :: Type<TypedArray> a -> (a -> b) -> TypedArray<a> -> Array<b>
const convertToArray = ArrayType => map => buffer => (
    Array.from (new ArrayType (buffer), map)
)

//    arrayBufferToArrayString :: ArrayBuffer -> Array<String>
const arrayBufferToArrayString = convertToArray (Uint8Array)
                                                (uInt8ToString)

//    getHash :: String -> Promise<ArrayBuffer>
const getHash = s => subtle.digest ("SHA-256", new TextEncoder().encode (s))

// getHash (sportTopics.join (""))
//     .then (arrayBufferToString)
//     .then (x => x.join (""))
//     .then (console.log)

async function sha256 (string) {
    const buf = await crypto.subtle.digest ("SHA-256", new TextEncoder().encode (string))
    return Array.from (new Uint8Array(buf), x => x.toString(16).padStart (2, 0)).join ("")
}
// sha256 (sportTopics.join ("")).then (console.log)

Promise.all ([
            getHash (sportTopics.join ("")),
            sha256  (sportTopics.join ("")),
        ])
       .then (([buffer, hash2]) => {
            const hash1 = arrayBufferToArrayString (buffer).join ("")
            console.log ("hash1", hash1)
            console.log ("hash2", hash2)
            console.log (hash1 === hash2, "getHash and sha256 must return the same hash")
       });
