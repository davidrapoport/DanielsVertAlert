import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useNavigationContainerRef, StackActions } from '@react-navigation/native';

import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import DailyStatsView from './DailyStatsView';
import DonutView from './DonutView';
import GoalsView from './GoalsView';
import { ALTA_RED } from '../GlobalStyles';
import OverflowView from './OverflowView';

const Tab = createBottomTabNavigator();

function TabNavigator({
    rideData,
    refreshControl,
    resetWebId,
    lastRefreshTime,
    vertGoal,
    handleUpdateVertGoal }) {
    const stackNavigationContainerRef = useNavigationContainerRef();
    return (
        <NavigationContainer
            // All this junk is there so that any Stack that gets popped on from
            // within the 'More' Tab gets cleared once the user clicks on a different tab
            onStateChange={(state) => {
                if (!stackNavigationContainerRef.current ||
                    stackNavigationContainerRef.getCurrentRoute().name === 'Main') {
                    return;
                }
                stackNavigationContainerRef.dispatch(StackActions.popToTop());
            }}>
            <Tab.Navigator initialRouteName='Daily Stats'
                screenOptions={({ route }) => ({
                    tabBarIcon: ({ focused, color, size }) => {
                        let iconName;
                        let icon;
                        if (route.name === 'Daily Stats') {
                            iconName = 'snow-outline';
                        } else if (route.name === 'More') {
                            iconName = 'ellipsis-horizontal-outline';
                        } else if (route.name === 'Doughnut') {
                            icon = <MaterialCommunityIcons name="chart-donut" size={size} color={color} />
                        } else if (route.name === 'Vert Chart') {
                            iconName = 'trending-up-outline';
                        } else if (route.name === 'All Rides') {
                            iconName = 'layers-outline';
                        } else if (route.name === 'Goals') {
                            iconName = 'shield-checkmark-outline';
                        }
                        if (icon) {
                            return icon;
                        }
                        return <Ionicons name={iconName} size={size} color={color} />;
                    },
                    tabBarActiveTintColor: ALTA_RED,
                    tabBarInactiveTintColor: 'gray',
                    headerStyle: {
                        backgroundColor: ALTA_RED,
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
                <Tab.Screen name="Goals" >
                    {(props) => {
                        return <GoalsView {...props}
                            ridesData={rideData}
                            vertGoal={vertGoal} />
                    }}
                </Tab.Screen>
                <Tab.Screen name="More">
                    {(props) => {
                        return <OverflowView {...props}
                            resetWebId={resetWebId}
                            ridesData={rideData}
                            refreshControl={refreshControl}
                            handleUpdateVertGoal={handleUpdateVertGoal}
                            currentVertGoal={vertGoal}
                            stackNavigationContainerRef={stackNavigationContainerRef} />;
                    }}
                </Tab.Screen>
            </Tab.Navigator>
        </NavigationContainer>
    )
}

export default TabNavigator