import { View, Text, ScrollView, StyleSheet } from "react-native";

import { material } from "react-native-typography";

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

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 22
    },
    td: {
        borderWidth: 1,
        flex: 1,
        padding: 4,
        ...material.body1,
    },
    th: {
        borderWidth: 1,
        flex: 1,
        padding: 4,
        ...material.body2,
    },
    tr: {
        flexDirection: "row",
    },
    table: {
        marginBottom: 24,
        paddingBottom: 24,
        marginTop: 12,
    },
});

export default LiftBreakdownTable;