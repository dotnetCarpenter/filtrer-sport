"use strict"

const I = x => x
const Y = f => (g => g (g)) (g => f (x => g (g) (x)))

const Just2 = x => ({ fmap: f => Maybe (f (x)) })
const Nothing2 = _ => ({ fmap: _ => Maybe () })

// class Just {
//     #x
//     constructor (x) {
//         console.debug ("Just::constructor", x)
//         this.#x = x
//     }
//     fmap (f) {
//         console.debug ("Just::fmap", this.#x)
//         return Maybe (f (this.#x))
//     }

//     toString () { return `Just (${this.#x})` }
//     inspect () { return this.toString () }
// }
// class Nothing {
//     fmap (_) {
//         return this
//     }

//     toString () { return `Nothing ()` }
//     inspect () { return this.toString () }
// }

const Maybe   = x => x == null
    ? Nothing2 ()
    : Just2 (x)

const fmap = f => Functor => Functor.fmap (f)
const maybe = Functor => {
    let x
    fmap (y => { x = y})
         (Functor)
    return x
}

console.log (
    maybe (fmap (x => 1 + x) (Maybe (1))),
    maybe (fmap (x => 1 + x) (Maybe ())),
)
// const getItem = unwrap (() => null) ("Nothing happen") (x => x + 1)

// console.log (getItem)
