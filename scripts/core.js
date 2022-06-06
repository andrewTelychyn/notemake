/**
 * CORE FUNCTIONS AND STORE-OBJECTS OF PROJECT!
 */

/**
 *  @typedef {Object.<string, string[]>} Notes
 * 
 *  @typedef {Object} MessageNote
 *  @property {string} title
 *  @property {Notes} notes
 *  @property {boolean} wasClicked
 */


/** @type MessageNote */
let currentMessageNote = {};

/** @type MessageNote[] */
let notesStoreV2 = [];

let currentPartName = '';
let currentSubpartName = '';


/**
 * Adds new note to the store
 * @param {string} text input text
 * 
 * @returns {[number, number]} tuple of [total notes length, current note's length]
 */
function addNewNoteV2(text) {
    // note to save 
    const noteContent = SYMBOL + checkLastSymbol(text);

    if (currentMessageNote.title !== currentPartName) {
        setNewMessageNote();
    }

    if (!currentMessageNote.notes[currentSubpartName]) {
        currentMessageNote.notes[currentSubpartName] = [];
    }

    // gets current chars length
    const noteTextCharNumber = text.split('').length;
    let totalCharNumber = Object.values(currentMessageNote.notes)
        .reduce((acc, array) => acc += array.join(' ').split('').length, 0);

    if (totalCharNumber + noteTextCharNumber <= LETTER_MAX) {
        currentMessageNote.notes[currentSubpartName].push(noteContent);

    } else {
        // only one subpart in a message
        if (Object.keys(currentMessageNote.notes).length === 1) {
            // only one 
            if (currentNoteIndexV2() === 1) {
                currentMessageNote.notes[currentSubpartName + "#1"] = currentMessageNote.notes[currentSubpartName];
                delete currentMessageNote.notes[currentSubpartName];
            }

            currentSubpartName = currentNoteIndexV2() === 1
                ? currentSubpartName + '#2'
                : currentSubpartName.split('#')[0] + '#' + (currentNoteIndexV2() + 1);

            setNewMessageNote({
                [currentSubpartName]: [noteContent],
            });

        // many subparts
        } else {
            const tempArray = currentMessageNote.notes[currentSubpartName];
            delete currentMessageNote.notes[currentSubpartName];

            setNewMessageNote({
                [currentSubpartName]: [...tempArray, noteContent],
            });
        }

        totalCharNumber = Object.values(currentMessageNote.notes)
            .reduce((acc, array) => acc += array.join(' ').split('').length, 0) ;
    }

    return [totalCharNumber, noteTextCharNumber];
}

/**
 * Helpers
 */


/**
 * Sets new current message note; saves old one if exists
 * @param {Notes} notes 
 */
function setNewMessageNote(notes = {}) {
    if (currentMessageNote.notes && Object.keys(currentMessageNote.notes)) {
        notesStoreV2.push(currentMessageNote);
    }

    currentMessageNote = {
        title: currentPartName,
        wasClicked: false,
        notes,
    }
}

/**
 * Gets formated number of NotesStore's index
 * @param {number} inputIndex possible input index
 * @returns {string} formated index
 */
function getHeaderText(inputIndex = null) {
    let index = (inputIndex ?? notesStoreV2.length) + 1; 

    return index <= 9
        ? '0' + String(index)
        : index;
}

/**
 * Gets index of current note with current title
 * @returns {number} index 
 */
function currentNoteIndexV2() {
    let index = 0;
    const name = currentSubpartName.split('#')[0];

    [...notesStoreV2, currentMessageNote].forEach((item) => {
        Object
            .keys(item.notes)
            .forEach((note) => {
                if (note.includes(name)) {
                    index++;
                }
            })
    });

    return index;
}