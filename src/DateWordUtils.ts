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

export function todayFromTimeString(
    now: Date,
    timeString: string,
): Date | null {
    const [hour, minute] = timeString.split(':');

    if (hour && minute) {
        let parsedHour = parseInt(hour, 10);
        const parsedMinute = parseInt(minute, 10);

        if (!Number.isNaN(parsedHour) && !Number.isNaN(parsedMinute)) {
            // Account for PM (there are no classes before 8 am or after 8 pm)
            if (parsedHour < 8) parsedHour += 12;

            const date = new Date(now);
            date.setHours(parsedHour);
            date.setMinutes(parsedMinute);
            date.setSeconds(0);

            return date;
        }
        return null;
    }
    return null;
}

export function timeStringToMinRep(timeString: string): number {
    if (!timeString) return 0;

    const [hour, minute] = timeString.split(':');

    if (hour && minute) {
        const parsedHour = parseInt(hour, 10);
        const parsedMinute = parseInt(minute, 10);

        if (!Number.isNaN(parsedHour) && !Number.isNaN(parsedMinute)) {
            return parsedHour * 60 + parsedMinute;
        }
        return 0;
    }

    return 0;
}

export function timeBetweenTimeStrings(
    start: string,
    end: string,
): number | null {
    const [startHour, startMinute] = start.split(':');
    const [endHour, endMinute] = end.split(':');

    if (startHour && startMinute && endHour && endMinute) {
        const parsedStartHour = parseInt(startHour, 10);
        const parsedStartMinutes = parseInt(startMinute, 10);
        const parsedEndHour = parseInt(endHour, 10);
        const parsedEndMinutes = parseInt(endMinute, 10);

        if (
            !Number.isNaN(parsedStartHour) &&
            !Number.isNaN(parsedStartMinutes) &&
            !Number.isNaN(parsedEndHour) &&
            !Number.isNaN(parsedEndMinutes)
        ) {
            // // Account for PM (there are no classes before 8 am or after 8 pm)
            // if (parsedStartHour < 8) parsedStartHour += 12;
            // if (parsedEndHour < 8) parsedEndHour += 12;

            const minutesStart = parsedStartHour * 60 + parsedStartMinutes;
            const minutesEnd = parsedEndHour * 60 + parsedEndMinutes;

            return minutesEnd - minutesStart;
        }
        return null;
    }
    return null;
}

export function sortTimeStrings(
    timeStrings: string[],
    ascending: boolean,
): string[] {
    return timeStrings.sort((a, b) => {
        // check for no undefineds
        // nulls sort after anything else
        if (a === undefined) {
            return 1;
        }
        if (b === undefined) {
            return -1;
        }

        const timeDiffA = timeBetweenTimeStrings('00:00', a);
        const timeDiffB = timeBetweenTimeStrings('00:00', b);

        // equal items sort equally
        if (timeDiffA === timeDiffB) {
            return 0;
        }
        // nulls sort after anything else
        if (timeDiffA === null) {
            return 1;
        }
        if (timeDiffB === null) {
            return -1;
        }

        if (ascending) {
            return timeDiffA > timeDiffB ? 1 : -1;
        }

        // descending
        return timeDiffA < timeDiffB ? 1 : -1;
    });
}

export function toPrettyTime(uglyTime: string): string {
    const [hour, minute] = uglyTime.split(':');

    if (hour && minute) {
        const parsedHour = parseInt(hour, 10);
        const parsedMinute = parseInt(minute, 10);

        if (!Number.isNaN(parsedHour) && !Number.isNaN(parsedMinute)) {
            return `${parsedHour > 12 ? parsedHour - 12 : parsedHour}:${
                parsedMinute < 10 ? `0${parsedMinute}` : parsedMinute
            }`;
        }
        return uglyTime;
    }

    // on errors, just return the original one
    return uglyTime;
    // return null;

    // const [hour, minute] = uglyTime.split(':');
    // return `${parseInt(hour, 10)}:${minute}`;
}

export function toTimeString(time: number): string {
    const hour = Math.floor(time / 60);
    const minute = time - hour * 60;

    return `${hour > 12 ? hour - 12 : hour}:${
        minute < 10 ? `0${minute}` : minute
    }`;
}

export const BlockNameRegex =
    /((([A-G]|(W[Ii][Nn])|(A[Dd][Vv][Ii][Ss][Oo][Rr][Yy])|(L[Ii][Oo][Nn]))|(\b([A-Ga-g]|([Ww][Ii][Nn])|([Aa][Dd][Vv][Ii][Ss][Oo][Rr][Yy])|([Ll][Ii][Oo][Nn]))))[1-3]?)(( |-)?[Bb][Ll][Oo][Cc][Kk]([Ss])?)?(?![H-Za-z])/;
