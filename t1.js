"use strict"

const I = x => x
const Y = f => (g => g (g)) (g => f (x => g (g) (x)))

const pipe = (...fs) => x => fs.reduce ((x, f) => f (x), x)

const fmap = f => Functor => Functor.fmap (f)

const Just = x => ({ fmap: f => Maybe (f (x)) })
const Nothing = { fmap: _ => Nothing }

const Maybe = x => x == null
    ? Nothing
    : Just (x)

//    maybe :: (a -> Functor<b>) -> c -> a -> b | c
const maybe = f => c => a => {
    let b

    pipe (f, fmap (x => b = x))
         (a)

    return b ?? c
}

/* program */
const defaultNothing = maybe (I) ("It was nothing")
const add1 = x => 1 + x
console.log (
    defaultNothing (fmap (add1) (Maybe (1))),
    defaultNothing (fmap (add1) (Maybe ( ))),
)

console.debug (pipe (add1, I, x => [x], Array.from)
                    (41))

const getItem = maybe (fmap (add1)) (0)
const item1 = getItem (Maybe (1000))
const item2 = getItem (Maybe (null))
console.log (item1, item2)
