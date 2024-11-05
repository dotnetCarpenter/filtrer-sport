import test from "node:test"
import assert from "node:assert"
import { Maybe, fmap, I, pipe, join } from "./FP.mjs"

const concat = a => b => a.concat (b)
const flip = f => a => b => f (b) (a)
const append = flip (concat)

test ("Functions", t => {
    assert.strictEqual (
        append (" world") ("Hello"),
        "Hello world"
    )
})

test ("Maybe", async t => {
    const string  = Maybe ("Goodbye")
    const nothing = Maybe (null)
    const numbers = Maybe ([1, 2, 3])
    const strings = Maybe (["foo", "bar"])

    await t.test ("identity", t => {
        const identityLaw1 = fmap (I)
        const identityLaw2 = I

        assert.deepStrictEqual (
            identityLaw1 (numbers).toString (),
            identityLaw2 (numbers).toString (),
            "map (id) === id"
        )

        assert.deepStrictEqual (
            identityLaw1 (strings).toString (),
            identityLaw2 (strings).toString (),
            "map (id) === id"
        )

        assert.deepStrictEqual (
            identityLaw1 (nothing).toString (),
            identityLaw2 (nothing).toString (),
            "fmap (id) === id"
        )
    })

    await t.test ("composition", t => {
        const compositionLaw1 = pipe (
            fmap (append (" cruel")),
            fmap (append (" world")))

        const compositionLaw2 = fmap (pipe (
            append (" cruel"),
            append (" world")))

        assert.deepStrictEqual (
            compositionLaw1 (string).toString (),
            compositionLaw2 (string).toString (),
            "pipe (fmap (f), fmap (g)) === fmap (pipe (f, g))"
        )
    })

    await t.test ("associativity", t => {
        const mma = Maybe (string)
        const associativeLaw1 = pipe (fmap (join), join)
        const associativeLaw2 = pipe (join, join)

        assert.deepStrictEqual (
            associativeLaw1 (mma).toString (),
            associativeLaw2 (mma).toString (),
            "pipe (fmap (join), join) === pipe (join, join)")

        assert.throws (
            pipe (join, fmap (join)).bind (null, mma),
            Error,
            "pipe (join, fmap (join)) will call join on a string")
    })
})
