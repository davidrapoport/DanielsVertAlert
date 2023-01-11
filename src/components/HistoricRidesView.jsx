import { View, Text, SectionList, StyleSheet, ActivityIndicator } from "react-native";

const getCurrentDateInFormat = () => {
    const date = new Date();
    return (dateString = new Date(date.getTime() - date.getTimezoneOffset() * 60000)
        .toISOString()
        .split('T')[0]);
};

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
    // Sort in descending order.
    ridesData.sort((a, b) => {
        if (b.date < a.date) {
            return -1;
        } if (a.date < b.date) {
            return 1;
        }
    })
    let ridesDataToRender = ridesData;
    if (onlyShowTodays) {
        ridesDataToRender = [ridesData[0]];
        if (ridesData[0].date !== getCurrentDateInFormat()) {
            return (
                <View style={styles.container}>
                    <Text style={styles.sectionHeader}>
                        No rides yet today... What, are you interlodged?
                        {' '} Or do you just like getting paid $600 a month
                        {' '} to eat Andrew's "lasagna"?
                    </Text>
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
                `${rides.totalVert} feet`, data: rides.rides
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
                renderItem={({ item }) => <RideView ride={item} />}
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

const RideView = ({ ride }) => {
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
        <View style={styles.rowContainer} >
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
    h1: {
        fontSize: 36,
        paddingBottom: 2,
        fontWeight: 'bold',
    },
    h3: {
        fontSize: 22,
    },
    sectionHeader: {
        paddingTop: 12,
        paddingRight: 10,
        paddingBottom: 8,
        fontSize: 22,
        fontWeight: 'bold',
        backgroundColor: 'rgba(247,247,247,1.0)',
    },
    rowContainer: {
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
        fontSize: 18,
        height: 44,
    },
    vert: {
        flex: 1,
        paddingVertical: 10,
        fontSize: 18,
        height: 44,
    },
    liftName: {
        flex: 2,
        paddingVertical: 9,
        paddingLeft: 10,
        fontSize: 18,
        height: 44,
    },
});

export default HistoricRidesView;
