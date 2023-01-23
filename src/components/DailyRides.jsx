import { View, Text, StyleSheet } from "react-native";

import { material } from "react-native-typography";

import HistoricRidesView from "./HistoricRidesView";
import { getCurrentDateInFormat, sortDescending } from "../RideUtils";

function DailyRides({ ridesData, refreshControl, lastRefreshTime }) {
    ridesData = sortDescending(ridesData)
    ridesDataToRender = [ridesData[0]];
    if (ridesDataToRender[0].date !== getCurrentDateInFormat()) {
        return (
            <View style={{ flexDirection: 'row' }}>
                <View style={styles.emptyContainer} refreshControl={refreshControl}>
                    <Text style={styles.noRideMessage}>
                        No rides yet today... What, are you interlodged?
                        {' '} Or do you just like getting paid $600 a month
                        {' '} to eat Andrew's "lasagna"?
                    </Text>
                </View>
            </View>
        )
    } else {
        return <HistoricRidesView
            ridesData={ridesDataToRender}
            refreshControl={refreshControl}
            lastRefreshTime={lastRefreshTime}
            headerComponent={<View>
                <Text style={styles.h1}>
                    Today's Rides
                </Text>
                <Text style={styles.h3}>
                    Last Refreshed: {lastRefreshTime.toLocaleString()}
                </Text>
            </View>} />
    }
}

const styles = StyleSheet.create({
    emptyContainer: {
        flexDirection: 'column',
        height: '100%',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 22,
        marginTop: 48,
    },
    noRideMessage: {
        textAlign: 'center',
        ...material.title,
    },
    h1: {
        ...material.display2,
        paddingBottom: 12,
    },
    h3: {
        ...material.headline,
    },
});

export default DailyRides;