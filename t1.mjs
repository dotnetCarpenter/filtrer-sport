"use strict"

import { Maybe, fmap, I, pipe } from "./FP.mjs"

const Y = f => (g => g (g)) (g => f (x => g (g) (x)))
const B  = f => g => x => f (g (x))

//    map :: (a -> b) -> Array<a> -> Array<b>
const map = f => array => array.map (f)

//    Pair :: Functor Pair => a -> b -> Pair<a,b>
const Pair = a => b => ({
    fmap: f => "fmap" in b
        ? Pair (a)
               (b.fmap (f))
        : Pair (a)
               (f (b)),
    fst: () => a,
    snd: () => b,
    join: () => b,
})
//    fst :: Pair<a,b> -> a
const fst = pair => pair.fst ()
//    snd :: Pair<a,b> -> b
const snd = pair => pair.snd ()

//    maybe :: Monad f => (a -> f<b>) -> c -> a -> b | c
const maybe = f => c => a => pipe (f, a.join)
                                  (a)
                             ?? c

/* program */
const defaultNothing = maybe (I) ("It was nothing")
const add1 = x => 1 + x
console.debug (
    defaultNothing (fmap (add1) (Maybe (1))),
    defaultNothing (fmap (add1) (Maybe ( ))),
)

console.debug (pipe (add1, I, x => [x], Array.from)
                    (41))

const getItem = maybe (add1) (0)
const item1 = getItem (Maybe (1000))
const item2 = getItem (Maybe (null))
console.debug (item1, item2)

const doFoo = pipe (
    fmap (map (add1)),
    snd)
const left = Pair ("Not this")
console.debug (
    doFoo (left ([0,1,2])))

const getArray = maybe (I)
                       ("Ah, it was null")
console.debug (
    getArray (doFoo (left (Maybe ([41])))))

console.debug (
    getArray (doFoo (left (Maybe (null)))))

console.debug (
    maybe (I) (new Error ("Shouldn't happen")) (Pair (false) (true))
)
