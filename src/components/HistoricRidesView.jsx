import { View, Text, SectionList, StyleSheet } from "react-native";
import { sortDescending } from "../RideUtils";
import { GlobalStyles } from "../GlobalStyles";
import { material } from "react-native-typography";

const formatDate = (dateString) => {
    const date = new Date();
    return new Date((new Date(dateString).getTime()) + date.getTimezoneOffset() * 60000).toDateString();
}

// Format of ridesData [{date, totalVert, rides[]}]
const HistoricRidesView = ({
    ridesData,
    lastRefreshTime,
    refreshControl,
    headerComponent,
    footerComponent, }) => {
    ridesData = sortDescending(ridesData);
    const sections = [];
    ridesData.forEach(rides => {
        const laps = rides.rides.length > 1 ? 'laps' : 'lap';
        sections.push({
            title: `${formatDate(rides.date)}: You ` +
                `skied ${rides.rides.length} ${laps} for ` +
                `${rides.totalVert.toLocaleString()} feet`, data: rides.rides
        })
    })
    return (
        <View style={GlobalStyles.viewContainer}>
            <SectionList
                sections={sections}
                renderItem={({ item, index }) => <RideView ride={item} index={index} />}
                renderSectionHeader={({ section }) => <DayHeaderView rides={section} />}
                keyExtractor={(item) => `basicListEntry-${item.timestamp}`}
                refreshControl={refreshControl}
                ListHeaderComponent={headerComponent}
                ListFooterComponent={footerComponent}
                stickySectionHeadersEnabled={false}
                contentInset={{right: -16}}
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
        <View style={index === 0 ? { ...styles.rowContainer, borderTopWidth: 1 } : styles.rowContainer} >
            <Text style={styles.liftName}>{ride.lift}</Text>
            <Text style={styles.time}> {time}</Text>
            <Text style={styles.vert}>{ride.vert}</Text>
        </View>)
}

const styles = StyleSheet.create({
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
        justifyContent: 'space-between',
        flexDirection: "row",
        marginRight: 12,
    },
    time: {
        flex: 1,
        flexWrap: 'wrap',
        paddingVertical: 10,
        paddingRight: 10,
        ...material.body1Object,
    },
    vert: {
        flex: 1,
        flexWrap: 'wrap',
        paddingVertical: 10,
        ...material.body1Object,
    },
    liftName: {
        flex: 2,
        flexWrap: 'wrap',
        paddingVertical: 9,
        paddingLeft: 10,
        ...material.body1Object,
    },
});

export default HistoricRidesView;
