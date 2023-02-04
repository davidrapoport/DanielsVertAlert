import { View, Text, StyleSheet } from "react-native";

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
    getMedianVert,
    getBirdLaps,
} from "../RideUtils";
import { GlobalStyles } from "../GlobalStyles";
import { material } from "react-native-typography";
import { getSnowbirdLifts } from "../SnowbirdUtils";

const SummaryTable = ({ ridesData }) => {
    const numRidesPerLift = getNumRidesPerLift(ridesData);
    const seasonVert = ridesData.reduce((acc,
        { totalVert }) => { return acc + totalVert }, 0);
    const numLaps = Object.values(numRidesPerLift).reduce(
        (acc, laps) => { return acc + laps }, 0);
    const numMidloads = 'Collins Angle' in numRidesPerLift ? numRidesPerLift['Collins Angle'] : 0;
    const fastestCollinsTime = getFastestCollinsLap(ridesData);
    const birdLaps = getBirdLaps(ridesData);
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
    let disclaimer;
    if (birdLaps) {
        labelsValues.splice(2, 0, ['SnowBird Laps *', birdLaps.numLaps]);
        labelsValues.splice(3, 0, ['SnowBird Vert *', birdLaps.vert.toLocaleString() + ' feet']);
        const birdLifts = getSnowbirdLifts();
        const birdLiftsString = birdLifts.slice(0, -1).join(", ") + ', and ' + birdLifts.slice(-1);
        disclaimer = (
            <Text style={{ ...material.subheading, flexWrap: 'wrap', paddingTop: 12 }}>
                * Unfortunately at Snowbird only {birdLiftsString} report their scans so
                your vert data may be incomplete.
            </Text>);
    }

    return (
        <View style={{ ...styles.container, paddingBottom: 16, }}>
            <View style={{ flexDirection: 'row' }}>
                <Text style={GlobalStyles.h1}>
                    Your Season Stats
                </Text>
            </View>
            <View style={{ flexDirection: 'column' }}>
                {labelsValues.map(labelValue => {
                    return (
                        <View style={GlobalStyles.bubble} key={labelValue[0]}>
                            <Text style={{ marginRight: 12, fontWeight: 'bold', color: 'white' }}>{labelValue[0]} </Text>
                            <Text style={{ color: 'white' }}>{labelValue[1]} </Text>
                        </View>)
                })}
                {disclaimer}
            </View>
        </View >)
}

const styles = StyleSheet.create({
    container: {
        marginTop: 16,
        paddingTop: 16,
        borderTopColor: 'black',
        borderTopWidth: 1,
    },
});

export default SummaryTable