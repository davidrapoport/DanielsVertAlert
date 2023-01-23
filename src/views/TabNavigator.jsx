import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import WebIdEntryForm from '../components/WebIdEntryForm';

import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import VertCharts from '../components/VertCharts';
import DailyStatsView from './DailyStatsView';
import DonutView from './DonutView';

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
                        let icon;
                        if (route.name === 'Daily Stats') {
                            iconName = 'snow-outline';
                        } else if (route.name === 'Settings') {
                            iconName = 'settings-outline';
                        } else if (route.name === 'Doughnut') {
                            icon = <MaterialCommunityIcons name="chart-donut" size={size} color={color} />
                        } else if (route.name === 'Vert Charts') {
                            iconName = 'trending-up-outline';
                        } else if (route.name === 'All Rides') {
                            iconName = 'layers-outline';
                        }
                        if (icon) {
                            return icon;
                        }
                        return <Ionicons name={iconName} size={size} color={color} />;
                    },
                    tabBarActiveTintColor: '#C4332E',
                    tabBarInactiveTintColor: 'gray',
                    headerStyle: {
                        backgroundColor: '#C4332E',
                    },
                    headerTintColor: '#fff',
                })}>
                <Tab.Screen name="Daily Stats" >
                    {(props) => {
                        return <DailyStatsView {...props}
                            ridesData={rideData}
                            lastRefreshTime={lastRefreshTime}
                            refreshControl={refreshControl} />;
                    }}
                </Tab.Screen>
                <Tab.Screen name="Doughnut" >
                    {(props) => {
                        return <DonutView {...props}
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