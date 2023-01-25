import { ScrollView, View, Text, StyleSheet } from "react-native";

import { material } from "react-native-typography";

import HistoricRidesView from "./HistoricRidesView";
import { getCurrentDateInFormat, sortDescending } from "../RideUtils";
import { GlobalStyles } from "../GlobalStyles";
function DailyRides({ ridesData, refreshControl, lastRefreshTime, footerComponent }) {
    ridesData = sortDescending(ridesData)
    ridesDataToRender = [ridesData[0]];
    if (ridesDataToRender[0].date !== getCurrentDateInFormat()) {
        return (
            <ScrollView style={GlobalStyles.scrollViewContainer}
                refreshControl={refreshControl}
                showsVerticalScrollIndicator={false} >
                <View style={{ flexDirection: 'row', flex: 1 }}>
                    <View style={styles.emptyContainer} >
                        <Text style={styles.noRideMessage}>
                            No rides yet today... What, are you interlodged?
                            {' '} Or do you just like getting paid $600 a month
                            {' '} to eat Andrew's "lasagna"?
                        </Text>
                    </View>
                </View>
                <View style={{ flex: 1 }}>{footerComponent}</View>
            </ScrollView >
        )
    }
    return <HistoricRidesView
        ridesData={ridesDataToRender}
        refreshControl={refreshControl}
        lastRefreshTime={lastRefreshTime}
        headerComponent={<View>
            <Text style={GlobalStyles.h1}>
                Today's Rides
            </Text>
            <Text style={GlobalStyles.h2}>
                Last Refreshed: {lastRefreshTime.toLocaleString()}
            </Text>
        </View>}
        footerComponent={footerComponent} />
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
        paddingBottom: 64,
    },
    noRideMessage: {
        textAlign: 'center',
        ...material.title,
    },
});

export default DailyRides;