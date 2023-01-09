import { View, Text, SectionList, StyleSheet } from "react-native";

const getCurrentDateInFormat = () => {
    const date = new Date();
    return (dateString = new Date(date.getTime() - date.getTimezoneOffset() * 60000)
        .toISOString()
        .split('T')[0]);
};


// Format of ridesData [{date, totalVert, rides[]}]
const RidesView = ({ ridesData }) => {
    // Sort in descending order.
    ridesData.sort((a, b) => {
        if (b.date < a.date) {
            return -1;
        }
    })
    const sections = [];
    ridesData.forEach(rides => { sections.push({ title: `${rides.date}: You skied ${rides.rides.length} for ${rides.totalVert}`, data: rides.rides }) })
    const todaysDate = getCurrentDateInFormat();
    return (
        <View style={styles.container}>
            <Text>
                Historic Ride Data
            </Text>
            <SectionList
                sections={sections}
                renderItem={({ item }) => <RideView style={styles.item} ride={item} />}
                renderSectionHeader={({ section }) => <DayHeaderView style={styles.sectionHeader} rides={section} />}
                keyExtractor={(item) => `basicListEntry-${item.timestamp}`}
            />
        </View>
    )
};

const DayHeaderView = ({ rides, style }) => {
    return <Text style={style}>{rides.title}</Text>
}

const RideView = ({ ride, style }) => {
    return <Text style={style}>You skied {ride.lift} at {ride.time} for {ride.vert} vert</Text>
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 22
    },
    sectionHeader: {
        paddingTop: 2,
        paddingLeft: 10,
        paddingRight: 10,
        paddingBottom: 2,
        fontSize: 14,
        fontWeight: 'bold',
        backgroundColor: 'rgba(247,247,247,1.0)',
    },
    item: {
        padding: 10,
        fontSize: 18,
        height: 44,
    },
})

export default RidesView;
