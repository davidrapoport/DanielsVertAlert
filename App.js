import React, { useCallback, useEffect, useRef } from 'react';
import { StyleSheet, View, RefreshControl, ActivityIndicator, ScrollView } from 'react-native';
import HistoricRidesView from './src/HistoricRidesView';
import SeasonStatsView from './src/SeasonStatsView';
import { scrapeRides } from './src/Scraper';
import { shouldScrapeRides } from './src/ScraperController';
import {
  getWebId,
  storeWebId,
  getLastRefreshTime,
  storeLastRefreshTime,
  getRideData,
  storeRideData,
  clearAllStoredData,
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
    if (await shouldScrapeRides()) {
      await handleRefresh();
    }
  }, [handleRefresh]);
  const useSubscribeToScraping = () => {
    const timeout = useRef();
    const mountedRef = useRef(false);
    const run = useCallback(async () => {
      await pollRideData();
      if (mountedRef.current) {
        timeout.current = window.setTimeout(run, 60 * 1000);
      }
    }, []);
    useEffect(() => {
      mountedRef.current = true;
      run();
      return () => {
        mountedRef.current = false;
        window.clearTimeout(timeout.current);
      };
    }, [run]);
  };
  useSubscribeToScraping();

  const handleUpdateWebId = async updatedWebId => {
    setWebId(updatedWebId);
    await storeWebId(updatedWebId);
    // This happens when the user clears their WebId.
    if (!updatedWebId) {
      setRideData(null);
      setLastRefreshTime(null);
      await clearAllStoredData();
      return;
    }
    // Refresh the data with a new webId
    await handleRefresh();
  };

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);

    // TODO fix race condition causing you to have to read this from storage
    // instead of ReactState.
    const storedWebId = await getWebId();
    const rides = await scrapeRides(storedWebId);
    const refreshTime = new Date();
    setLastRefreshTime(refreshTime);
    await storeLastRefreshTime(refreshTime);

    setRideData(rides);
    await storeRideData(rides);

    setIsRefreshing(false);
  }, []);

  const refreshControl = (
    <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />
  );

  if (isRefreshing && (!lastRefreshTime || !rideData)) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <WebIdEntryForm
        savedWebId={webId}
        handleUpdateWebId={handleUpdateWebId}
      />
      {rideData && (
        <ScrollView refreshControl={refreshControl}>
          <HistoricRidesView
            ridesData={rideData}
            lastRefreshTime={lastRefreshTime}
            onlyShowTodays={true} />
          <SeasonStatsView ridesData={rideData} />
        </ScrollView>
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
