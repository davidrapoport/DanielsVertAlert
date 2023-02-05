import { ScrollView, View, Image, Button, Text, StyleSheet } from "react-native";
import { material } from "react-native-typography";
import { ALTA_BLUE, GlobalStyles } from "../GlobalStyles";

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import VertCharts from "../components/VertCharts";
import HistoricRidesView from "../components/HistoricRidesView";

const Stack = createNativeStackNavigator();

function MainView({ resetWebId, navigation }) {
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
                style={{ width: '95%' }} />
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
                    onPress={resetWebId}
                    title={"Reset Web Id"}></Button>
            </View>
        </ScrollView>
    )
}

function OverflowView({ resetWebId, ridesData, refreshControl }) {
    return (
        <NavigationContainer independent={true}>
            <Stack.Navigator initialRouteName="Main">
                <Stack.Screen name="Main" options={{ headerShown: false }}>
                    {(props) => {
                        return <MainView {...props}
                            resetWebId={resetWebId} />
                    }}
                </Stack.Screen>
                <Stack.Screen name="Vert Chart">
                    {(props) => {
                        return <VertCharts {...props}
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