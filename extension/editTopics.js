const { sha256 } = globalThis.filtrerSport.hashing

const output1 = document.querySelector ("#hash1")
const output2 = document.querySelector ("#hash2")
const output3 = document.querySelector ("#hash3")
const storage = browser.storage

function storageHandler (changes, areaName) {
    output1.textContent = areaName
        ? "Called from change listener"
        : output1.textContent
    storage.sync.get ()
           .then (everything => {
               const hash = everything.hash;
               const sportTopics = everything.sportTopics

               output2.textContent = hash
               sha256 (sportTopics.join (""))
                .then (hash2 => void (output3.textContent = hash2))
           })
}

output1.textContent = "waiting for storage change..."
storageHandler ()
storage.onChanged.addListener (storageHandler)
