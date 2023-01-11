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
            <Tab.Navigator initialRouteName='Daily Stats'>
                <Tab.Screen name="Settings">
                    {(props) => {
                        return <WebIdEntryForm {...props}
                            savedWebId={savedWebId}
                            handleUpdateWebId={handleUpdateWebId} />;
                    }}
                </Tab.Screen>
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
                <Tab.Screen name="See Rides" >
                    {(props) => {
                        return <HistoricRidesView {...props}
                            ridesData={rideData}
                            lastRefreshTime={lastRefreshTime}
                            onlyShowTodays={false}
                            refreshControl={refreshControl} />;
                    }}
                </Tab.Screen>
            </Tab.Navigator>
        </NavigationContainer>
    )
}

export default TabNavigator