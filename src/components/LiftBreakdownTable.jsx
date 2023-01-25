import { View, Text, ScrollView, StyleSheet } from "react-native";

import { GlobalStyles } from "../GlobalStyles";

const LiftBreakdownTable = ({ numRidesPerLift }) => {
    const totalLaps = Object.values(numRidesPerLift).reduce((prev, acc) => prev + acc);
    const tableRows = [];
    for (const lift in numRidesPerLift) {
        tableRows.push(
            <View style={GlobalStyles.tr} key={`SeasonLiftBreakdownTableRow-${lift}`}>
                <Text style={GlobalStyles.td}>{lift}</Text>
                <Text style={GlobalStyles.td}>{numRidesPerLift[lift]}</Text>
                <Text style={GlobalStyles.td}>
                    {Math.round((numRidesPerLift[lift] / totalLaps) * 100)}%
                </Text>
            </View>)
    }

    return (
        <ScrollView style={styles.container}>
            <ScrollView style={GlobalStyles.table}>
                <View style={GlobalStyles.tr}>
                    <Text style={GlobalStyles.th}>Lift Name</Text>
                    <Text style={GlobalStyles.th}>Number of Laps</Text>
                    <Text style={GlobalStyles.th}>Percentage</Text>
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
});

export default LiftBreakdownTable;