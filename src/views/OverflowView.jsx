import React from "react";

import { ScrollView, View, Image, Button, Text, StyleSheet } from "react-native";
import { material } from "react-native-typography";
import { ALTA_BLUE, GlobalStyles } from "../GlobalStyles";

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import VertCharts from "../components/VertCharts";
import HistoricRidesView from "../components/HistoricRidesView";
import { TextInput } from "react-native";
import { showMessage } from "react-native-flash-message";
import VertDistributionChart from "../components/VertDistributionChart";

const Stack = createNativeStackNavigator();

function MainView({ resetWebId, handleUpdateVertGoal, currentVertGoal, navigation }) {
    const [newVert, setNewVert] = React.useState(currentVertGoal.toLocaleString());
    const inputRef = React.useRef(TextInput);
    function handleVertPress() {
        const parsedVert = parseInt(newVert.replaceAll(',', ''));
        if (parsedVert < 0 || isNaN(parsedVert)) {
            showMessage({ message: "Please enter a better Vert Goal", type: 'warning', duration: 5000 });
            setNewVert(currentVertGoal.toLocaleString());
            inputRef.current.clear();
            return;
        }
        handleUpdateVertGoal(parsedVert);
        showMessage({ message: "Your Vert Goal has been updated", type: "success", duration: 3000 })
    }
    function handleTextInput(text) {
        setNewVert(text.toLocaleString());
    }
    return (
        <ScrollView style={GlobalStyles.scrollViewContainer}
            contentContainerStyle={{ alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{
                ...material.subheading,
                flexWrap: 'wrap',
                color: ALTA_BLUE,
                marginTop: 24
            }}>Wanna look like this? Get back out there!</Text>
            <Image source={require('../img/hipDownDaniel.jpg')} resizeMode="contain"
                style={{ width: '95%', height: 300 }} />
            <View style={{
                ...styles.button,
            }}>
                <Text style={{ ...material.subheading, flexWrap: 'wrap' }}>
                    Update Your Season Vert Goal:
                </Text>
                <TextInput inputMode='numeric'
                    style={{
                        borderWidth: 1, borderColor: 'black',
                        borderRadius: 3, marginBottom: 12
                    }}
                    textAlign='center'
                    value={newVert}
                    defaultValue={newVert}
                    onChangeText={handleTextInput}
                    autoCorrect={false}
                    ref={inputRef}></TextInput>
                <Button
                    onPress={handleVertPress}
                    title={"Update"}></Button>
            </View>
            <View style={styles.button}>
                <Button
                    onPress={() => navigation.navigate("All Rides")}
                    title={"See All Rides"}></Button>
            </View>
            <View style={styles.button}>
                <Button
                    onPress={() => navigation.navigate("Vert Chart")}
                    title={"Check out your weekly vert"}></Button>
            </View>
            <View style={styles.button}>
                <Button
                    onPress={() => navigation.navigate("Vert Distribution")}
                    title={"Check out how much vert you ski per day"}></Button>
            </View>
            <View style={styles.button}>
                <Button
                    onPress={resetWebId}
                    title={"Reset Web Id"}></Button>
            </View>
        </ScrollView>
    )
}

function OverflowView({ resetWebId, ridesData,
    refreshControl, handleUpdateVertGoal,
    currentVertGoal, stackNavigationContainerRef }) {
    return (
        <NavigationContainer independent={true} ref={stackNavigationContainerRef}>
            <Stack.Navigator initialRouteName="Main">
                <Stack.Screen name="Main" options={{ headerShown: false }}>
                    {(props) => {
                        return <MainView {...props}
                            resetWebId={resetWebId}
                            handleUpdateVertGoal={handleUpdateVertGoal}
                            currentVertGoal={currentVertGoal} />
                    }}
                </Stack.Screen>
                <Stack.Screen name="Vert Chart">
                    {(props) => {
                        return <VertCharts {...props}
                            ridesData={ridesData} refreshControl={refreshControl} />
                    }}
                </Stack.Screen>
                <Stack.Screen name="Vert Distribution">
                    {(props) => {
                        return <VertDistributionChart {...props}
                            ridesData={ridesData} refreshControl={refreshControl} />
                    }}
                </Stack.Screen>
                <Stack.Screen name="All Rides">
                    {(props) => {
                        return <HistoricRidesView {...props}
                            ridesData={ridesData}
                            refreshControl={refreshControl} />
                    }}
                </Stack.Screen>
            </Stack.Navigator>
        </NavigationContainer>
    )
}

const styles = StyleSheet.create({
    button: {
        marginVertical: 6,
        width: '80%',
    }
})

export default OverflowView;