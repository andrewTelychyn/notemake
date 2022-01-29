// document.getElementById('note-textarea').placeholder = "new text new text new text ".repeat(30);

document.getElementById('vertical-text-line').innerText = "new text ".repeat(12);
document.getElementById('add-button').addEventListener('click', () => addText())

const horizontalLine = document.getElementById('horizontal-text-line') 
const authorNameInput = document.getElementById("author-name")
const bookNameInput = document.getElementById("book-name")
const noteTextArea = document.getElementById('note-textarea')
const partNameInput = document.getElementById('part-name')
const subpartNameInput = document.getElementById('subpart-name')
const workingArea = document.getElementById('working-note-area')
const addedNotesArea = document.getElementById('added-notes')
const openedHeader = document.getElementById('opened-header')

const INITIAL_BOOK_FONT_VALUE = 64
const INITIAL_AUTHOR_FONT_VALUE = 112
const FONT_SISE_COEF = 0.875

const LETTER_MAX = 4000
const UPPER_LINE_RANGE = 134
const SYMBOL = '\u2014 '

const notesArray = []
let currentNote = {}
let currentNoteIndex = 1
let currentSubpartName = ""
let currentSubnoteIndex = 1

horizontalLine.innerText = "new text ".repeat(15);
authorNameInput.style.fontSize =  INITIAL_AUTHOR_FONT_VALUE + "px" 
bookNameInput.style.fontSize =  INITIAL_BOOK_FONT_VALUE + "px"
authorNameInput.addEventListener("input", (e) => inputAutoResize(e, INITIAL_AUTHOR_FONT_VALUE))
bookNameInput.addEventListener("input", (e) => inputAutoResize(e, INITIAL_BOOK_FONT_VALUE))
subpartNameInput.addEventListener('input', (e) => currentSubpartName = acceptTitles(e.target.value))

// noteTextArea.placeholder = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Nisl condimentum id venenatis a condimentum vitae sapien. Amet nisl purus in mollis. Varius duis at consectetur lorem. Purus non enim praesent elementum facilisis leo vel fringilla. Scelerisque felis imperdiet proin fermentum leo vel orci porta non. Tempus iaculis urna id volutpat lacus laoreet non curabitur. Et malesuada fames ac turpis egestas maecenas pharetra convallis. Aenean et tortor at risus viverra adipiscing at. Nisl rhoncus mattis rhoncus urna neque viverra justo nec ultrices. Nibh tellus molestie nunc non. Cursus vitae congue mauris rhoncus aenean. Lobortis scelerisque fermentum dui faucibus in. Ligula ullamcorper malesuada proin libero nunc consequat.'
noteTextArea.placeholder = 'YOUR TEXT';
noteTextArea.addEventListener('input', (e) => {
    e.target.value = acceptText(e.target.value)
})
noteTextArea.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addText()
})

const placeholderDiv = document.getElementById('placeholder-div'); 
placeholderDiv.addEventListener('click', (e) => placeholderDiv.style.display = 'none');

const f = 1 / -10;
for (let i = 0; i < placeholderDiv.childNodes.length; i++) {
    if (placeholderDiv.children[i]) {
        placeholderDiv.children[i].innerHTML = `<p>${'note making asap  '.repeat(28)}</p>`;
        placeholderDiv.children[i].style['animation-delay'] = f * i + 's';
    }
}


function inputAutoResize(event, initialFontValue) {
    const element = event.target
    const letterAmount = event.target.value.split('').length

    const elementWidth = Number(element.offsetWidth) 
    let elementFontSize = Number(element.style.fontSize.split("px")[0])
    
    const letterSize = Math.round(elementFontSize * FONT_SISE_COEF) 

    if(letterAmount * letterSize > elementWidth) {
        innerFontCheck(
            element,
            elementFontSize, 
            (trialFontSize) => letterAmount * Math.round(trialFontSize * FONT_SISE_COEF) > elementWidth && trialFontSize > 6,
            -1
        )
    } 
    else if (elementFontSize < initialFontValue) {
        innerFontCheck(
            element,
            elementFontSize, 
            (trialFontSize) => {
                return letterAmount * Math.round(trialFontSize * FONT_SISE_COEF) < elementWidth && trialFontSize < initialFontValue
            }
        )
    }
}

