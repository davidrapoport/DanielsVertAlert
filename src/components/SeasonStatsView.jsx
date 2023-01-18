import { View, Text, SectionList, StyleSheet, ScrollView, ActivityIndicator } from "react-native";
import { PieChart } from 'react-native-svg-charts'
import { Rect, Svg } from 'react-native-svg'
import {
    getCurrentStreak,
    getBestStreak,
    getFastestCollinsLap,
    getBiggestDay,
    getNumRestDays,
    sortAscending,
    getVertLastSevenDays,
    getVertSinceMonday
} from "../RideUtils";


const getColorFromLift = name => {
    const liftToColor = {
        'Collins': '#0E1FE9',
        'Wildcat': '#F31705',
        'Sugarloaf': '#61C925',
        'Supreme': '#1D1D1D',
        'Sunnyside': '#E9F809',
        'Albion': '#09F8DF',
        'Collins Angle': '#F809C9'
    }
    if (name in liftToColor) {
        return liftToColor[name];
    }
    // Default for any weird lift I may not have remembered.
    return '#636363';
}

// Format of ridesData [{date, totalVert, rides[]}]
const SeasonStatsView = ({ ridesData, refreshControl }) => {
    if (!ridesData) {
        return <ActivityIndicator size={'large'} />;
    }
    ridesData = sortAscending(ridesData);
    const flattenedRides = [];
    ridesData.forEach(
        daysRides => daysRides.rides.forEach(
            ride => flattenedRides.push(ride)));
    const numRidesPerLift = {};
    flattenedRides.forEach(ride => {
        if (!(ride.lift in numRidesPerLift)) {
            numRidesPerLift[ride.lift] = 0;
        }
        numRidesPerLift[ride.lift] += 1;
    })

    return (
        <ScrollView style={styles.statsViewContainer} refreshControl={refreshControl}>
            <Text style={styles.h1}>
                Season Stats
            </Text>
            <SummaryTable ridesData={ridesData} numRidesPerLift={numRidesPerLift} />
            <RideStatsPieChart numRidesPerLift={numRidesPerLift} />
            <LiftBreakdownTable numRidesPerLift={numRidesPerLift} />
        </ScrollView>
    )
};

const SummaryTable = ({ ridesData, numRidesPerLift }) => {
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

const LiftBreakdownTable = ({ numRidesPerLift }) => {
    const totalLaps = Object.values(numRidesPerLift).reduce((prev, acc) => prev + acc);
    const tableRows = [];
    for (const lift in numRidesPerLift) {
        tableRows.push(
            <View style={styles.tr} key={`SeasonLiftBreakdownTableRow-${lift}`}>
                <Text style={styles.td}>{lift}</Text>
                <Text style={styles.td}>{numRidesPerLift[lift]}</Text>
                <Text style={styles.td}>
                    {Math.round((numRidesPerLift[lift] / totalLaps) * 100)}%
                </Text>
            </View>)
    }

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.h2}>
                You better not be skiing Supreme
            </Text>
            <ScrollView style={styles.table}>
                <View style={styles.tr}>
                    <Text style={styles.th}>Lift Name</Text>
                    <Text style={styles.th}>Number of Laps</Text>
                    <Text style={styles.th}>Percentage</Text>
                </View>
                {tableRows}
            </ScrollView>
        </ScrollView>
    )
};

const RideStatsPieChart = ({ numRidesPerLift }) => {
    const pieChartData = [];
    for (const lift in numRidesPerLift) {
        pieChartData.push({
            key: lift,
            amount: numRidesPerLift[lift],
            svg: { fill: getColorFromLift(lift) }
        });
    }
    const labels = [];
    for (lift in numRidesPerLift) {
        labels.push(
            <View style={styles.labelContainer} key={`labelForSeasonPieChart-${lift}`}>
                <Text style={styles.labelText}>{lift}</Text>
                <Svg width="50" height="20">
                    <Rect
                        x="0"
                        y="5"
                        width="50"
                        height="15"
                        fill={getColorFromLift(lift)}
                        strokeWidth="3"
                        stroke="rgb(0,0,0)"
                    />
                </Svg>
            </View>);
    }

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.h2}>Are you skiing Collins enough?</Text>
            <View style={styles.labels}>{labels}</View>
            <PieChart
                style={{ height: 200 }}
                valueAccessor={({ item }) => item.amount}
                data={pieChartData}
                spacing={0}
                outerRadius={'95%'}
                innerRadius={'33%'}
                padAngle={0}
            >
            </PieChart >
        </ScrollView>
    )
};

const styles = StyleSheet.create({
    statsViewContainer: {
        flex: 1,
        paddingTop: 22,
        marginLeft: 8,
        marginRight: 8,
    },
    container: {
        flex: 1,
        paddingTop: 22
    },
    h1: {
        fontSize: 36,
        paddingBottom: 2,
        fontWeight: 'bold',
    },
    h2: {
        fontSize: 28,
        paddingBottom: 2,
        fontWeight: 'bold',
    },
    summaryText: {
        fontSize: 18,
    },
    labels: {
        paddingTop: 8,
        paddingBottom: 16,
    },
    labelContainer: {
        flex: 1,
        alignItems: "stretch",
        justifyContent: "flex-start",
        flexDirection: "row",
    },
    labelText: {
        paddingRight: 20,
        fontSize: 16,
        fontWeight: 'bold',
        width: '50%',
    },
    tableText: {
        textAlign: "center"
    },
    td: {
        borderWidth: 1,
        flex: 1,
        padding: 4,
    },
    th: {
        borderWidth: 1,
        flex: 1,
        fontWeight: 'bold',
        padding: 4,
    },
    tr: {
        flexDirection: "row",
    },
    table: {
        marginBottom: 24,
        paddingBottom: 24,
        marginTop: 24,
    },
});

export default SeasonStatsView;
