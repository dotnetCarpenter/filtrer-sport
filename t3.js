"use strict"

const I = x => x
const Y = f => (g => g (g)) (g => f (x => g (g) (x)))

const pipe = (...fs) => x => fs.reduce ((x, f) => f (x), x)

//                case arguments
//            /-------------------\
const True  = trueCase => falseCase => trueCase
const False = trueCase => falseCase => falseCase
//            \________________________________/
//                     boolean encoding
// Scott encoding:
// Bool  = True | False
// True  = \x _ -> x
// False = \_ y -> y

// wrapped values (constructor args)
//           /----\
const Pair = x => y => access => access (x) (y)
//                     \_____________________/
//                          pair encoding
//           \-------------------------------/
//                     constructor
// Scott encoding:
// Pair x y = Fst | Snd
// Fst      = \x _ -> x
// Snd      = \_ y -> y
const numPair = Pair (5)    (9)
const strPair = Pair ("hi") ("bye")
var   fst     = x => _ => x
var   snd     = _ => y => y
console.debug (numPair (snd), // <- 9
               strPair (snd)) // <- bye

// Pair can also be derived from Bool
// Scott encoding:
// Pair x y    = Bool = True | False
// True  = Fst = \x _ -> x
// False = Snd = \_ y -> y
var fst        = True
var snd        = False
console.debug (numPair (snd), // <- 9
               strPair (snd)) // <- bye

//    Just :: a -> b -> (a -> c) -> c
const Just = x => handleNothing => handleSome => handleSome (x)
//    Nothing :: a -> (b -> c) -> a
const Nothing =   handleNothing => handleSome => handleNothing

const Maybe = x => x == null
    ? Nothing
    : Just (x)

const fmap = none => some => Functor => Functor (none) (some)

/* program */
const add1 = x => 1 + x
const defaultNothing = fmap ("It was nothing")
console.debug (
    defaultNothing (add1)
                   (Maybe (1)),

    defaultNothing (add1)
                   (Maybe ( )),
)

console.debug (pipe (add1, I, x => [x], Array.from)
                    (41))

const getItem = fmap (0) (add1)
const item1 = getItem (Maybe (1000))
const item2 = getItem (Maybe (null))
console.log (item1, item2)
