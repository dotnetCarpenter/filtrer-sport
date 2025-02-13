"use strict"

;(function (global) {
    /********************** FUNCTORS **********************/

    //    Just :: a -> Functor<a>
    const Just = x => ({ fmap: f => Maybe (f (x)) })

    //    Nothing :: Functor
    const Nothing = { fmap: () => Nothing }

    //    Maybe :: a -> Just<a> | Nothing
    const Maybe = x => x == null
        ? Nothing
        : Just (x)

    // Array<a>.fmap :: Array<a> ~> (a -> b) -> Functor<b>
    Array.prototype.fmap = function (f) { return this.map (f) }

    /********************** UTILITY FUNCTIONS **********************/

    //    fmap :: (a -> b) -> Functor<a> -> Functor<b>
    const fmap = f => Functor => Functor.fmap (f)

    //    maybe :: (a -> Functor<b>) -> c -> a -> b | c
    const maybe = f => c => a => {
        let b

        pipe (f, fmap (x => b = x))
             (a)

        return b ?? c
    }

    //    pipe :: Array<(a -> b)> -> a -> b
    const pipe = (...fs) => a => fs.reduce ((b, f) => f (b), a)

    //    map :: (a -> b) -> Array<a> -> Array<b>
    const map = f => array => array.map (f)

    //    filter :: (a -> Boolean) -> Array<a> -> Array<a>
    const filter = f => array => array.filter (f)

    const FP = {
        Just,
        Maybe,
        Nothing,
        filter,
        fmap,
        map,
        maybe,
        pipe,
    }
    global.filtrerSport = global.filtrerSport || {}
    global.filtrerSport.FP = FP
} (globalThis))
