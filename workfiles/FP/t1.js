"use strict"

const create = Object.create (Function, {

})

function Functor () {}
function Maybe () {}
Maybe.prototype = new Functor
function Nothing () {}
Nothing.prototype = new Maybe
// Nothing.prototype[Symbol.hasInstance] = () => Nothing
const foo = new Nothing ()

// const matching = value => {
//     let description = ""
//     switch (value.constructor) {
//         case Nothing: description = "Nothing"; break
//         case Maybe: description = "Maybe"; break
//         case Functor: description = "Functor"; break

//         default: description = "Not found"
//     }
//     return description
// }
// console.debug (
//     matching (new Nothing),
//     matching (new Maybe),
//     matching (new Functor),
// )

const is = Type => value => value instanceof Type

console.debug (
    is (Nothing)
       (foo),
    is (Maybe)
       (foo),
    is (Functor)
       (foo),
)

console.debug (
    is (Nothing)
       (new Functor),
    is (Maybe)
       (new Functor),
    is (Functor)
       (new Functor),
)
