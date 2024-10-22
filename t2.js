"use strict"

class Just {
    #x
    constructor (x) { this.#x = x }

    fmap (f) { return Maybe (f (this.#x)) }

    get [Symbol.toStringTag] () {
        return `${this.#x}`
    }
}
class Nothing {
    fmap (_) { return this }
}

const Maybe = x => x == null
    ? new Nothing
    : new Just (x)

const fmap = f => Functor => Functor.fmap (f)

const maybe = y => Functor => {
    switch (Functor.constructor) {
        case Just:
            let x
            Functor.fmap (a => x = a)
            return x

        case Nothing: return y

        default: throw "Not implemented"
    }
}

const add1 = x => 1 + x
const defaultNothing = maybe ("It was nothing")
console.log (
    fmap (add1) (Maybe (1)),
    fmap (add1) (Maybe ( )))

console.log (
    defaultNothing (fmap (add1) (Maybe (1))),
    defaultNothing (fmap (add1) (Maybe ( ))))


// const Y = f => (g => g (g)) (g => f (x => g (g) (x)))

// const fooBar = f => nullish => something => {
//     return fmap (f)

//     switch (f ().constructor) {
//         case Just: return Functor.fmap ()
//     }
// }

// const getItem = fooBar (Maybe (() => null)) ("Nothing happen") (x => x + 1)
// console.log (getItem)
