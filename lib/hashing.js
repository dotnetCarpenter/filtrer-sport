"use strict"

;(function (global) {
    const getHash = algo => async function (string) {
        const buffer = await crypto.subtle.digest (algo, new TextEncoder().encode (string))
        return Uint8Array.prototype.toHex
            ? new Uint8Array(buffer).toHex ()
            : Array.from (new Uint8Array(buffer),
                          x => x.toString(16).padStart (2, 0)).join ("")
    }

    const sha1   = getHash ("SHA-1")
    const sha256 = getHash ("SHA-256")
    const sha384 = getHash ("SHA-384")
    const sha512 = getHash ("SHA-512")

    global.filtrerSport = global.filtrerSport || {}
    global.filtrerSport.hashing = {
        sha1,
        sha256,
        sha384,
        sha512,
    }
} (globalThis))
