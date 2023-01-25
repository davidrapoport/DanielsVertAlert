import { isAfter, isSameDay } from "date-fns";
import { addDays } from "date-fns/esm";
import { View, Text } from "react-native"
import { Grid, BarChart, XAxis, YAxis } from 'react-native-svg-charts'
import { convertStringToLocalDate, getCurrentDateAlta, sortAscending } from "../RideUtils";
import { GlobalStyles, ALTA_RED } from "../GlobalStyles";


function VertCharts({ ridesData, refreshControl }) {

    return (
        <View style={GlobalStyles.viewContainer} refreshControl={refreshControl}>
            <Text style={GlobalStyles.h1}>
                How's Yer Vert?
            </Text>
            <Text style={{ ...GlobalStyles.h2, marginTop: 24 }}>Vert Per Week</Text>
            <WeeklyViewChart ridesData={ridesData} />
        </View>
    );
};

function WeeklyViewChart({ ridesData }) {
    const data = []
    const labels = []
    ridesData = sortAscending(ridesData);
    const todaysDate = getCurrentDateAlta();
    let weekTotal = 0;
    let dayCounter = 0;
    let ridesIndex = 0;
    let currentDate = convertStringToLocalDate(ridesData[0].date);
    while (!isAfter(currentDate, todaysDate)) {
        if (dayCounter % 7 === 0) {
            labels.push((currentDate.getMonth() + 1) + '/' +
                (currentDate.getDate() + 1))
        }
        // It's possible we still have days to go to catch up to 'today'
        // But there aren't any more rides (ex. last 5 days have been rest days).
        if (ridesIndex < ridesData.length) {
            const rideDate = convertStringToLocalDate(ridesData[ridesIndex].date);
            if (isSameDay(rideDate, currentDate)) {
                weekTotal += ridesData[ridesIndex].totalVert;
                ridesIndex++;
            }
        }
        if (dayCounter % 7 === 6) {
            data.push(weekTotal);
            weekTotal = 0;
        }
        dayCounter++;
        currentDate = addDays(currentDate, 1);
    }
    if (labels.length !== data.length) {
        data.push(weekTotal);
    }
    const axesSvg = { fontSize: 10, fill: 'grey' };
    const xAxesSvg = Object.assign({ rotation: 90, translateY: 20 }, axesSvg);
    const verticalContentInset = { top: 15, bottom: 15 }
    const gridMin = 0;
    const gridMax = Math.max(...data) * 1.2;
    const numberOfTicks = Math.ceil(gridMax / 10000);
    const xAxisHeight = 100
    return (
        <View style={{ height: 500, padding: 20, flexDirection: 'row' }}>
            <YAxis
                data={data}
                style={{ marginBottom: xAxisHeight }}
                contentInset={verticalContentInset}
                min={gridMin}
                max={gridMax}
                numberOfTicks={numberOfTicks}
                formatLabel={(value) => value.toLocaleString()}
                svg={axesSvg}
            />
            <View style={{ flex: 1, marginLeft: 10 }}>
                <BarChart
                    style={{ flex: 1 }}
                    data={data}
                    gridMin={gridMin}
                    gridMax={gridMax}
                    numberOfTicks={numberOfTicks}
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
                    contentInset={{ left: 35, right: 35 }}
                    numberOfTicks={labels.length}
                    svg={xAxesSvg}
                />
            </View>
        </View>
    )
}

function CumulativeViewChart({ ridesData }) {
    const data = []
    const labels = []
    ridesData = sortAscending(ridesData);
    let total = 0;
    for (let i = 0; i < ridesData.length; i++) {
        total += ridesData[i].totalVert;
        if (i % 7 === 0) {
            const dateParts = ridesData[i].date.split('-');
            labels.push(dateParts[1] + '/' + dateParts[2]);
        } else {
            labels.push('');
        }
        data.push(total);
    }
    const axesSvg = { fontSize: 10, fill: 'grey' };
    const xAxesSvg = Object.assign({ rotation: 90, translateY: 20 }, axesSvg);
    const verticalContentInset = { top: 15, bottom: 15 }
    const gridMin = 0;
    const gridMax = total * 1.2;
    const numberOfTicks = Math.ceil((total * 1.2) / 50000);
    const xAxisHeight = 100
    return (
        <View style={{ height: 500, padding: 20, flexDirection: 'row' }}>
            <YAxis
                data={data}
                style={{ marginBottom: xAxisHeight }}
                contentInset={verticalContentInset}
                min={gridMin}
                max={gridMax}
                numberOfTicks={numberOfTicks}
                formatLabel={(value) => value.toLocaleString()}
                svg={axesSvg}
            />
            <View style={{ flex: 1, marginLeft: 10 }}>
                <BarChart
                    style={{ flex: 1 }}
                    data={data}
                    gridMin={gridMin}
                    gridMax={gridMax}
                    numberOfTicks={numberOfTicks}
                    contentInset={verticalContentInset}
                    svg={{ stroke: 'rgb(134, 65, 244)' }}
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
                    contentInset={{ left: 10, right: 10 }}
                    svg={xAxesSvg}
                />
            </View>
        </View>
    )
}

export default VertCharts