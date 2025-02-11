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

const arrayStringToUIntArray = array => new TextEncoder().encode (array.join (";"))

const typedArrayToArray = typedArray => {
    const t = new TextDecoder
    return Array.from (t.decode (typedArray).split (";"))
}

/******************** TESTS ********************/
const equalArrayLeft = a1 => a2 => a1.every ((x, n) => x === a2[n])
const equalArrays = a1 => a2 => equalArrayLeft (a1) (a2) && equalArrayLeft (a2) (a1)

/******************** CONVERSION ********************/
// console.log (arrayStringToTypedArray ([1,2]))
console.log (arrayStringToUIntArray (sportTopics))
console.log (typedArrayToArray(arrayStringToUIntArray (sportTopics)))
console.log (equalArrays (typedArrayToArray(arrayStringToUIntArray (sportTopics)))
                         (sportTopics), "The original array and the encoded/decoded array should be equal")
