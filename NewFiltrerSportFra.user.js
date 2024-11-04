// @ts-check
// ==UserScript==
// @name         Filtrer sport
// @namespace    http://tampermonkey.net/
// @version      2024.11.04
// @description  Filtrer sport på dr.dk/nyheder fra.
// @author       dotnetCarpenter
// @match        https://www.dr.dk/nyheder
// @icon         https://www.google.com/s2/favicons?sz=64&domain=dr.dk
// @grant        GM_registerMenuCommand
// @supportURL   https://gist.github.com/dotnetCarpenter/855c165ff4a7d69d5458b2ce477da59d
// ==/UserScript==

(function() {
    "use strict"

/********************** DEBUG FUNCTIONS **********************/

    //    trace :: a -> b -> b
    const trace = s => a => (console.debug (s, a), a)

    //    dbgln :: String | Symbol -> Object -> a
    const dbgln = accessor => a => (console.debug (a?.[accessor]), a)

/********************** FUNCTORS **********************/

    //    Just :: a -> Functor<a>
    const Just = x => ({
        fmap: f => Maybe (f (x)),
        join: () => x
    })

    //    Nothing :: Functor
    const Nothing = {
        fmap: _ => Nothing,
        join: () => null
    }

    //    Maybe :: a -> Just<a> | Nothing
    const Maybe = x => x == null
        ? Nothing
        : Just (x)

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

/********************** UTILITY FUNCTIONS **********************/

    //    I :: a -> a
    const I = a => a

    //    fmap :: (a -> b) -> Functor<a> -> Functor<b>
    const fmap = f => Functor => Functor.fmap (f)

    //    maybe :: Monad f => (a -> f<b>) -> c -> a -> b | c
    const maybe = f => c => a => pipe (f, a.join)
                                    (a)
                                ?? c

    //    join :: Functor f => f<a> -> a
    const join = f => f.join ()

    //    fst :: Pair<a,b> -> a
    const fst = pair => pair.fst ()

    //    snd :: Pair<a,b> -> b
    const snd = pair => pair.snd ()

    //    pair :: (a -> b -> c) -> Pair a b -> c
    const pair = f => pair => f (fst (pair))
                                (snd (pair))

    //    pipe :: Array<(a -> b)> -> a -> b
    const pipe = (...fs) => a => fs.reduce ((b, f) => f (b), a)

    //    map :: (a -> b) -> Array<a> -> Array<b>
    const map = f => array => array.map (f)

    //    filter :: (a -> Boolean) -> Array<a> -> Array<a>
    const filter = f => array => array.filter (f)

/********************** PROGRAM **********************/
    //    findParent :: String -> HtmlElement -> Null | HtmlElement
    const findParent = tagName => element => {
        if (! (element || element.parentElement)) return null

        return element.parentElement.tagName.toLowerCase () === tagName
            ? element.parentElement
            : findParent (tagName)
                        (element.parentElement)
    }

    //    querySelector :: String -> HtmlElement -> HtmlElement
    const querySelector    = s => d => d.querySelector (s)

    //    querySelectorAll :: String -> HtmlElement -> NodeList<HtmlElement>
    const querySelectorAll = s => d => d.querySelectorAll (s)

    //    cardTopicSelector :: String
    const cardTopicSelector = ".hydra-latest-news-page__short-news-item .dre-teaser-meta-label.dre-teaser-meta-label--primary"
    //    headlineSelector :: String
    const headlineSelector = ".hydra-latest-news-page-short-news-article__heading, .hydra-latest-news-page-short-news-card__title"

    //    xfade :: Array<Object>
    const xfade = [{ opacity: 0, scale: .8 }, { opacity: 1, scale: 1 }]

    //    showCardHandler :: HtmlElement -> HtmlElement -> Event -> Void
    const showCardHandler = card => item => _ => {
        item.parentElement.style.opacity = "unset"
        card.style.display = card.dataset.oldDisplay
        card.animate (xfade, { duration: 400, delay: 250, fill: "forwards" })
    }

    //    getHeadlineText :: Array<HtmlElement> -> Array<String>
    const getHeadlineText = pipe (
        map (querySelector (headlineSelector)),
        map (element => element?.innerText))


    //    compareTextContent :: Array<String> -> HtmlElement -> Boolean
    const compareTextContent = textContentList => element => textContentList.includes (element.textContent)

    //    getAllListItems :: a -> Maybe<b>
    const getAllListItems = pipe (
        Maybe,
        fmap (querySelector ("ol.hydra-latest-news-page__index-list")),
        fmap (querySelectorAll ("li .hydra-card-title")),
        fmap (Array.from))

    const sportPredicate = pipe (compareTextContent, filter)
    const filterCards = pair (sportTopics => cards => Pair (sportTopics)
                                                           (sportPredicate (sportTopics)
                                                                           (cards)))

    //    getCards :: Maybe<a> -> Maybe<b>
    const getCards = pipe (
        fmap (trace ("getCards :: first")),
        fmap (fmap (querySelectorAll (cardTopicSelector))),
        fmap (fmap (Array.from)),
        // fmap (fmap (trace ("getCards::before"))),
        fmap (filterCards),
        fmap (fmap (map (findParent ("li")))),
        fmap (fmap (trace ("getCards::after"))))

/********************** RUN PROGRAM **********************/
    const main = sportTopics => {
        trace ("main") (sportTopics)

        //    cards :: Maybe<Array<HtmlElement>>
        const cards = maybe (getCards)
                            ([])
                            (Just (Pair (join (sportTopics))
                                        (window.document)))

        pair (a => b => console.debug ("cards", a, b))
             (cards)

        // //    listItems :: Array<HtmlElement>
        // const listItems = maybe (pipe (
        //                             getAllListItems,
        //                             fmap (filter (compareTextContent (getHeadlineText (cards))))))
        //                         ([])
        //                         (document)

        // // Remove sport cards
        // cards.forEach (card => void (card.dataset.oldDisplay = card.style.display, card.style.display = "none", card.style.opacity = 0))

        // // Dim sport list items
        // listItems.forEach (item => void (item.parentElement.style.opacity = "0.2"))

        // // Add handler to show hidden card
        // listItems.forEach ((item, index) => void (
        //     item.addEventListener ("pointerdown",
        //     showCardHandler (cards[index])
        //                     (item),
        //     { once: true, passive: true })))

    }

    //    sportTopics :: Array<String>
    const sportTopics = [
        "Atletik",
        "Badminton",
        "Basketball",
        "Champions League",
        "Cykling",
        "Engelsk fodbold",
        "Fodbold",
        "Golf",
        "Håndbold",
        "Herrelandsholdet",
        "Herreligaen",
        "Ishockey",
        "Kort sport",
        "Kvindelandsholdet",
        "Spansk fodbold",
        "Sport",
        "Superliga",
        "Tennis",
        "Tour de France",
    ]

    const runProgram = maybe (main)
                            (I)

    runProgram (Just (sportTopics))

    // const getTopicsFromPrompt = pipe (
    //     x => x === ""
    //         ? Maybe (null)
    //         : Maybe (x),
    //     fmap (s => s.split (",")))

    // /*
    // -- GM_registerMenuCommand (menuName, callbackFunction, accessKey)
    // https://stackoverflow.com/questions/56024629/what-is-the-accesskey-parameter-of-gm-registermenucommand-and-how-to-use-it
    // @ts-ignore */
    // GM_registerMenuCommand("Ret filtret", _ => {
    //     runProgram (
    //         getTopicsFromPrompt (
    //             prompt ("Tilføj et emne der skal filtreres bord:", sportTopics.join ())))
    // }, "l")

})();
