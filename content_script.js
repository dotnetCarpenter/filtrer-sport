"use strict"

const { pipe, fmap, Maybe, map, maybe, filter } = globalThis.filtrerSport.FP
const { sha256 } = globalThis.filtrerSport.hashing

/********************** DEBUG FUNCTIONS **********************/

//    trace :: a -> b -> b
const trace = s => a => (console.debug (s, a), a)

//    dbgln :: String | Symbol -> Object -> a
const dbgln = accessor => a => (console.debug (a?.[accessor]), a)


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
    "Amerikansk fodbold",
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
    "Skisport",
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

sha256 (sportTopics.join (""))
 .then (console.debug.bind (console, "SHA-256"))

// Below does not work eventhough "permissions": ["tabs"] is set in manifest.json
// Probably none of this is available in content_script.
//
// You can only request permissions inside the handler for a user action, such as from a
// toolbar button (browser action), shortcut menu item, or similar.
// If you request several permissions at once they are either all granted or all declined,
// the user cannot choose to grant some and not others.
// https://extensionworkshop.com/documentation/develop/request-the-right-permissions/#request-permissions-at-runtime
// const permissions = await browser.permissions.Permissions.getAll ()
// console.debug ("permissions.Permissions", permissions)
// console.debug ("browser", browser)
// console.debug ("browser.tabs", browser.tabs)
// const tabs = browser.tabs.query({active: true, currentWindow: true});
// console.debug (tabs)
// browser.pageAction.show(tabs[0].id)
