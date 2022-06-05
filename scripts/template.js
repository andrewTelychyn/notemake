/** 
 * Consts
*/
const LETTER_MAX = 4000;
const UPPER_LINE_RANGE = 134;

const CLEAR_BUTTON = '<button id="clear-all-button">Clear all</button>';


/**
 * Copies to clipboard content of specific note
 * @param {number} index of desired note
 * 
 * @returns {void}
 */
function copyText(index) {
    const messageNote = notesStoreV2[index] ?? currentMessageNote;

    let outText = messageNote.title + ".\n\n"
    for(let [key, value] of Object.entries(messageNote.notes)) {
        outText += key + ':\n' + value.map(item => item + '\n').join('') + '\n'
    } 

    outText += "(c) " + bookNameInput.value + ". " + authorNameInput.value + ".";


    navigator.clipboard.writeText(outText).then(() => {})

    // mark note as clicked
    document.getElementById('list-' + (index + 1)).classList = 'clicked';
    messageNote.wasClicked = true;
}

/**
 * Updates working area
 * @param {number | null} noteIndex of desired note
 * 
 * @returns {void}
 */
function updateWorkingArea(noteIndex = null) {
    const messageNote = notesStoreV2[noteIndex] ?? currentMessageNote;

    const sectionTitle = notesStoreV2[noteIndex] 
        ? 'opened ' +  getHeaderText(noteIndex)
        : 'working ' + getHeaderText();

    // update working index    
    openedHeader.innerText = sectionTitle;

    // filling working area
    workingArea.innerHTML = `<h3>${messageNote.title}.</h3>`

    let index = 1
    for(let [key, value] of Object.entries(messageNote.notes)) {
        const h3 = `<h3 id="opened-notes-${index}">${key}</h3>`
        const lis = value.map((item) => `<li>${item}</li>`).join('')
        const ul = `<ul id="opened-subpart-${index}">${lis}</ul>`
    
        workingArea.innerHTML += h3 + ul
        index++
    }

    // adding author
    const credentials = "(c) " + bookNameInput.value + ". " + authorNameInput.value + "."
    workingArea.innerHTML += `<h3 id="opened-author">${credentials}</h3>`
}

/**
 * Updates notes list area
 * @returns {void}
 */
function updateWorkingNote() {
    const array = [...notesStoreV2, currentMessageNote]

    const resultTemplate = array.map((item, index) => {
        return `<li class="${item.wasClicked ? '': 'not-'}clicked" id="list-${index + 1}">
                    <p>${getHeaderText(index)}</p>
                    <ul id="subpart-list-${index + 1}"  class="subpart-list">
                        ${Object.keys(item.notes).map(name => `<li>${name}</li>`).join('')}
                    </ul>
                    <button>${index === notesStoreV2.length ? 'working' : 'open' }</button>
                </li>`
    });

    addedNotesArea.innerHTML = resultTemplate.join('') + CLEAR_BUTTON;

    // add possibility to copy note by clicking
    const clicked = Array.from(document.getElementsByClassName('clicked'));
    const notclicked = Array.from(document.getElementsByClassName('not-clicked'));

    clicked.concat(notclicked).map(item => {
        const noteIndex = Number(item.id.split('list-')[1]) - 1;

        Array.from(item.children).forEach((element, index, array) => {
            /** @type Function */
            let callback;


            if (index === array.length - 1) {
                callback = () => updateWorkingArea(noteIndex);
            } else {
                callback = () => copyText(noteIndex);
            }

            element.addEventListener('click', callback)
        });
    });
}

/**
 * Handles new note input 
 * @returns {void}
 */
function handleNewNote() {
    if(!subpartNameInput.value.trim() || !noteTextArea.value) return

    noteTextArea.placeholder = "YOUR TEXT"

    const [totalCharNumber, noteTextCharNumber] = addNewNoteV2(noteTextArea.value);
    
    // update progress line
    const neededValue = Math.round(UPPER_LINE_RANGE * (totalCharNumber + noteTextCharNumber) / LETTER_MAX)
    horizontalLine.innerHTML = "НОВИЙ ТЕКСТ ".repeat(15).split('').slice(0, neededValue).join('')
    
    // clearing textarea value
    noteTextArea.value = ''

    updateWorkingArea();
    updateWorkingNote();
}


