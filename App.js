import React, { useCallback, useEffect } from 'react';
import { StyleSheet, View, RefreshControl } from 'react-native';
import RidesView from './src/RidesView';
import { scrapeRides } from './src/Scraper';
import { shouldScrapeRides } from './src/ScraperController';
import {
  getWebId,
  storeWebId,
  getLastRefreshTime,
  storeLastRefreshTime,
  getRideData,
  storeRideData,
} from './src/Storage';

import WebIdEntryForm from './src/WebIdEntryForm';

function App() {
  const [webId, setWebId] = React.useState();
  const [rideData, setRideData] = React.useState();
  const [lastRefreshTime, setLastRefreshTime] = React.useState();
  const [isRefreshing, setIsRefreshing] = React.useState(false);

  // Load saved data from AsyncStorage onComponentDidMount.
  useEffect(() => {
    const loadSavedData = async () => {
      const savedWebId = await getWebId();
      const savedRefreshTime = await getLastRefreshTime();
      const savedRideData = await getRideData();
      if (savedWebId) {
        setWebId(savedWebId);
      }
      if (savedRefreshTime) {
        setLastRefreshTime(savedRefreshTime);
      }
      if (savedRideData) {
        setRideData(savedRideData);
      }
    };
    loadSavedData();
  }, []);

  // Set a timer to poll data every 5 minutes when the app 
  // is in the foreground. Headless calls will be used for 
  // background sync.
  const pollRideData = useCallback(async () => {
    // Should scrape rides ensures that refreshes don't happen
    // more than once every 5 minutes.
    console.log("Trying to poll now" + new Date())
    if (await shouldScrapeRides()) {
      console.log("Successfully polling " + new Date())
      await handleRefresh();
    }
  });
  useEffect(() => {
    setInterval(pollRideData, 60 * 1000)
  }, [pollRideData]);

  const handleUpdateWebId = async updatedWebId => {
    setWebId(updatedWebId);
    await storeWebId(updatedWebId);
    // Refresh the data with a new webId
    await handleRefresh();
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);

    const rides = await scrapeRides();
    setRideData(rides);
    storeRideData(rideData);

    const refreshTime = new Date();
    setLastRefreshTime(refreshTime);
    storeLastRefreshTime(refreshTime);

    setIsRefreshing(false);
  };

  const refreshControl = (
    <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />
  );

  return (
    <View style={styles.container}>
      <WebIdEntryForm
        savedWebId={webId}
        handleUpdateWebId={handleUpdateWebId}
      />
      {rideData && (
        <RidesView
          ridesData={rideData}
          lastRefreshTime={lastRefreshTime}
          refreshControl={refreshControl}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    height: 200,
  },
});

export default App;
