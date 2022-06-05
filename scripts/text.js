/**
 * Consts
 */
const SYMBOL = '\u2014 ';

/**
 * Checks whether input text has wrong symbols
 * @param {string} text input text
 * 
 * @returns {string} checked text
 */
function checkTextForSybmols(text) {
    const letterArray = text.trim().split('') // » «

    let openingSquareBrackedIndex = null
    let openingCurlyBrackedIndex = null
    let quoteBrackets = [null, null]
    let outArray = []

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

    return outArray.join('');
}

/**
 * Capitalizes text
 * @param {string} text input text
 * @param {boolean} upperAll defines whether every word should begin capitalized 
 * 
 * @returns {string} Capitalized text 
 */
function capitalizeText(text, upperAll = false) {
    const value =  checkTextForSybmols(text);

    if(!upperAll) {
        return value.charAt(0).toUpperCase() + value.slice(1);
    } else {
        return value.toLowerCase().split(' ').map(item => {
            if(item.length > 2) {
                return item.charAt(0).toUpperCase() + item.slice(1);
            }

            return item;
        }).join(' ');
    }
}

/**
 * Checks that last symbol of text is the desired one
 * @param {string} text input text
 * 
 * @returns {string} 
 */
function checkLastSymbol(text) {
    const FIRST_LAYER_CHECK = [',', ';', '-', ':'];
    const SECOND_LAYER_CHECK = ['.', '!', '?'];

    const letterArray = text.trim().split('')
    const lastChar = letterArray[letterArray.length - 1]
    let firstChar = letterArray[0]

    if(FIRST_LAYER_CHECK.includes(lastChar)) {
        letterArray[letterArray.length - 1] = '.';
    }
    else if(!SECOND_LAYER_CHECK.includes(lastChar)) {
        letterArray.push('.');
    }

    if(firstChar === '.' || firstChar === ',' || firstChar === SYMBOL.trim()) {
        letterArray.shift()
        firstChar = letterArray[0] || letterArray[1]
    }

    letterArray[0] = firstChar.toUpperCase();

    return letterArray.join('');
}