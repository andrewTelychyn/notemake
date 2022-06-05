/**
 * CORE FUNCTIONS AND STORE-OBJECTS OF PROJECT!
 */

const notesArray = [];

let currentNote = {};
let currentNoteIndex = 1;
let currentSubpartName = '';
let currentSubnoteIndex = 1;


/**
 * Adds new note to the store
 * @param {string} text input text
 * 
 * @returns {[number, number]} tuple of [total notes length, current note's length]
 */
function addNewNote(text) {
    // note to save 
    const noteContent = SYMBOL + checkLastSymbol(text)

    // create new array if this subpart is new 
    if(!currentNote[currentSubpartName]) {
        currentNote[currentSubpartName] = [] 
        currentSubnoteIndex = 1
        updateWorkingNote()
    }
    
    // gets current chars length
    const noteTextCharNumber = text.split('').length
    let totalCharNumber = Object.values(currentNote)
        .reduce((acc, array) => acc += array.join(' ').split('').length, 0) 
    
        // check if not out range
    if(totalCharNumber + noteTextCharNumber <= LETTER_MAX) {
        currentNote[currentSubpartName].push(noteContent)
        // console.log(currentNote)
        
    } else {
        // checks if note include only one subpart name
        if(Object.keys(currentNote).length === 1) {
            if(currentSubnoteIndex === 1) {
                currentNote[currentSubpartName + "#1"] = currentNote[currentSubpartName]
                delete currentNote[currentSubpartName]
            }
            updateNotesAreaWithNewNote(currentNote)
        
            currentSubpartName = currentSubnoteIndex === 1 ? currentSubpartName + "#2" : currentSubpartName.split('#')[0] + '#' + (currentSubnoteIndex + 1)
            currentNote = {
                [currentSubpartName]: [noteContent]
            }
            currentSubnoteIndex++
        } else {
            // const index = Math.round( Object.keys(currentNote).length /2)
            const tempArray = currentNote[currentSubpartName]
         
            delete currentNote[currentSubpartName]
            updateNotesAreaWithNewNote(currentNote)
            currentNote = {
                [currentSubpartName]: [...tempArray, noteContent]
            }
        }

        currentNoteIndex++
        updateWorkingNote()
        openedHeader.innerText = "working " + (currentNoteIndex <= 9 ? '0' + String(currentNoteIndex): currentNoteIndex)
        
        totalCharNumber = Object.values(currentNote)
            .reduce((acc, array) => acc += array.join(' ').split('').length, 0) 
    }

    return [totalCharNumber, noteTextCharNumber];
}