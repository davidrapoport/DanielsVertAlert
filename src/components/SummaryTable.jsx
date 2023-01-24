import { View, Text, StyleSheet } from "react-native";

import { material } from "react-native-typography";
import {
    getCurrentStreak,
    getBestStreak,
    getFastestCollinsLap,
    getBiggestDay,
    getNumRestDays,
    getVertLastSevenDays,
    getVertSinceMonday,
    getNumRidesPerLift,
    getMeanVert,
    getMedianVert
} from "../RideUtils";

const SummaryTable = ({ ridesData }) => {
    const numRidesPerLift = getNumRidesPerLift(ridesData);
    const seasonVert = ridesData.reduce((acc,
        { totalVert }) => { return acc + totalVert }, 0);
    const numLaps = Object.values(numRidesPerLift).reduce(
        (acc, laps) => { return acc + laps }, 0);
    const numMidloads = 'Collins Angle' in numRidesPerLift ? numRidesPerLift['Collins Angle'] : 0;
    const fastestCollinsTime = getFastestCollinsLap(ridesData);
    const biggestDay = getBiggestDay(ridesData);
    const labelsValues = [
        ['Laps:', numLaps],
        ['Total Vert:', seasonVert.toLocaleString() + ' feet'],
        ['Days Skied:', ridesData.length],
        ['Rest Days:', getNumRestDays(ridesData)],
        ['Current Ski Streak:', getCurrentStreak(ridesData) + ' day(s)'],
        ['Best Streak:', getBestStreak(ridesData) + ' day(s)'],
        ['Vert Last 7 Days:', getVertLastSevenDays(ridesData) + ' feet'],
        ['Vert Since Monday:', getVertSinceMonday(ridesData) + ' feet'],
        ['Average daily vert:', getMeanVert(ridesData).toLocaleString() + ' feet'],
        ['Median daily vert:', getMedianVert(ridesData).toLocaleString() + ' feet'],
        ["Times You've Cucked:", numMidloads],
        ["Biggest Day:", biggestDay.vert.toLocaleString() + ' feet'],
        ["Date of Biggest Day:", biggestDay.date],
    ];
    if (fastestCollinsTime) {
        labelsValues.push(['Fastest Collins Lap:', fastestCollinsTime.fastestTime]);
        labelsValues.push(['Date of Fastest Collins Lap:', fastestCollinsTime.fastestDate]);
    }

    return (
        <View>
            <Text style={styles.h2}>
                At a glance
            </Text>
            <View style={{ flexDirection: 'column' }}>
                {labelsValues.map(labelValue => {
                    return (
                        <View style={styles.tr} key={labelValue[0]}>
                            <Text style={{ marginRight: 12, fontWeight: 'bold' }}>{labelValue[0]} </Text>
                            <Text>{labelValue[1]} </Text>
                        </View>)
                })}
            </View>
        </View >)
}

const styles = StyleSheet.create({
    h2: {
        paddingBottom: 12,
        ...material.headline,
    },
    tr: {
        flexDirection: "row",
    },
});

export default SummaryTable