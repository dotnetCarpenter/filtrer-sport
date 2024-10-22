const Y = f => (g => g (g)) (g => f (x => g (g) (x)))

const Nothing =      nothing => just => nothing
const Just    = x => nothing => just => just (x)

const fmap = f => value => f (value) == null
    ? Nothing
    : Just (value)

const getItem = fmap (() => null) ("Nothing happen") (x => x + 1)

console.log (getItem)
