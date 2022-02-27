export const isSameDay = (first: Date, second: Date) =>
    first.getFullYear() === second.getFullYear() &&
    first.getMonth() === second.getMonth() &&
    first.getDate() === second.getDate();

export const DayMappings = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
];

export const MonthMappings = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
];

export function dateFormatter(date: Date): string {
    const weekday = DayMappings[date.getDay()];
    const month = MonthMappings[date.getMonth()];
    const day = date.getDate();

    return `${weekday}, ${month} ${day}`;
}

export function timeOfDay(date: Date): string[] {
    const hour = date.getHours();
    if (hour >= 18) {
        return ['evening', '🌃'];
    }
    if (hour >= 16) {
        return ['evening', '🌇'];
    }
    if (hour >= 12) {
        return ['afternoon', '☀️'];
    }
    if (hour >= 7) {
        return ['morning', '☀️'];
    }
    return ['morning', '🌅'];
}

// Convert numbers to words
// System for American Numbering
const thVal = ['', 'thousand', 'million', 'billion', 'trillion'];
// System for uncomment this line for Number of English
// var th_val = ['','thousand','million', 'milliard','billion'];

const dgVal = [
    'zero',
    'one',
    'two',
    'three',
    'four',
    'five',
    'six',
    'seven',
    'eight',
    'nine',
];
const tnVal = [
    'ten',
    'eleven',
    'twelve',
    'thirteen',
    'fourteen',
    'fifteen',
    'sixteen',
    'seventeen',
    'eighteen',
    'nineteen',
];
const twVal = [
    'twenty',
    'thirty',
    'forty',
    'fifty',
    'sixty',
    'seventy',
    'eighty',
    'ninety',
];
export function toWords(n: number): string {
    let s = n.toString();
    s = s.replace(/[, ]/g, '');
    if (s !== parseFloat(s).toString()) return 'not a number ';
    let xVal = s.indexOf('.');
    if (xVal === -1) xVal = s.length;
    if (xVal > 15) return 'too big';
    const nVal = s.split('');
    let strVal = '';
    let skVal = 0;
    for (let i = 0; i < xVal; i += 1) {
        if ((xVal - i) % 3 === 2) {
            if (nVal[i] === '1') {
                strVal += `${tnVal[Number(nVal[i + 1])]} `;
                i += 1;
                skVal = 1;
            } else if (nVal[i] !== '0') {
                strVal += `${twVal[parseInt(nVal[i], 10) - 2]} `;
                skVal = 1;
            }
        } else if (nVal[i] !== '0') {
            strVal += `${dgVal[parseInt(nVal[i], 10)]} `;
            if ((xVal - i) % 3 === 0) strVal += 'hundred ';
            skVal = 1;
        }
        if ((xVal - i) % 3 === 1) {
            if (skVal) strVal += `${thVal[(xVal - i - 1) / 3]} `;
            skVal = 0;
        }
    }
    if (xVal !== s.length) {
        const yVal = s.length;
        strVal += 'point ';
        for (let i = xVal + 1; i < yVal; i += 1) {
            strVal += `${dgVal[parseInt(nVal[i], 10)]} `;
        }
    }
    return strVal.replace(/\s+/g, ' ');
}

export const formatISODate = (date: Date): string => {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();

    return `${year}-${month < 10 ? `0${month}` : month}-${
        day < 10 ? `0${day}` : day
    }`;
};
