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

const arrayStringToUInt8Array = array => new TextEncoder().encode (array.join (";"))

const typedArrayToArray = typedArray  => new TextDecoder().decode (typedArray).split (";")

/******************** TESTS ********************/
const equalArrayLeft = a1 => a2 => a1.every ((x, n) => x === a2[n])
const equalArrays = a1 => a2 => equalArrayLeft (a1) (a2) && equalArrayLeft (a2) (a1)
const trace = x => (console.log (x), x)

/******************** CONVERSION ********************/
// console.log (arrayStringToUInt8Array ([1,2]))
// console.log (arrayStringToUInt8Array (sportTopics))
// console.log (typedArrayToArray(arrayStringToUInt8Array (sportTopics)))
// console.log (equalArrays (typedArrayToArray(arrayStringToUInt8Array (sportTopics)))
//                          (sportTopics), "The original array and the encoded/decoded array should be equal")

/******************** HASHING ********************/
subtle.digest ("SHA-256", new TextEncoder().encode (sportTopics.join ("")))
      .then   (trace)
      .then   (x => new Uint8Array (x))
      .then   (trace)
      .then   (typedArray => {
        console.log ("typedArray.map", typedArray.map (trace))
        console.log ("Array.prototype.map.call", Array.prototype.map.call (typedArray, trace))
      })
    //   .then   (x => Array.prototype.map.call (x, x => (('00' + x.toString (16)).slice (-2))))
    //   .then   (trace)
    //   .then   (x => x.join (""))
    //   .then   (trace)
    //   .then   (x => new TextDecoder().decode (x))
    //   .then   (trace)
    //   .then   (buffer => new Uint8Array (buffer))
    //   .then   (trace)
    //   .then   (x => new TextDecoder ().decode (x.buffer))
    //   .then   (x => new Uint8Array (x).toString ())
    //   .then   (text => text.map (x => (('00' + x.toString (16)).slice (-2))))
    //   .then   (trace)
    //   .then   (buffer => new DataView (buffer))
    //   .then   (trace)

async function sha256(str) {
    const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(str));
    console.log (buf)
    const uint8Array = new Uint8Array(buf)
    console.log (uint8Array)
    return Array.prototype.map.call(uint8Array, x => (('00'+x.toString(16)).slice(-2)));
}
// console.log ("sha256")
// sha256 (sportTopics.join (";")).then (console.log.bind (console, "sha256"))
