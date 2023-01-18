import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HistoricRidesView from './HistoricRidesView';
import SeasonStatsView from './SeasonStatsView';
import WebIdEntryForm from './WebIdEntryForm';

import Ionicons from 'react-native-vector-icons/Ionicons';
import VertCharts from './VertCharts';

const Tab = createBottomTabNavigator();

function TabNavigator({
    rideData,
    refreshControl,
    savedWebId,
    handleUpdateWebId,
    lastRefreshTime }) {
    return (
        <NavigationContainer>
            <Tab.Navigator initialRouteName='Daily Stats'
                screenOptions={({ route }) => ({
                    tabBarIcon: ({ focused, color, size }) => {
                        let iconName;
                        if (route.name === 'Daily Stats') {
                            iconName = 'snow-outline';
                        } else if (route.name === 'Settings') {
                            iconName = 'settings-outline';
                        } else if (route.name === 'Season Stats') {
                            iconName = 'today-outline';
                        } else if (route.name === 'Vert Charts') {
                            iconName = 'trending-up-outline';
                        } else if (route.name === 'All Rides') {
                            iconName = 'layers-outline';
                        }
                        return <Ionicons name={iconName} size={size} color={color} />;
                    },
                    tabBarActiveTintColor: 'tomato',
                    tabBarInactiveTintColor: 'gray',
                    headerStyle: {
                        backgroundColor: '#f4511e',
                    },
                    headerTintColor: '#fff',
                })}>
                <Tab.Screen name="Daily Stats" >
                    {(props) => {
                        return <HistoricRidesView {...props}
                            ridesData={rideData}
                            lastRefreshTime={lastRefreshTime}
                            onlyShowTodays={true}
                            refreshControl={refreshControl} />;
                    }}
                </Tab.Screen>
                <Tab.Screen name="Season Stats" >
                    {(props) => {
                        return <SeasonStatsView {...props}
                            ridesData={rideData}
                            refreshControl={refreshControl} />
                    }}
                </Tab.Screen>
                <Tab.Screen name="Vert Charts" >
                    {(props) => {
                        return <VertCharts {...props}
                            ridesData={rideData}
                            refreshControl={refreshControl} />
                    }}
                </Tab.Screen>
                <Tab.Screen name="All Rides" >
                    {(props) => {
                        return <HistoricRidesView {...props}
                            ridesData={rideData}
                            lastRefreshTime={lastRefreshTime}
                            onlyShowTodays={false}
                            refreshControl={refreshControl} />;
                    }}
                </Tab.Screen>
                <Tab.Screen name="Settings">
                    {(props) => {
                        return <WebIdEntryForm {...props}
                            savedWebId={savedWebId}
                            handleUpdateWebId={handleUpdateWebId} />;
                    }}
                </Tab.Screen>
            </Tab.Navigator>
        </NavigationContainer>
    )
}

export default TabNavigator