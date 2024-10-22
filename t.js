"use strict"

const I = x => x
const Y = f => (g => g (g)) (g => f (x => g (g) (x)))

const Just = x => ({ fmap: f => Maybe (f (x)) })
const Nothing = _ => ({ fmap: _ => Nothing () })

const Maybe   = x => x == null
    ? Nothing ()
    : Just (x)

const fmap = f => Functor => Functor.fmap (f)

const maybe = y => Functor => {
    let x

    fmap (a => x = a)
         (Functor)

    return x ?? y
}

const defaultNothing = maybe ("It was nothing")
console.log (
    defaultNothing (fmap (x => 1 + x) (Maybe (1))),
    defaultNothing (fmap (x => 1 + x) (Maybe ())),
)


// const getItem = fooBar (() => null) ("Nothing happen") (x => x + 1)
// console.log (getItem)
