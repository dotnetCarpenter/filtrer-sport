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

//    xfade :: Array<Object>
const xfade = [{ opacity: 0, scale: .8 }, { opacity: 1, scale: 1 }]

//    showCardHandler :: HtmlElement -> HtmlElement -> Event -> Void
const showCardHandler = card => item => _ => {
    item.parentElement.style.opacity = "unset"
    card.style.display = card.dataset.oldDisplay
    card.animate (xfade, { duration: 400, delay: 250, fill: "forwards" })
}

//    getAllListItems :: a -> Maybe<b>
const getAllListItems = pipe (
    Maybe,
    fmap (querySelector ("ol.hydra-latest-news-page__index-list")),
    fmap (querySelectorAll ("li .hydra-card-title")),
    fmap (Array.from))

//    getCards :: Maybe<a> -> Maybe<b>
const getCards = sportTopics => pipe (
    fmap (querySelectorAll (cardTopicSelector)),
    fmap (Array.from),
    fmap (filter (compareTextContent (sportTopics))),
    fmap (map (findParent ("li"))))

//    getHeadlineText :: Array<HtmlElement> -> Array<String>
const getHeadlineText = pipe (
    map (querySelector (headlineSelector)),
    map (element => element?.innerText))

/********************** RUN PROGRAM **********************/
//  sportTopics :: Array<String>
const sportTopics = [
    "Atletik",
    "Badminton",
    "Basketball",
    "Boksning",
    "Champions League",
    "Conference League",
    "Cykling",
    "EM håndbold",
    "EM i håndbold",
    "Engelsk fodbold",
    "Europa League",
    "Fodbold",
    "Formel 1",
    "Golf",
    "Herrelandsholdet",
    "Herreligaen",
    "Hestesport",
    "Håndbold",
    "Ishockey",
    "Kort sport",
    "Kvindelandsholdet",
    "Kvindeligaen",
    "Motorsport",
    "Pokalturneringen",
    "PostNord Danmark Rundt",
    "Sejlsport",
    "Spansk fodbold",
    "Sport",
    "Superliga",
    "Svømning",
    "Tennis",
    "Tour de France",
    "Tysk fodbold",
    "VM herrer",
    "VM i håndbold",
]

console.time (`Filter_${sportTopics.length}Sport_Topics`)

//    cards :: Array<HtmlElement>
const cards = maybe (getCards (sportTopics))
                    ([])
                    (Maybe (document))

//    listItems :: Array<HtmlElement>
const listItems = maybe (pipe (
                            getAllListItems,
                            fmap (filter (compareTextContent (getHeadlineText (cards))))))
                        ([])
                        (document)

// console.debug (cards, listItems)

// Remove sport cards
cards.forEach (card => void (card.dataset.oldDisplay = card.style.display, card.style.display = "none", card.style.opacity = 0))

// Dim sport list items
listItems.forEach (item => void (item.parentElement.style.opacity = "0.2"))

// Add handler to show hidden card
listItems.forEach ((item, index) => void (
    item.addEventListener ("pointerdown",
        showCardHandler (cards[index])
                        (item),
        { once: true, passive: true })));

console.timeEnd (`Filter_${sportTopics.length}Sport_Topics`)
