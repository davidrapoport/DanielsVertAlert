import { Text, StyleSheet, ScrollView } from "react-native";

import { material } from "react-native-typography";

import RidesPieChart from "../components/RidesPieChart";
import LiftBreakdownTable from "../components/LiftBreakdownTable";
import { getNumRidesPerLift } from "../RideUtils";


const DonutView = ({ ridesData, refreshControl }) => {
    if (!ridesData) {
        return <ActivityIndicator size={'large'} />;
    }

    const numRidesPerLift = getNumRidesPerLift(ridesData);

    return (
        <ScrollView style={styles.statsViewContainer} refreshControl={refreshControl}>
            <Text style={styles.h1}>
                Your Blue Donut
            </Text>
            <RidesPieChart numRidesPerLift={numRidesPerLift} />
            <LiftBreakdownTable numRidesPerLift={numRidesPerLift} />
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
    h1: {
        paddingBottom: 12,
        ...material.display2,
    },
});

export default DonutView