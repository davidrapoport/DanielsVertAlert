import { ScrollView, View, Text, Dimensions } from "react-native"
import { Grid, BarChart, XAxis, YAxis } from 'react-native-svg-charts'
import { material } from "react-native-typography";
import { GlobalStyles, ALTA_RED, ALTA_BLUE } from "../GlobalStyles";


function VertDistributionChart({ ridesData, refreshControl }) {

    return (
        <ScrollView style={GlobalStyles.scrollViewContainer} refreshControl={refreshControl}>
            <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
                <Text style={GlobalStyles.h1}>
                    You going big?
                </Text>
                <Text style={{ ...GlobalStyles.h2 }}>Daily Vert Distribution</Text>
            </View>
            <VertDistribution ridesData={ridesData} />
        </ScrollView>
    );
};

function VertDistribution({ ridesData }) {
    const dailyVertThousands = ridesData.map((rideData) => Math.floor(rideData.totalVert / 1000));
    const distributionData = {}
    dailyVertThousands.forEach((vert) => {
        if (!(vert in distributionData)) {
            distributionData[vert] = 0;
        }
        distributionData[vert]++;
    })
    const labels = Object.keys(distributionData).map(s => parseInt(s));
    labels.sort((a, b) => a - b);
    const data = labels.map((label, idx) => {
        return {
            value: distributionData[label],
            svg: {
                fill: idx % 2 ? ALTA_RED : ALTA_BLUE
            }
        }
    });
    const rawData = labels.map(label => distributionData[label]);
    const height = Dimensions.get('window').height - 200;
    const axesSvg = { fontSize: 10, fill: 'grey' };
    const verticalContentInset = { top: 15, bottom: 15 }
    const gridMin = 0;
    const gridMax = Math.max(...rawData) * 1.2;
    const xAxisHeight = 10
    return (
        <View style={{ height: height * 0.8, padding: 20 }}>
            <View style={{ flexDirection: 'row', flex: 100 }}>
                <YAxis
                    data={data}
                    style={{ marginBottom: xAxisHeight }}
                    contentInset={verticalContentInset}
                    min={gridMin}
                    max={gridMax}
                    formatLabel={(value) => value.toLocaleString()}
                    svg={axesSvg}
                />
                <View style={{ flex: 1, marginLeft: 10 }}>
                    <BarChart
                        style={{ flex: 1 }}
                        data={data}
                        yAccessor={({ item }) => item.value}
                        gridMin={gridMin}
                        gridMax={gridMax}
                        contentInset={verticalContentInset}
                        svg={{ stroke: ALTA_RED, fill: ALTA_RED }}
                    >
                        <Grid />
                    </BarChart>
                    <XAxis
                        style={{
                            marginHorizontal: -10,
                            height: xAxisHeight
                        }}
                        data={data}
                        formatLabel={(value, index) => labels[index]}
                        contentInset={{ left: 15, right: 15 }}
                        numberOfTicks={labels.length}
                        svg={axesSvg}
                    />
                </View>
            </View>
            <View style={{ alignItems: 'center', justifyContent: 'center', flexShrink: 1, paddingTop: 0, marginTop: 0 }}>
                <Text style={{ ...material.label, paddingTop: 0, marginTop: 0 }}>Thousand Feet Of Vert Per Day</Text>
            </View>
        </View>
    )
}

export default VertDistributionChart