const ParseDate = require('./../utility/parse-date-sign');

const DEFAULT_ERROR = 'Please try entering a valid sign or date **<mm/dd>**';
const DEFAULT_INDEX = 0;
const DEFAULT_SIGN = '';


function parseHelp(input, success, index, sign, error) {
    let result = ParseDate.getSignIndex(input);
    expect(result.success).toBe(success);
    if (index !== undefined) {
        expect(result.index).toBe(index);
    }
    if (sign !== undefined) {
        expect(result.sign).toBe(sign);
    }
    if (error !== undefined) {
        expect(result.errorMessage).toBe(error);
    }
}

test('Empty input', () => {
    parseHelp('', false);
});

test('Case insensitive lowercase', () => {
    parseHelp('cancer', true, 5, 'cancer');
});

test('Case insensitive capital start', () => {
    parseHelp('Cancer', true, 5, 'cancer');
});

test('Case insensitive non-capital start', () => {
    parseHelp('cANCER', true, 5, 'cancer');
});

test('Case insensitive all caps', () => {
    parseHelp('CANCER', true, 5, 'cancer');
});

test('Single digit month', () => {
    parseHelp('5/12', true, 3, 'taurus');
});

test('Double digit month', () => {
    parseHelp('12/15', true, 10, 'sagittarius');
});

test('Double digit month 0 lead', () => {
    parseHelp('05/12', true, 3, 'taurus');
});

test('Month with double 0 lead', () => {
    parseHelp('005/12', true, 3, 'taurus');
});

test('Single digit day', () => {
    parseHelp('5/2', true, 3, 'taurus');
});

test('Double digit day', () => {
    parseHelp('1/12', true, 11, 'capricorn');
});

test('Double digit day 0 lead', () => {
    parseHelp('5/01', true, 3, 'taurus');
});

test('31 day month', () => {
    parseHelp('12/31', true, 11, 'capricorn');
});

test('30 day month', () => {
    parseHelp('12/30', true, 11, 'capricorn');
});

test('No month and day entry', () => {
    parseHelp('/', false, DEFAULT_INDEX, DEFAULT_SIGN,
        DEFAULT_ERROR + '\n• I\'m expecting a number for the month or day!');
});

test('No month entry', () => {
    parseHelp('/15', false, DEFAULT_INDEX, DEFAULT_SIGN,
        DEFAULT_ERROR + '\n• I\'m expecting a number for the month or day!');
});

test('No day entry', () => {
    parseHelp('3/', false, DEFAULT_INDEX, DEFAULT_SIGN,
        DEFAULT_ERROR + '\n• I\'m expecting a number for the month or day!');
});

test('0 month entry', () => {
    parseHelp('0/15', false, DEFAULT_INDEX, DEFAULT_SIGN,
        DEFAULT_ERROR + '\n• I\'m expecting a month between **1** and **12**! You entered a **0**');
});

test('0 day entry', () => {
    parseHelp('10/0', false, DEFAULT_INDEX, DEFAULT_SIGN,
        DEFAULT_ERROR + '\n• I\'m expecting a day between **1** and **31**! You entered a **0**');
});

test('Negative month', () => {
    parseHelp('-1/1', false, DEFAULT_INDEX, DEFAULT_SIGN,
        DEFAULT_ERROR + '\n• I\'m expecting a month between **1** and **12**! You entered a **-1**');
});

test('Negative day', () => {
    parseHelp('1/-5', false, DEFAULT_INDEX, DEFAULT_SIGN,
        DEFAULT_ERROR + '\n• I\'m expecting a day between **1** and **31**! You entered a **-5**');
});

test('Past max day', () => {
    parseHelp('1/32', false, DEFAULT_INDEX, DEFAULT_SIGN,
        DEFAULT_ERROR + '\n• I\'m expecting a day between **1** and **31**! You entered a **32**');
});

test('Past max month', () => {
    parseHelp('13/1', false, DEFAULT_INDEX, DEFAULT_SIGN,
        DEFAULT_ERROR + '\n• I\'m expecting a month between **1** and **12**! You entered a **13**');
});

test('Predicted typing sign', () => {
    parseHelp('Canc', true, 5, 'cancer');
});

test('Predicted typing sign with extra', () => {
    parseHelp('cancerWithExtra', true, 5, 'cancer');
});

test('Predicted extra with typo', () => {
    parseHelp('canoit', true, 5, 'cancer');
});

test('Multiple possible results outputs first result alphabetically', () => {
    parseHelp('can', true, 5, 'cancer');
});

test('Too little characters returns first result alphabetically', () => {
    parseHelp('a', true, 0, 'aquarius');
});

test('Typo with multiple results is first result alphabetically', () => {
    parseHelp('ca', true, 5, 'cancer');
});

test('Non sign character returns error', () => {
    parseHelp('q', false, DEFAULT_INDEX, DEFAULT_SIGN, DEFAULT_ERROR);
});