"use strict"

const I = x => x
const Y = f => (g => g (g)) (g => f (x => g (g) (x)))

const pipe = (...fs) => x => fs.reduce ((x, f) => f (x), x)

const Just = x => ({ fmap: f => Maybe (f (x)) })
const Nothing = { fmap: _ => Nothing }

const Maybe = x => x == null
    ? Nothing
    : Just (x)

const fmap = f => Functor => Functor.fmap (f)

//    maybe :: Functor F => (a -> F b) -> c -> F -> b | c
const maybe = f => y => Functor => {
    let x
    const fmapAndUnwrap = pipe (f, fmap (a => x = a))
    fmapAndUnwrap (Functor)
    return x ?? y
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