function innerFontCheck(element, initialFontSize, callback, minus = 1) {
    let trialFontSize = initialFontSize + 1 * minus
    while(true) {
        if(callback(trialFontSize)) 
        trialFontSize += 1 * minus
        else break
    }
    element.style.fontSize =  trialFontSize + "px"
}

function acceptTitles(text, upperAll = false) {
    const value =  acceptText(text)
    if(!upperAll) {
        return value.charAt(0).toUpperCase() + value.slice(1)
    } else {
        return value.toLowerCase().split(' ').map(item => {
            if(item.length > 2) {
                return item.charAt(0).toUpperCase() + item.slice(1)
            }
            return item
        }).join(' ')
    }
}


function acceptText(text) {
    const letterArray = text.trim().split('') // » «
    let openingSquareBrackedIndex = null
    let openingCurlyBrackedIndex = null
    let quoteBrackets = [null, null]
    let outArray = []
    // console.log(letterArray)

    for(let i = 0; i < letterArray.length; i++) {
        if (letterArray[i] === undefined) continue

        if(letterArray[i] === '-' && letterArray[i + 1] === '\n') {
            i++
            continue
        }

        if(letterArray[i] === '«') {
            if(quoteBrackets[0] === '»') quoteBrackets = [null, null]
            else quoteBrackets = [letterArray[i], i]
        }
        if(letterArray[i] === '»') {
            if(quoteBrackets[0] === '«') quoteBrackets = [null, null]
            else quoteBrackets = [letterArray[i], i]
        }

        if(letterArray[i] === '[') openingSquareBrackedIndex = outArray.length
        if(letterArray[i] === ']' && openingSquareBrackedIndex) {
            outArray = outArray.slice(0, openingSquareBrackedIndex)
            openingSquareBrackedIndex = null

            if(outArray[outArray.length - 1] === ' ' && letterArray[i + 1] === ' ') i++
            continue
        }

        if(letterArray[i] === '{') openingCurlyBrackedIndex = outArray.length
        if(letterArray[i] === '}' && openingCurlyBrackedIndex) {
            outArray = outArray.slice(0, openingCurlyBrackedIndex)
            openingCurlyBrackedIndex = null

            if(outArray[outArray.length - 1] === ' ' && letterArray[i + 1] === ' ') i++
            continue
        }

        if(letterArray[i] === '\n') letterArray[i] = ' '

        if(letterArray[i] === ' ') {
            if(letterArray[i + 1] === ' ' || letterArray[i + 1] === undefined) continue

            if(
                letterArray[i + 1] === '.' || letterArray[i + 1] === ',' || 
                letterArray[i + 1] === ':' || letterArray[i + 1] === ';'
            ) {
                outArray.push(letterArray[i + 1])
                i++
                continue
            }
        } 
        outArray.push(letterArray[i])
    }

    if(quoteBrackets[0]) {
        outArray.splice(quoteBrackets[1], 1);
    }

    return outArray.join('')
}

function postAcceptingText(text) {
    const letterArray = text.trim().split('')
    const lastChar = letterArray[letterArray.length - 1]
    let firstChar = letterArray[0]

    if(lastChar === ',' || lastChar === ';' || lastChar === '-' || lastChar === ':') letterArray[letterArray.length - 1] = '.'
    else if(lastChar !== '.' && lastChar !== '!' && lastChar !== '?') letterArray.push('.')

    if(firstChar === '.' || firstChar === ',' || firstChar === SYMBOL.trim()) {
        letterArray.shift()
        firstChar = letterArray[0] || letterArray[1]
    }

    letterArray[0] = firstChar.toUpperCase()
    return letterArray.join('')
} 

