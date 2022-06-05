/**
 * Consts
 */
const FONT_SIZE_COEF = 0.875;


/**
 * Finds what exact font size should be set
 * 
 * @param {number} initialFontSize from where to begin
 * @param {Function} conditionCallback defines whether value is satisfying
 * @param {number} minus defines whether value goes up or down
 * 
 * @returns {string} Result value
 */
function calculateFont(initialFontSize, conditionCallback, minus = 1) {
    let trialFontSize = initialFontSize + 1 * minus

    while(true) {
        if(conditionCallback(trialFontSize)) {
            trialFontSize += 1 * minus
        }
        else {
            break;
        }
    }

    return trialFontSize + "px";
}

/**
 * Changes font size of input element to match the width
 * @param {Event} event from where
 * @param {number} initialFontValue - start point of the font calculations
 * 
 * @returns {void}
 */
function inputAutoResize(event, initialFontValue) {
    const element = event.target;
    const letterAmount = Number(event.target.value.split('').length);

    const elementWidth = Number(element.offsetWidth) ;
    const elementFontSize = Number(element.style.fontSize.split("px")[0]);
    const letterSize = Math.round(elementFontSize * FONT_SIZE_COEF);

    let conditionCallback;
    let directionNmber = 1;
    if(letterAmount * letterSize > elementWidth) {
        conditionCallback = (trialFontSize) => 
            letterAmount * Math.round(trialFontSize * FONT_SIZE_COEF) > elementWidth && trialFontSize > 6;

        directionNmber = -1;
    } 
    else if (elementFontSize < initialFontValue) {
        conditionCallback = (trialFontSize) => {
            return letterAmount * Math.round(trialFontSize * FONT_SIZE_COEF) < elementWidth && trialFontSize < initialFontValue
        }
    }

    if (conditionCallback) {
        element.style.fontSize = calculateFont(elementFontSize, conditionCallback, directionNmber);
    }
}

