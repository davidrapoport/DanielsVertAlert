import { View, Text, SectionList, StyleSheet, ActivityIndicator } from "react-native";
import { sortDescending, getCurrentDateInFormat } from "../RideUtils";
import { material } from "react-native-typography";

const formatDate = (dateString) => {
    const date = new Date();
    return new Date((new Date(dateString).getTime()) + date.getTimezoneOffset() * 60000).toDateString();
}

// Format of ridesData [{date, totalVert, rides[]}]
const HistoricRidesView = ({
    ridesData,
    lastRefreshTime,
    onlyShowTodays,
    refreshControl }) => {
    if (!ridesData) {
        return <ActivityIndicator size={'large'} />
    }
    ridesData = sortDescending(ridesData);
    let ridesDataToRender = ridesData;
    if (onlyShowTodays) {
        ridesDataToRender = [ridesData[0]];
        if (ridesData[0].date !== getCurrentDateInFormat()) {
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
        }
    }
    const sections = [];
    ridesDataToRender.forEach(rides => {
        const laps = rides.rides.length > 1 ? 'laps' : 'lap';
        sections.push({
            title: `${formatDate(rides.date)}: You ` +
                `skied ${rides.rides.length} ${laps} for ` +
                `${rides.totalVert.toLocaleString()} feet`, data: rides.rides
        })
    })
    let headerText = `Historic Ride Data`
    if (onlyShowTodays) {
        headerText = `Todays Ride Data`
    }
    return (
        <View style={styles.container}>
            <SectionList
                sections={sections}
                renderItem={({ item, index }) => <RideView ride={item} index={index} />}
                renderSectionHeader={({ section }) => <DayHeaderView rides={section} />}
                keyExtractor={(item) => `basicListEntry-${item.timestamp}`}
                refreshControl={refreshControl}
                ListHeaderComponent={<View>
                    <Text style={styles.h1}>
                        {headerText}
                    </Text>
                    <Text style={styles.h3}>
                        Last Refreshed: {lastRefreshTime.toLocaleString()}
                    </Text>
                </View>}
            />
        </View>
    )
};

const DayHeaderView = ({ rides }) => {
    return <Text style={styles.sectionHeader}>{rides.title}</Text>
}

const RideView = ({ ride, index }) => {
    const rawTime = ride.time;
    const split = rawTime.split(":");
    const oldHour = parseInt(split[0]);
    let modifier = "AM";
    let newHour = oldHour
    if (oldHour === 12) {
        modifier = "PM";
    } else if (oldHour > 12) {
        modifier = "PM";
        newHour = oldHour - 12;
    }
    const time = `${newHour}:${split[1]} ${modifier}`;
    return (
        <View style={index === 0 ? styles.firstRowContainer : styles.rowContainer} >
            <Text style={styles.liftName}>{ride.lift}</Text>
            <Text style={styles.time}> {time}</Text>
            <Text style={styles.vert}>{ride.vert}</Text>
        </View>)
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 22,
        marginHorizontal: 8,
    },
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
    sectionHeader: {
        paddingTop: 12,
        paddingRight: 10,
        paddingBottom: 8,
        ...material.title,
    },
    rowContainer: {
        flex: 1,
        borderWidth: 1,
        borderTopWidth: 0,
        alignItems: 'stretch',
        justifyContent: 'space-evenly',
        flexDirection: "row",
    },
    firstRowContainer: {
        flex: 1,
        borderWidth: 1,
        alignItems: 'stretch',
        justifyContent: 'space-evenly',
        flexDirection: "row",
    },
    time: {
        flex: 1,
        paddingVertical: 10,
        paddingRight: 20,
        height: 44,
        ...material.body1Object,
    },
    vert: {
        flex: 1,
        paddingVertical: 10,
        height: 44,
        ...material.body1Object,
    },
    liftName: {
        flex: 2,
        paddingVertical: 9,
        paddingLeft: 10,
        height: 44,
        ...material.body1Object,
    },
});

export default HistoricRidesView;
