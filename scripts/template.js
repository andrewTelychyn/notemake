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
    let outText = partNameInput.value.toUpperCase() + ".\n\n"
    for(let [key, value] of Object.entries(notesArray[index] || currentNote)) {
        outText += key + ':\n' + value.map(item => item + '\n').join('') + '\n'
    } 

    outText += "(c) " + capitalizeText(bookNameInput.value, true) + ". " + capitalizeText(authorNameInput.value, true) + ".";

    navigator.clipboard.writeText(outText).then(() => {})

    // mark note as clicked
    document.getElementById('list-' + (index + 1)).classList = 'clicked'
}

/**
 * Updates working area
 * @returns {void}
 */
function updateWorkingArea() {
    // filling working area
    workingArea.innerHTML = ''
    let index = 1
    for(let [key, value] of Object.entries(currentNote)) {
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
 * Handles new note input 
 * @returns {void}
 */
function handleNewNote() {
    if(!subpartNameInput.value.trim() || !noteTextArea.value) return

    noteTextArea.placeholder = "YOUR TEXT"

    const [totalCharNumber, noteTextCharNumber] = addNewNote(noteTextArea.value);
    
    // update progress line
    const neededValue = Math.round(UPPER_LINE_RANGE * (totalCharNumber + noteTextCharNumber) / LETTER_MAX)
    horizontalLine.innerHTML = "НОВИЙ ТЕКСТ ".repeat(15).split('').slice(0, neededValue).join('')
    
    // clearing textarea value
    noteTextArea.value = ''

    updateWorkingArea();
}

/**
 * Takes current note and updates the list on template
 * @param {string} note current note
 */
function updateNotesAreaWithNewNote(note) {
    notesArray.push(note)

    // const array = Object.keys(currentNote).length > 0 ? [...notesArray, currentNote] : notesArray
    const array = notesArray

    const resultTemplate = array.map((item, index) => {
        return `<li class="not-clicked" id="list-${index + 1}">
                    <p>${index + 1 <= 9 ? '0' + String(index + 1) : index + 1}</p>
                    <ul id="subpart-list-${index + 1}"  class="subpart-list">
                        ${Object.keys(item).map(name => `<li>${name}</li>`).join('')}
                    </ul>
                    <button>open</button>
                </li>`
    });

    addedNotesArea.innerHTML = resultTemplate.join('') + CLEAR_BUTTON;
}

/**
 * Updates working note in the notes area 
 * @returns {void}
 */
function updateWorkingNote() {
    // means more then one note
    if(document.getElementById('subpart-list-1')) {
        const li = document.getElementById('subpart-list-' + currentNoteIndex);

        if(li) {
            li.innerHTML = Object
                .keys(currentNote)
                .map(name => `<li>${name}</li>`)
                .join('');
        }
        else {
            // removes button at the end
            addedNotesArea.removeChild(document.getElementById('clear-all-button'));

            const resultTemplate = 
                `<li class="not-clicked" id="list-${currentNoteIndex}">
                    <p>${currentNoteIndex <= 9 ? '0' + String(currentNoteIndex): currentNoteIndex}</p>
                    <ul id="subpart-list-${currentNoteIndex}" class="subpart-list">
                        ${Object.keys(currentNote).map(name => `<li>${name}</li>`).join('')}
                    </ul>
                    <button>working</button>
                </li>`;

            addedNotesArea.innerHTML += resultTemplate + CLEAR_BUTTON;
        }

    } else {
        // means currently only one note
        const resultTemplate = 
            `<li class="not-clicked" id="list-${currentNoteIndex}">
                <p>01</p>
                <ul id="subpart-list-1" class="subpart-list">
                    ${Object.keys(currentNote).map(name => `<li>${name}</li>`).join('')}
                </ul>
                <button>working</button>
            </li>`;

        addedNotesArea.innerHTML = resultTemplate + CLEAR_BUTTON;
    }

    // add possibility to copy note by clicking
    const clicked = Array.from(document.getElementsByClassName('clicked'));
    const notclicked = Array.from(document.getElementsByClassName('not-clicked'));

    clicked.concat(notclicked).map(item => {
        item.addEventListener('click', () => copyText(Number(item.id.split('list-')[1]) - 1))
    });
}

