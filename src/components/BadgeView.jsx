import { View, Text } from "react-native";
import { material } from "react-native-typography";
import Ionicons from 'react-native-vector-icons/Ionicons';
import { GlobalStyles } from "../GlobalStyles";
import { getBestStreak, getBiggestDay, getFastestCollinsLap, getNumRidesPerLift } from "../RideUtils";

const ICON_SIZE = 32
const GOLD_BADGE = <Ionicons name='shield-checkmark' size={ICON_SIZE} color={'#C9B037'} />;
const SILVER_BADGE = <Ionicons name='shield-checkmark' size={ICON_SIZE} color={'#B4B4B4'} />;
const BRONZE_BADGE = <Ionicons name='shield-checkmark' size={ICON_SIZE} color={'#6A3805'} />;
const BADGES = [BRONZE_BADGE, SILVER_BADGE, GOLD_BADGE];

const pluralize = (value) => value === 1 ? '' : 's';
const secToString = sec => {
    const min = Math.floor(sec / 60);
    const remain = sec % 60;
    if (remain === 0) {
        return `${min} minute` + pluralize(min);
    }
    return `${min} minute${pluralize(min)} and ${remain} second${pluralize(remain)}`;
}
const GOALS = [
    {
        title: 'Biggest Day',
        key: 'DailyVert',
        checkPoints: [20000, 35000, 52000],
        toString: (value) => value.toLocaleString() + ' feet'
    },
    {
        title: 'Longest Streak',
        key: 'Streak',
        checkPoints: [5, 15, 35],
        toString: (value) => value + ' day' + pluralize(value)
    },
    {
        title: 'Midloads',
        key: 'Midloads',
        checkPoints: [4, 20, 69],
        toString: (value) => value + ' time' + pluralize(value)
    },
    {
        title: 'Fastest Collins Lap',
        key: 'FastestLap',
        checkPoints: [13 * 60, 11 * 60, 10 * 60],
        toString: secToString
    },
    {
        title: 'Collins Percentage',
        key: 'CollinsPercent',
        checkPoints: [0.9, 0.95, 0.99],
        toString: (value) => Math.floor(value * 100) + '%'
    }
]

function compareGT(a, b) {
    return a >= b;
}

function compareLT(a, b) {
    return a <= b;
}

function generateBadges(ridesData) {
    const badges = []
    GOALS.forEach(({ title, key, checkPoints, toString }) => {
        let value;
        // Sometimes we want to compare lt, sometimes gt
        let comparator;
        const numRidesPerLift = getNumRidesPerLift(ridesData);
        if (key === 'DailyVert') {
            value = getBiggestDay(ridesData).vert;
            comparator = compareGT;
        }
        if (key === 'Streak') {
            value = getBestStreak(ridesData);
            comparator = compareGT;
        }
        if (key === 'Midloads') {
            if (!('Collins Angle' in numRidesPerLift)) {
                return;
            }
            value = numRidesPerLift['Collins Angle'];
            comparator = compareGT;
        }
        if (key === 'FastestLap') {
            const fastestCollins = getFastestCollinsLap(ridesData);
            if (!fastestCollins) {
                return;
            }
            value = fastestCollins.fastestTimeSec;
            comparator = compareLT;
        }
        if (key === 'CollinsPercent') {
            const numLaps = Object.values(numRidesPerLift).reduce(
                (acc, laps) => { return acc + laps }, 0);
            const numCollins = 'Collins' in numRidesPerLift ? numRidesPerLift['Collins'] : 0;
            value = numCollins / numLaps;
            comparator = compareGT;
        }
        badges.push(<BadgeView title={title}
            value={value}
            comparator={comparator}
            checkPoints={checkPoints}
            toString={toString}
            key={key} />)
    });
    return badges;
}

function BadgeView({ title, value, comparator, checkPoints, toString }) {
    let i = 0;
    while (i < 3 && comparator(value, checkPoints[i])) {
        i++;
    }
    let text;
    let badge;
    if (i === 0) {
        text = `You're at ${toString(value)}, get to ${toString(checkPoints[0])} to get your first badge`
    }
    else if (i === 3) {
        badge = GOLD_BADGE;
        text = `Congrats! You're at ${toString(value)}! You'd make Evs proud`
    } else {
        badge = BADGES[i - 1];
        const next = i === 1 ? 'silver.' : 'gold.';
        text = `You're at ${toString(value)}, get to ${toString(checkPoints[i])} to level up to ` + next;
    }
    return (
        <View style={{
            ...GlobalStyles.bubble,
            backgroundColor: 'white',
            flexDirection: 'column',
            flexWrap: 'nowrap',
            flex: 1,
        }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 }}>
                <Text style={GlobalStyles.h2}>{title}</Text>
                {badge && <Text style={{ flexShrink: 1 }}> {badge} </Text>}
            </View>
            <View>
                <Text style={{ flexWrap: 'wrap', flex: 1, ...material.subheading }}>{text}</Text>
            </View>
        </View>
    )

}

function BadgesView({ ridesData }) {
    return <View style={{ paddingBottom: 16 }}>{generateBadges(ridesData)}</View>;
}

export default BadgesView;
