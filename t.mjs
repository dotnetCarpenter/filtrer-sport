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

// Apparently firefox (133) and safari (18.2) supports toHex on Uint8Array
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array/toHex
console.debug ("is Uint8Array.toHex supported?", !!Uint8Array.prototype.toHex)

async function sha256 (string) {
    const buffer = await crypto.subtle.digest ("SHA-256", new TextEncoder().encode (string))
    return Uint8Array.prototype.toHex
        ? new Uint8Array(buffer).toHex ()
        : Array.from (new Uint8Array(buffer), x => x.toString(16).padStart (2, 0)).join ("")
}

const hash = await sha256 (sportTopics.join (""))
console.log (hash)
