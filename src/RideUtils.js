import { differenceInDays } from "date-fns";

export const getFastestCollinsLap = ridesData => {
    const MAX_TIME_SEC = 60 * 60 * 24;
    let fastestDate = "";
    let fastestTime = MAX_TIME_SEC;
    ridesData.forEach(({ date, totalVert, rides }) => {
        if (rides.length < 1) {
            return;
        }
        for (let i = 1; i < rides.length; i++) {
            if (rides[i].lift === 'Collins' && rides[i - 1].lift === 'Collins') {
                const time1 = new Date('1970-01-01T' + rides[i].time).getTime();
                const time2 = new Date('1970-01-01T' + rides[i - 1].time).getTime();
                const diff_sec = (time1 - time2) / 1000;
                if (diff_sec < fastestTime) {
                    fastestTime = diff_sec;
                    fastestDate = date;
                }
            }
        }
    });
    if (fastestTime === MAX_TIME_SEC) {
        return null;
    }
    const fastestTimeString = `${Math.floor(fastestTime / 60)} minutes and ${fastestTime % 60} seconds`;
    return { 'fastestTime': fastestTimeString, 'fastestDate': fastestDate }
}

const sortByDate = (ridesData, sortAscending) => {
    ridesData.sort((a, b) => {
        if (a.date < b.date) {
            return sortAscending ? -1 : 1;
        } else if (b.date < a.date) {
            return sortAscending ? 1 : -1;
        }
    })
    return ridesData;
}

export const sortAscending = ridesData => sortByDate(ridesData, true);
export const sortDescending = ridesData => sortByDate(ridesData, false);


export const getNumRestDays = ridesData => {
    ridesData = sortAscending(ridesData);
    let restDays = 0;
    let lastSkiDay = new Date(ridesData[0].date);
    for (let i = 1; i < ridesData.length; i++) {
        let currentDay = new Date(ridesData[i].date);
        restDays += (differenceInDays(currentDay, lastSkiDay) - 1);
        lastSkiDay = currentDay;
    }
    return restDays;
}

export const getBestStreak = ridesData => {
    ridesData = sortAscending(ridesData);
    let bestStreak = 1;
    let currentStreak = 0;
    for (let i = 1; i < ridesData.length; i++) {
        let currentDay = new Date(ridesData[i].date);
        let lastSkiDay = new Date(ridesData[i - 1].date);
        if (differenceInDays(currentDay, lastSkiDay) === 1) {
            currentStreak++;
        } else {
            if (currentStreak > bestStreak) {
                bestStreak = currentStreak;
            }
            currentStreak = 0;
        }
    }
    return bestStreak;
}

export const getCurrentStreak = ridesData => {
    ridesData = sortDescending(ridesData);
    const today = new Date();
    let lastSkiDay = new Date(ridesData[0].date);
    if (differenceInDays(today, lastSkiDay) > 2) {
        return 0;
    }
    let currentStreak = 1;
    for (let i = 1; i < ridesData.length; i++) {
        let currentDay = new Date(ridesData[i].date);
        lastSkiDay = new Date(ridesData[i - 1].date);
        if (differenceInDays(lastSkiDay, currentDay) === 1) {
            currentStreak++;
        } else {
            break;
        }
    }
    return currentStreak;
}

export const getCurrentDateInFormat = () => {
    const date = new Date();
    return (dateString = new Date(date.getTime() - date.getTimezoneOffset() * 60000)
        .toISOString()
        .split('T')[0]);
};