import test from "node:test"
import assert from "node:assert"
import { Nothing, Just, Maybe, fmap, I, pipe, join } from "./FP.mjs"

const concat = a => b => a.concat (b)
const flip = f => a => b => f (b) (a)
const append = flip (concat)

test ("Data types", () => {
    const pattern = type => {
        switch (type.constructor) {
            case Nothing:
                assert.ok (true, "is not a Nothing")
                break
            case Just: assert.ok (true, "is not a Just")
            default: assert.fail (`${type} is not a matched data type`)
        }
    }

    const nothing = Maybe (null)
    const one = Maybe (1)
    pattern (nothing)
    pattern (one)
})

test ("Functions", () => {
    assert.strictEqual (
        append (" world") ("Hello"),
        "Hello world")
})

test ("Maybe", async t => {
    const string  = Maybe ("Goodbye")
    const nothing = Maybe (null)
    const numbers = Maybe ([1, 2, 3])
    const strings = Maybe (["foo", "bar"])

    await t.test ("Functor identity", t => {
        const identityLaw1 = fmap (I)
        const identityLaw2 = I

        const functorIdentityAssertion = Functor => {
            assert.deepStrictEqual (
                identityLaw1 (Functor).toString (),
                identityLaw2 (Functor).toString (),
                "fmap (id) === id")
        }

        ([string,
          nothing,
          numbers,
          strings]).forEach (functorIdentityAssertion)

    })

    await t.test ("Functor composition", t => {
        const compositionLaw1 = pipe (
            fmap (append (" cruel")),
            fmap (append (" world")))

        const compositionLaw2 = fmap (pipe (
            append (" cruel"),
            append (" world")))

        const functorCompositionAssertion = Functor => {
            assert.deepStrictEqual (
                compositionLaw1 (Functor).toString (),
                compositionLaw2 (Functor).toString (),
                "pipe (fmap (f), fmap (g)) === fmap (pipe (f, g))")
        }

        ([string,
          nothing,
          numbers,
          strings]).forEach (functorCompositionAssertion)
    })

    await t.test ("Monad associativity", t => {
        const associativeLaw1      = pipe (join, join)
        const associativeLaw2      = pipe (fmap (join), join)
        const callJoinOnInnerValue = pipe (join, fmap (join))

        const monads = fmap (Maybe) ([string,
                                      nothing,
                                      numbers,
                                      strings])

        const monadAssciativeAssertion = mma => {
            assert.deepStrictEqual (
                associativeLaw1 (mma).toString (),
                associativeLaw2 (mma).toString (),
                "pipe (join, join) === pipe (fmap (join), join)")
        }

        monads.forEach (monadAssciativeAssertion)

        const throwIfJoinIsCalledOnNonMonad = mma => {
            assert.throws (
                callJoinOnInnerValue.bind (null, mma),
                TypeError,
                `pipe (join, fmap (join)) will call join on a contained value ${mma}`)
        }

        ([string,
          numbers,
          strings]).forEach (throwIfJoinIsCalledOnNonMonad)

    })

    await t.test ("Monad identity", { skip: true }, t => {})
})
