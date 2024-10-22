"use strict"

class Just {
    #x
    constructor (x) { this.#x = x }

    fmap (f) { return Maybe (f (this.#x)) }

    get [Symbol.toStringTag] () {
        return this.#x
    }
}
class Nothing {
    fmap (_) { return this }
}

const I = x => x

const Maybe = x => x == null
    ? new Nothing
    : new Just (x)

const fmap = f => Functor => Functor.fmap (f)

//    maybe :: Functor F => (a -> F b) -> c -> F a -> b | c
const maybe = f => y => Functor => {
    switch (Functor.constructor) {
        case Just:
            let x
            f (Functor).fmap (a => x = a)
            return x

        case Nothing: return y

        default: throw "Not implemented"
    }
}

const add1 = x => 1 + x
const defaultNothing = maybe (I) ("It was nothing")
console.log (
    fmap (add1) (Maybe (1)),
    fmap (add1) (Maybe ( )))

console.log (
    defaultNothing (fmap (add1) (Maybe (1))),
    defaultNothing (fmap (add1) (Maybe ( ))))


const getItem = maybe (fmap (add1)) (0)
const item1 = getItem (Maybe (1000))
const item2 = getItem (Maybe (null))
console.log (item1, item2)

