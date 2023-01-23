import { differenceInDays, isAfter, isMonday, isSameDay, subDays } from "date-fns";

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

export const getBiggestDay = (ridesData) => {
    ridesData.sort((a, b) => {
        if (a.totalVert < b.totalVert) {
            return 1;
        } else if (a.totalVert > b.totalVert) {
            return -1;
        }
    });
    return { vert: ridesData[0].totalVert, date: ridesData[0].date };
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

// Since we don't need to compare with local time, we can just 
// use UTC dates to compare here.
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

// Use local dates here since we want to see if the day has ended.
// And if we mix local dates and UTC dates we'll get some off by one errors.
export const getCurrentStreak = ridesData => {
    ridesData = sortDescending(ridesData);
    const today = getCurrentDateAlta();
    let excludeTodayIfMissing = true;
    if (today.getHours() >= 16 || (today.getHours() === 16 && today.getMinutes() > 30)) {
        excludeTodayIfMissing = false;
    }
    let lastSkiDay = convertStringToLocalDate(ridesData[0].date);
    if (differenceInDays(today, lastSkiDay) >= 2) {
        return 0;
    }
    if (differenceInDays(today, lastSkiDay) === 1 && !excludeTodayIfMissing) {
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

export const getVertLastSevenDays = ridesData => {
    ridesData = sortDescending(ridesData);
    const today = getCurrentDateAlta();
    const sevenDaysAgo = subDays(today, 7);
    let totalVert = 0;
    let i = 0;
    let currentDay = convertStringToLocalDate(ridesData[i].date);
    while (isAfter(currentDay, sevenDaysAgo) && i < ridesData.length) {
        totalVert += ridesData[i].totalVert;
        i++;
        currentDay = convertStringToLocalDate(ridesData[i].date);
    }
    return totalVert;
}

export const getVertSinceMonday = ridesData => {
    ridesData = sortDescending(ridesData);
    let lastMonday = getCurrentDateAlta();
    console.log(lastMonday);
    while (!isMonday(lastMonday)) {
        lastMonday = subDays(lastMonday, 1);
    }
    console.log(lastMonday);
    let totalVert = 0;
    let i = 0;
    let currentDay = convertStringToLocalDate(ridesData[i].date);
    while (i < ridesData.length &&
        (isAfter(currentDay, lastMonday) || isSameDay(currentDay, lastMonday))) {
        totalVert += ridesData[i].totalVert;
        i++;
        currentDay = convertStringToLocalDate(ridesData[i].date);
    }
    console.log(ridesData[i].date);
    return totalVert;
}

export const getCurrentDateInFormat = () => {
    const date = new Date();
    const dateString = new Date(date.getTime() - date.getTimezoneOffset() * 60000)
        .toISOString()
        .split('T')[0];
    return dateString;
};

export const getCurrentDateAlta = () => {
    return new Date();
};

export const convertStringToLocalDate = (stringDate) => {
    const date = new Date(stringDate);
    return new Date(date.getTime() + date.getTimezoneOffset() * 60000);
}