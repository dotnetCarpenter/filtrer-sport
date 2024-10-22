// @ts-check
// ==UserScript==
// @name         Filtrer sport
// @namespace    http://tampermonkey.net/
// @version      2024.10.22
// @description  Filtrer sport på dr.dk/nyheder fra.
// @author       dotnetCarpenter
// @match        https://www.dr.dk/nyheder
// @icon         https://www.google.com/s2/favicons?sz=64&domain=dr.dk
// @grant        none
// @supportURL   https://gist.github.com/dotnetCarpenter/855c165ff4a7d69d5458b2ce477da59d
// ==/UserScript==

(function() {
    "use strict"

    //    trace :: a -> b -> b
    const trace = s => a => (console.debug (s, a), a)

    //    dbgln :: String | Symbol -> Object -> a
    const dbgln = accessor => a => (console.debug (a?.[accessor]), a)

    //    pipe :: Array<(a -> b)> -> a -> b
    const pipe = (...fs) => x => fs.reduce ((x, f) => f (x), x)

    const Just = x => ({ fmap: f => Maybe (f (x)) })
    const Nothing = _ => ({ fmap: _ => Nothing () })

    const Maybe = x => x == null
        ? Nothing ()
        : Just (x)

    const fmap = f => Functor => Functor.fmap (f)

    //    maybe :: Functor F => (a -> F<b>) -> c -> F a -> b | c
    const maybe = f => y => Functor => {
        let x
        const fmapAndUnwrap = pipe (f, fmap (a => x = a))
        fmapAndUnwrap (Functor)
        return x ?? y
    }

    //    filter :: (a -> Boolean) -> Array<a> -> Array<a>
    const filter = f => array => array.filter (f)

    //    compareTextContent :: Array<String> -> HtmlElement -> Boolean
    const compareTextContent = textContentList => element => textContentList.includes (element.textContent)

    //    findParent :: String -> HtmlElement -> Null | HtmlElement
    const findParent = tagName => element => {
        if (! (element || element.parentElement)) return null

        return element.parentElement.tagName.toLowerCase () === tagName
            ? element.parentElement
            : findParent (tagName)
                         (element.parentElement)
    }

    //    xfade :: Array<Object>
    const xfade = [{ opacity: 0, scale: .8 }, { opacity: 1, scale: 1 }]

    //    showCardHandler :: HtmlElement -> HtmlElement -> Event -> Void
    const showCardHandler = card => item => _ => {
        item.parentElement.style.opacity = "unset"
        card.style.display = card.dataset.oldDisplay
        card.animate (xfade, { duration: 400, delay: 250, fill: "forwards" })
     }

    //    cardTopicSelector :: String
    const cardTopicSelector = ".hydra-latest-news-page__short-news-item .dre-teaser-meta-label.dre-teaser-meta-label--primary"
    //    headlineSelector :: String
    const headlineSelector = ".hydra-latest-news-page-short-news-article__heading, .hydra-latest-news-page-short-news-card__title"
    //  sportTopics :: Array<String>
    const sportTopics = [
        "Atletik",
        "Badminton",
        "Champions League",
        "Cykling",
        "Engelsk fodbold",
        "Fodbold",
        "Golf",
        "Håndbold",
        "Herrelandsholdet",
        "Kort sport",
        "Kvindelandsholdet",
        "Sport",
        "Tennis",
        "Superliga",
    ]

    //    excludedCardsHeadline :: Array<String>
    const excludedCardsHeadline = []

    //    cards :: Array<HtmlElement>
    const cards = Array.from (document.querySelectorAll (cardTopicSelector))
                       .filter (compareTextContent (sportTopics))
                       //.map (dbgln ("textContent")) // print text content of the selected elements
                       .map (findParent ("li"))
                       .filter (x => x)
                       // TODO: WARNING unpure use of excludedCardsHeadline
                       .map (card => (excludedCardsHeadline.push (card.querySelector (headlineSelector)?.innerText), card))

    const querySelector    = s => d => d.querySelector (s)
    const querySelectorAll = s => d => d.querySelectorAll (s)
    const getListItems     = pipe (
        fmap (querySelector ("ol.hydra-latest-news-page__index-list")),
        fmap (querySelectorAll ("li .hydra-card-title")),
        fmap (Array.from),
        fmap (filter (compareTextContent (excludedCardsHeadline))))


/********************** RUN PROGRAM **********************/

    //    listItems :: Array<HtmlElement>
    const listItems = maybe (getListItems)
                            ([])
                            (Just (document))

    // Remove sport cards
    cards.forEach (card => (card.dataset.oldDisplay = card.style.display, card.style.display = "none", card.style.opacity = 0))

    // Dim sport list items
    listItems.forEach (item => void (item.parentElement.style.opacity = "0.2"))

    // Add handler to show hidden card
    listItems.forEach ((item, index) => item.addEventListener ("pointerdown",
                                                               showCardHandler (cards[index])
                                                                               (item),
                                                               { once: true, passive: true }))
})();
