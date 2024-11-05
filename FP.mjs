//    I :: a -> a
const I = a => a

//    Maybe :: a -> Just<a> | Nothing
const Maybe = x => x == null
    ? Nothing
    : Just (x)

//    Just :: a -> Functor<a>
const Just = x => ({
    [Symbol.toStringTag]: `Just <${x}>`,
    fmap: f => Maybe (f (x)),
    [Symbol.for ("join")]: () => x instanceof Object && "fmap" in x
        ? x
        : Maybe (x),
    chain: f => pipe (join, fmap (f))
})

//    Nothing :: Functor
const Nothing = {
    [Symbol.toStringTag]: `Nothing`,
    fmap: () => Nothing,
    [Symbol.for ("join")]: () => Nothing,
    chain: () => Nothing,
}

//    fmap :: (a -> b) -> Functor<a> -> Functor<b>
const fmap = f => Functor => Functor.fmap (f)

//    join :: Functor f => f<f<a>> -> f<a>
const join = f => f[Symbol.for ("join")] ()

//    pipe :: (a -> b) -> a -> b
const pipe = (...fs) => a => fs.reduce ((b, f) => f (b), a)

export {
    fmap,
    I,
    join,
    Just,
    Maybe,
    Nothing,
    pipe,
}
