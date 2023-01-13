import { View, Text, SectionList, StyleSheet, ScrollView } from "react-native";
import { PieChart } from 'react-native-svg-charts'
import { Rect, Svg } from 'react-native-svg'


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

const getFastestCollinsLap = ridesData => {
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

// Format of ridesData [{date, totalVert, rides[]}]
const SeasonStatsView = ({ ridesData, refreshControl }) => {
    // Sort in ascending order.
    ridesData.sort((a, b) => {
        if (a.date < b.date) {
            return -1;
        }
    })

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

    const seasonVert = ridesData.reduce((acc, { totalVert }) => { return acc + totalVert }, 0);
    const numMidloads = 'Collins Angle' in numRidesPerLift ? numRidesPerLift['Collins Angle'] : 0;
    let midloadPlural = numMidloads === 1 ? 'time' : 'times';
    const fastestCollinsTime = getFastestCollinsLap(ridesData);
    let fastestCollinsString;
    if (fastestCollinsTime) {
        fastestCollinsString = 'Your fastest collins lap was '
            + fastestCollinsTime['fastestTime'] +
            ' on ' + fastestCollinsTime['fastestDate'] + '. ';
    }
    return (
        <ScrollView style={styles.statsViewContainer} refreshControl={refreshControl}>
            <Text style={styles.h1}>
                Season Stats
            </Text>
            <Text style={styles.h2}>
                At a glance
            </Text>
            <Text style={styles.summaryText}>
                You've skied {flattenedRides.length} laps in{' '}
                {ridesData.length} days for a total of{' '}
                {seasonVert.toLocaleString()} vertical feet.{' '}
                {fastestCollinsString}
                But most importantly, you've midloaded
                {` ${numMidloads} ${midloadPlural}`}
            </Text>
            <RideStatsPieChart numRidesPerLift={numRidesPerLift} />
            <LiftBreakdownTable numRidesPerLift={numRidesPerLift} />
        </ScrollView>
    )
};

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
