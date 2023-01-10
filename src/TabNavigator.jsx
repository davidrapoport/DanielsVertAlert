import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HistoricRidesView from './HistoricRidesView';
import SeasonStatsView from './SeasonStatsView';
import WebIdEntryForm from './WebIdEntryForm';

const Tab = createBottomTabNavigator();

function TabNavigator({
    rideData,
    refreshControl,
    savedWebId,
    handleUpdateWebId,
    lastRefreshTime }) {
    return (
        <NavigationContainer>
            <Tab.Navigator initialRouteName='DailyStats'>
                <Tab.Screen name="Settings">
                    {(props) => {
                        return <WebIdEntryForm {...props}
                            savedWebId={savedWebId}
                            handleUpdateWebId={handleUpdateWebId} />;
                    }}
                </Tab.Screen>
                <Tab.Screen name="DailyStats" >
                    {(props) => {
                        return <HistoricRidesView {...props}
                            ridesData={rideData}
                            lastRefreshTime={lastRefreshTime}
                            onlyShowTodays={true} />;
                    }}
                </Tab.Screen>
                <Tab.Screen name="SeasonStats" >
                    {(props) => <SeasonStatsView {...props} ridesData={rideData} />}
                </Tab.Screen>
                <Tab.Screen name="See Rides" >
                    {(props) => {
                        return <HistoricRidesView {...props}
                            ridesData={rideData}
                            lastRefreshTime={lastRefreshTime}
                            onlyShowTodays={false} />;
                    }}
                </Tab.Screen>
            </Tab.Navigator>
        </NavigationContainer>
    )
}

export default TabNavigator