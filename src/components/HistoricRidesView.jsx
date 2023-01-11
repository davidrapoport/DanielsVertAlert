import { View, Text, SectionList, StyleSheet } from "react-native";

const getCurrentDateInFormat = () => {
    const date = new Date();
    return (dateString = new Date(date.getTime() - date.getTimezoneOffset() * 60000)
        .toISOString()
        .split('T')[0]);
};


// Format of ridesData [{date, totalVert, rides[]}]
const HistoricRidesView = ({ ridesData, lastRefreshTime, onlyShowTodays, refreshControl }) => {
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
            title: `${rides.date}: You skied ${rides.rides.length} ${laps} for ${rides.totalVert} feet`, data: rides.rides
        })
    })
    let headerText = `Historic Ride Data`
    if (onlyShowTodays) {
        headerText = `Todays Ride Data`
    }
    return (
        <View style={styles.container} refreshControl={refreshControl}>
            <Text style={styles.h1}>
                {headerText}
            </Text>
            <Text style={styles.h3}>
                Last Refreshed: {lastRefreshTime.toLocaleString()}
            </Text>
            <SectionList
                sections={sections}
                renderItem={({ item }) => <RideView ride={item} />}
                renderSectionHeader={({ section }) => <DayHeaderView rides={section} />}
                keyExtractor={(item) => `basicListEntry-${item.timestamp}`}
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
            <Text style={styles.item}>{ride.lift}</Text>
            <Text style={styles.item}> {time}</Text>
            <Text style={styles.item}>{ride.vert}</Text>
        </View>)
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 22,
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
        paddingLeft: 10,
        paddingRight: 10,
        paddingBottom: 8,
        fontSize: 22,
        fontWeight: 'bold',
        backgroundColor: 'rgba(247,247,247,1.0)',
    },
    rowContainer: {
        flex: 1,
        borderWidth: 1,
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "row",
    },
    item: {
        flex: 1,
        padding: 10,
        fontSize: 18,
        height: 44,
    },
});

export default HistoricRidesView;
