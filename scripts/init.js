/**
 * Consts
 */
const INITIAL_BOOK_FONT_VALUE = 64;
const INITIAL_AUTHOR_FONT_VALUE = 112;


/**
 * Elements Refs
 */
const subpartNameInput = document.getElementById('subpart-name');
const authorNameInput = document.getElementById("author-name");
const horizontalLine = document.getElementById('horizontal-text-line');
const addedNotesArea = document.getElementById('added-notes');
const partNameInput = document.getElementById('part-name');
const bookNameInput = document.getElementById('book-name');
const openedHeader = document.getElementById('opened-header');
const noteTextArea = document.getElementById('note-textarea');
const workingArea = document.getElementById('working-note-area');


/**
 * Creates cirle loader on page loading; also adds event to close it
 * @returns {void}
 */
function handleLoader() {
    // creating loader
    const LOADER_TEXT = 'ЗНАННЯ ЗАРАДИ МИРУ    '.repeat(3);
    const customLoader = document.getElementById('custom-loader');
    customLoader.replaceChildren(...LOADER_TEXT.split('').map((c, i) => {
        const span = document.createElement('span');
        span.innerText = c;
        span.style['transform'] = `rotate(${i * 8}deg) translate(-47%, 0)`
        
        return span;
    }))
    
    // hiding textarea and title
    const initialHidden = Array.from(document.getElementsByClassName('initial-hidden'));
    initialHidden.map(i => (i.style['display'] = 'none'));

    // adding event on click
    const loaderButton = document.getElementById('loader-begin-button');
    loaderButton.addEventListener('click', () => {
        initialHidden.map(i => (i.style['display'] = 'block'));
        customLoader.style['display'] = 'none';
        loaderButton.style['display'] = 'none';
    }); 
}

/**
 * Creates horizontal and vertial lines
 * @return {void}
 */
function handleTextLines() {
    horizontalLine.innerText = "НОВИЙ ТЕКСТ ".repeat(15);
    document.getElementById('vertical-text-line').innerText = "НОВИЙ ТЕКСТ ".repeat(12) + "НОВИЙ PST.";
    document.getElementById('horizontal-text-line-bottom').innerText = "НОВИЙ ТЕКСТ ".repeat(3);
}

/**
 * Sets different method on specific events
 * @returns {void}
 */
function setMethodOnEvents() {
    // handling new note by clicking on add button or pressing Enter
    document.getElementById('add-button').addEventListener('click', () => handleNewNote());
    noteTextArea.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleNewNote();
    })

    // sets initial font size
    authorNameInput.style.fontSize =  INITIAL_AUTHOR_FONT_VALUE + "px";
    bookNameInput.style.fontSize =  INITIAL_BOOK_FONT_VALUE + "px";

    // handling auto resize
    authorNameInput.addEventListener("input", (e) => inputAutoResize(e, INITIAL_AUTHOR_FONT_VALUE));
    bookNameInput.addEventListener("input", (e) => inputAutoResize(e, INITIAL_BOOK_FONT_VALUE));

    // handling text capitalization 
    subpartNameInput.addEventListener('input', (e) => currentSubpartName = capitalizeText(e.target.value));

    noteTextArea.placeholder = 'YOUR TEXT';
    // check for symbol every time user inputs something
    noteTextArea.addEventListener('input', (e) => {
        e.target.value = checkTextForSybmols(e.target.value);
    })
}

/**
 * Common init function
 * @returns {void}
 */
function onInit() {
    handleLoader();
    handleTextLines();
    setMethodOnEvents();
}

onInit();
