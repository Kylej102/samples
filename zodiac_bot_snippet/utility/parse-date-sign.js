const logger = require('./log.js');
const signDates = require('./gregorian-map');

const DateParser = () => {
    const CAPRICORN_EDGE = 2001;
    const YEAR = 2000;
    const DEFAULT_ERROR = 'Please try entering a valid sign or date **<mm/dd>**';

    /**
     * Assumes the indices are sorted from Aquarius -> Capricorn
     * @param dateOrSign
     * @returns {{success: boolean, errorMessage: string, index: number}}
     */
    const getSignIndex = (dateOrSign) => {
        let result = {
            success: true,
            index: 0,
            sign: '',
            errorMessage: DEFAULT_ERROR
        };

        dateOrSign = dateOrSign.toLowerCase();
        const matchingSigns = firstMatchingKey(Object.keys(signDates), dateOrSign);

        if (matchingSigns !== null) {
            logger.debug('Found date by sign');
            const foundSign = matchingSigns;

            result.index = signDates[foundSign].index;
            result.sign = foundSign;

            return result;
        }

        if (dateOrSign.includes('/')) {
            const date = getDate(dateOrSign, result);

            if (!result.success) {
                return result;
            }

            result.index = findIndex(date, result);
            return result;
        }

        result.success = false;
        return result;
    };

    function firstMatchingKey(keys, input) {
        let result = null;
        let uniqueCharacters = 3;

        while (uniqueCharacters > 0) {
            const foundKeys = keys.filter(element =>
                input.startsWith(element.substr(0, -1 * uniqueCharacters + 4))
            );

            if (foundKeys.length === 0) {
                return result;
            }

            result = foundKeys[0];

            if (foundKeys.length === 1) {
                return result;
            }

            uniqueCharacters--;
        }
    }

    function getDate(arg, result) {
        const argsParse = arg.split('/');
        const month = parseInt(argsParse[0]);
        const day = parseInt(argsParse[1]);

        if (isNaN(month)|| isNaN(day) || month < 1 || month > 12 || day < 1 || day > 31) {
            logger.debug('Could not parse date');

            let extendedResponse = [DEFAULT_ERROR];
            if (isNaN(month)|| isNaN(day)) {
                extendedResponse.push('I\'m expecting a number for the month or day!');
            }

            if (month < 1 || month > 12) {
                extendedResponse.push('I\'m expecting a month between **1** and **12**! You entered a **' + month + '**');
            }

            if (day < 1 || day > 31) {
                extendedResponse.push('I\'m expecting a day between **1** and **31**! You entered a **' + day + '**');
            }

            result.success = false;
            result.errorMessage = extendedResponse.join('\n• ');
            return;
        }

        return new Date(getYear(month, day), month - 1, day);
    }

    function findIndex(date, result) {
        if (date.getFullYear() === CAPRICORN_EDGE) {
            result.sign = 'capricorn';
            return signDates.capricorn.index;
        }

        for (let [key, value] of Object.entries(signDates)) {
            const startDate = new Date(YEAR, value.startMonth - 1, value.startDay);
            const endDate = new Date(getYear(value.endMonth, value.endDay), value.endMonth - 1, value.endDay);

            if (date.getTime() >= startDate.getTime() && date.getTime() <= endDate.getTime()) {
                result.sign = key;
                return value.index;
            }
        }
    }

    function getYear(month, day) {
        return (month === 1 && day <= 19) ? CAPRICORN_EDGE : YEAR;
    }

    return {
        getSignIndex
    }
};

module.exports = DateParser();