function addText() {
    if(!subpartNameInput.value.trim() || !noteTextArea.value) return

    noteTextArea.placeholder = "YOUR TEXT"

    // note to save 
    const noteContent = SYMBOL + postAcceptingText(noteTextArea.value)

    // create new array if this subpart is new 
    if(!currentNote[currentSubpartName]) {
        currentNote[currentSubpartName] = [] 
        currentSubnoteIndex = 1
        updateWorkingNote()
    }
    
    // gets current chars length
    const noteTextCharNumber = noteTextArea.value.split('').length
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
            updateArrayNotes(currentNote)
        
            currentSubpartName = currentSubnoteIndex === 1 ? currentSubpartName + "#2" : currentSubpartName.split('#')[0] + '#' + (currentSubnoteIndex + 1)
            currentNote = {
                [currentSubpartName]: [noteContent]
            }
            currentSubnoteIndex++
        } else {
            // const index = Math.round( Object.keys(currentNote).length /2)
            const tempArray = currentNote[currentSubpartName]
         
            delete currentNote[currentSubpartName]
            updateArrayNotes(currentNote)
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
    console.log(currentNote, notesArray, currentSubpartName)
    
    // line
    const neededValue = Math.round(UPPER_LINE_RANGE * (totalCharNumber + noteTextCharNumber) / LETTER_MAX)
    horizontalLine.innerHTML = "new text ".repeat(15).split('').slice(0, neededValue).join('')
    
    // clearing textarea value
    noteTextArea.value = ''

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


function updateArrayNotes(note) {
    const CLEAR_BUTTON = '<button id="clear-all-button">Clear all</button>'
    notesArray.push(note)

    // const array = Object.keys(currentNote).length > 0 ? [...notesArray, currentNote] : notesArray
    const array = notesArray

    addedNotesArea.innerHTML = array.map((item, index) => {
        return `<li class="not-clicked" id="list-${index + 1}">
                    <p>${index + 1 <= 9 ? '0' + String(index + 1) : index + 1}</p>
                    <ul id="subpart-list-${index + 1}"  class="subpart-list">
                        ${Object.keys(item).map(name => `<li>${name}</li>`).join('')}
                    </ul>
                    <button>open</button>
                </li>`
    }).join('') + CLEAR_BUTTON
}

function updateWorkingNote() {
    const CLEAR_BUTTON = '<button id="clear-all-button">Clear all</button>'
    // const index = addedNotesArea.children.length

    if(document.getElementById('subpart-list-1')) {
        const li = document.getElementById('subpart-list-' + currentNoteIndex)
        if(li) li.innerHTML = Object.keys(currentNote).map(name => `<li>${name}</li>`).join('')
        else {
            addedNotesArea.removeChild(document.getElementById('clear-all-button'));
            addedNotesArea.innerHTML += 
                `<li class="not-clicked" id="list-${currentNoteIndex}">
                    <p>${currentNoteIndex <= 9 ? '0' + String(currentNoteIndex): currentNoteIndex}</p>
                    <ul id="subpart-list-${currentNoteIndex}" class="subpart-list">
                        ${Object.keys(currentNote).map(name => `<li>${name}</li>`).join('')}
                    </ul>
                    <button>working</button>
                </li>` + CLEAR_BUTTON
        }
    }
    else
        addedNotesArea.innerHTML = 
            `<li class="not-clicked" id="list-${currentNoteIndex}">
                <p>01</p>
                <ul id="subpart-list-1" class="subpart-list">
                    ${Object.keys(currentNote).map(name => `<li>${name}</li>`).join('')}
                </ul>
                <button>working</button>
            </li>` + CLEAR_BUTTON

    const clicked = Array.from(document.getElementsByClassName('clicked'))
    const notclicked = Array.from(document.getElementsByClassName('not-clicked'))
    clicked.concat(notclicked).map(item => {
        item.addEventListener('click', () => copyText(Number(item.id.split('list-')[1]) - 1))
    })
}

function copyText(index) {

    let outText = partNameInput.value.toUpperCase() + ".\n\n"
    for(let [key, value] of Object.entries(notesArray[index] || currentNote)) {
        outText += key + ':\n' + value.map(item => item + '\n').join('') + '\n'
    } 
    outText += "(c) " + acceptTitles(bookNameInput.value, true) + ". " + acceptTitles(authorNameInput.value, true) + "."

    navigator.clipboard.writeText(outText).then(() => {})

    document.getElementById('list-' + (index + 1)).classList = 'clicked'
}












// const fontSizeCoef = 0.8

// const authorNameInput = document.getElementById("author-name")
// const bookNameInput = document.getElementById("book-name")
// const wrapper = document.getElementsByClassName('left-part')[0]

// authorNameInput.addEventListener('input', (e) => enlargeInput(e, 290))
// bookNameInput.addEventListener('input', (e) => enlargeInput(e, 290))

// authorNameInput.style.fontSize =  initialFontValue + "px"
// bookNameInput.style.fontSize =  initialFontValue + "px"


function enlargeInput(event, initialWidth) {
    const element = event.target
    const letterAmount = event.target.value.split("").length

    const currentDivWidth = Number(element.style.width.split('px')[0])
    let commonNameFontSize = Number(bookNameInput.style.fontSize.split("px")[0])

    // checks wethere is enough space 
    if(letterAmount * Math.round(commonNameFontSize * FONT_SISE_COEF) > currentDivWidth) {

        const summValue =  
            Number(bookNameInput.style.width.split("px")[0]) + Number(authorNameInput.style.width.split("px")[0])
        
        // check common sum
        if(wrapper.offsetWidth < summValue) {

            let trialFontSize = commonNameFontSize - 1
            while(true) {
                if(letterAmount * Math.round(trialFontSize * FONT_SISE_COEF) > currentDivWidth && trialFontSize > 6) 
                trialFontSize -= 1
                else break
            }

            console.log(letterAmount * Math.round(trialFontSize * FONT_SISE_COEF), currentDivWidth, letterAmount, trialFontSize, Math.round(trialFontSize * FONT_SISE_COEF));
            bookNameInput.style.fontSize =  trialFontSize + "px"
            authorNameInput.style.fontSize = trialFontSize + "px"
        } 
        else {
            element.style.width = letterAmount * Math.round(commonNameFontSize * FONT_SISE_COEF) + "px";
        }
    } 
    else {
        if(commonNameFontSize < initialFontValue) {
            let trialFontSize = commonNameFontSize + 1
            while(true) {
                if(letterAmount * Math.round(trialFontSize * FONT_SISE_COEF) < currentDivWidth && trialFontSize < initialFontValue) 
                    trialFontSize += 1
                else break
            }

            bookNameInput.style.fontSize =  trialFontSize + "px"
            authorNameInput.style.fontSize = trialFontSize + "px"
            commonNameFontSize = trialFontSize
        }

        const value = letterAmount.length * Math.round(commonNameFontSize * FONT_SISE_COEF) 
        if(value < currentDivWidth) {
            element.style.width = value > initialWidth ? value + "px" : initialWidth + "px";
        }
    }
}

/*

Вводиться назва актора і книги

1. Спочатку перевіряється чи достатньої ширини div
    Якщо ні - перевірити чи сумарно вийде менше загальної ширини wrapper'а 
        ..Якщо да - то просто розширити
        ..Якщо ні - зменшити шрифт
    Якщо да - перевірити спочатку чи шрифт зменшений
        ..Якщо да - збільшувати шрифт поки:
            Буде хватити поточної ширини блоку || Буде досягнуто початкового значення шрифта 
        Перевірити чи можна зменшити

*/