import { View, Text, StyleSheet, ScrollView } from "react-native";
import { PieChart } from 'react-native-svg-charts'
import { Rect, Svg } from 'react-native-svg'
import { material } from "react-native-typography";


const getColorFromLift = name => {
    const liftToColor = {
        'Collins': '#0E1FE9',
        'Wildcat': '#F31705',
        'Sugarloaf': '#61C925',
        'Supreme': '#1D1D1D',
        'Sunnyside': '#E9F809',
        'Albion': '#09F8DF',
        'Collins Angle': '#F809C9',
        'Tram': '#fc7b0a',
        'Gad Zoom': '#fcec0a',
        'Mineral Basin': '#0ab2fa',
        'Peruvian': '#11451e',
    }
    if (name in liftToColor) {
        return liftToColor[name];
    }
    // Default for any weird lift I may not have remembered.
    return '#636363';
}

const RidesPieChart = ({ numRidesPerLift }) => {
    const pieChartData = [];
    for (const lift in numRidesPerLift) {
        pieChartData.push({
            key: lift,
            amount: numRidesPerLift[lift],
            svg: { fill: getColorFromLift(lift) }
        });
    }
    const labels = [];
    for (lift in numRidesPerLift) {
        labels.push(
            <View style={styles.labelContainer} key={`labelForSeasonPieChart-${lift}`}>
                <Svg width="50" height="20">
                    <Rect
                        x="0"
                        y="5"
                        width="50"
                        height="15"
                        fill={getColorFromLift(lift)}
                        strokeWidth="0"
                        stroke="rgb(0,0,0)"
                    />
                </Svg>
                <Text style={styles.labelText}>{lift}</Text>
            </View>);
    }

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            <View style={styles.labels}>{labels}</View>
            <PieChart
                style={{ height: 200 }}
                valueAccessor={({ item }) => item.amount}
                data={pieChartData}
                spacing={0}
                outerRadius={'95%'}
                innerRadius={'33%'}
                padAngle={0}
            >
            </PieChart >
        </ScrollView>
    )
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 22
    },
    labels: {
        paddingTop: 8,
        paddingBottom: 16,
    },
    labelContainer: {
        flex: 1,
        flexWrap: 'wrap',
        alignItems: "stretch",
        justifyContent: "flex-start",
        flexDirection: "row",
    },
    labelText: {
        paddingLeft: 20,
        flexWrap: 'wrap',
        flexShrink: 1,
        ...material.subheading,
    }
});

export default RidesPieChart;
