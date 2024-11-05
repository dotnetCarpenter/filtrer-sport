//    I :: a -> a
const I = a => a

//    Maybe :: a -> Just<a> | Nothing
const Maybe = x => x == null
    ? Nothing
    : Just (x)

//    Just :: a -> Functor<a>
const Just = x => ({
    [Symbol.toStringTag]: `Just<${x}>`,
    fmap: f => Maybe (f (x)),
    join: () => x
})

//    Nothing :: Functor
const Nothing = {
    [Symbol.toStringTag]: `Nothing`,
    fmap: _ => Nothing,
    join: () => null
}

//    fmap :: (a -> b) -> Functor<a> -> Functor<b>
const fmap = f => Functor => Functor.fmap (f)

//    pipe :: Array<(a -> b)> -> a -> b
const pipe = (...fs) => a => fs.reduce ((b, f) => f (b), a)

export {
    I,
    Maybe,
    Just,
    Nothing,
    fmap,
    pipe,
}
