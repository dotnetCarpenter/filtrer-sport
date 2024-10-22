// @ts-check
// ==UserScript==
// @name         Filtrer sport
// @namespace    http://tampermonkey.net/
// @version      2024-10-14
// @description  Filtrer sport på dr.dk/nyheder fra.
// @author       dotnetCarpenter
// @match        https://www.dr.dk/nyheder
// @icon         https://www.google.com/s2/favicons?sz=64&domain=dr.dk
// @grant        none
// ==/UserScript==

(function() {
    'use strict'

    //    dbgln :: String -> a -> a
    const dbgln = accessor => a => (console.debug (a?.[accessor]), a)

    // TODO: Implement Functor church encoded
    // Array.from (
    //     document.querySelector ("ol.hydra-latest-news-page__index-list")
    //             .querySelectorAll ("li .hydra-card-title"))
    //             .filter (compareTextContent (excludedCardsHeadline))

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
                       .map (card => (excludedCardsHeadline.push (card.querySelector (headlineSelector)?.innerText), card))

    //    listItems :: Array<HtmlElement>
    const listItems = Array.from (
        document.querySelector ("ol.hydra-latest-news-page__index-list") // FIXME: Object is possibly 'null'.
                .querySelectorAll ("li .hydra-card-title"))
                .filter (compareTextContent (excludedCardsHeadline))

    // Remove sport cards
    cards.forEach (card => (card.dataset.oldDisplay = card.style.display, card.style.display = "none", card.style.opacity = 0))

    // Dim sport list items
    listItems.forEach (item => void (item.parentElement.style.opacity = "0.2"))

    // Add handler to show hidden card
    listItems.forEach ((item, index) => item.addEventListener ("pointerdown",
                                                               showCardHandler (cards[index])
                                                                               (item),
                                                               { once: true, passive: true }))

    /*-- GM_registerMenuCommand (menuName, callbackFunction, accessKey)
https://stackoverflow.com/questions/56024629/what-is-the-accesskey-parameter-of-gm-registermenucommand-and-how-to-use-it
*/
//    const menu_command_id_1 = GM_registerMenuCommand("Tilføj til filtret", event => {
//        prompt ("Tilføj et emne der skal filtreres bord:", sportTopics.toString ())
//    })
})();
