// @ts-check
// ==UserScript==
// @name         Filtrer sport
// @namespace    http://tampermonkey.net/
// @version      2024.10.22
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
    const Just = x => ({ fmap: f => Maybe (f (x)) })

    //    Nothing :: Functor
    const Nothing = { fmap: () => Nothing }

    //    Maybe :: a -> Just<a> | Nothing
    const Maybe = x => x == null
        ? Nothing
        : Just (x)

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


/********************** PROGRAM **********************/

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

    //    querySelector :: String -> HtmlElement -> HtmlElement
    const querySelector    = s => d => d.querySelector (s)

    //    querySelectorAll :: String -> HtmlElement -> NodeList<HtmlElement>
    const querySelectorAll = s => d => d.querySelectorAll (s)

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
        "Superliga",
        "Tennis",
    ]

    //    xfade :: Array<Object>
    const xfade = [{ opacity: 0, scale: .8 }, { opacity: 1, scale: 1 }]

    //    showCardHandler :: HtmlElement -> HtmlElement -> Event -> Void
    const showCardHandler = card => item => _ => {
        item.parentElement.style.opacity = "unset"
        card.style.display = card.dataset.oldDisplay
        card.animate (xfade, { duration: 400, delay: 250, fill: "forwards" })
    }

    // TODO: Usage of excludedCardsHeadline is unpure and brittle
    //    excludedCardsHeadline :: Array<String>
    const excludedCardsHeadline = []

    //    getListItems :: a -> Maybe<b>
    const getListItems = pipe (
        Maybe,
        fmap (querySelector ("ol.hydra-latest-news-page__index-list")),
        fmap (querySelectorAll ("li .hydra-card-title")),
        fmap (Array.from),
        fmap (filter (compareTextContent (excludedCardsHeadline))))

    //    getCards :: a -> Maybe<b>
    const getCards = pipe (
        Maybe,
        fmap (querySelectorAll (cardTopicSelector)),
        fmap (Array.from),
        fmap (filter (compareTextContent (sportTopics))),
        fmap (map (findParent ("li"))),
        fmap (map (card => (
            excludedCardsHeadline.push (card.querySelector (headlineSelector)?.innerText),
            card))))

/********************** RUN PROGRAM **********************/

    //    cards :: Array<HtmlElement>
    const cards = maybe (getCards)
                        ([])
                        (document)

    //    listItems :: Array<HtmlElement>
    const listItems = maybe (getListItems)
                            ([])
                            (document)

    // Remove sport cards
    cards.forEach (card => (card.dataset.oldDisplay = card.style.display, card.style.display = "none", card.style.opacity = 0))

    // Dim sport list items
    listItems.forEach (item => void (item.parentElement.style.opacity = "0.2"))

    // Add handler to show hidden card
    listItems.forEach ((item, index) => item.addEventListener ("pointerdown",
                                                               showCardHandler (cards[index])
                                                                               (item),
                                                               { once: true, passive: true }))

    /*
    -- GM_registerMenuCommand (menuName, callbackFunction, accessKey)
    https://stackoverflow.com/questions/56024629/what-is-the-accesskey-parameter-of-gm-registermenucommand-and-how-to-use-it
    */
    const menu_command_id_1 = GM_registerMenuCommand("Ret i filtret", event => {
        prompt ("Tilføj et emne der skal filtreres bord:", sportTopics.toString ())
    }, "l")

})();
