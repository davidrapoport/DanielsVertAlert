import React, { useCallback, useEffect } from 'react';
import {
  StyleSheet,
  View,
  RefreshControl,
  ActivityIndicator,
  AppState,
} from 'react-native';
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
  getVertGoal,
  storeVertGoal,
} from './src/Storage';
import TabNavigator from './src/views/TabNavigator';
import WebIdEntryForm from './src/components/WebIdEntryForm';
import FlashMessage, { showMessage } from 'react-native-flash-message';
import {
  initBackgroundFetch,
  passedDailyVertThreshold,
  requestNotificationPermission,
} from './src/BackgroundProcessing';

function App() {
  const [webId, setWebId] = React.useState();
  const [rideData, setRideData] = React.useState();
  const [lastRefreshTime, setLastRefreshTime] = React.useState();
  const [vertGoal, setVertGoal] = React.useState(1e6);
  const [isRefreshing, setIsRefreshing] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);

  useEffect(() => {
    const handleAppStateChange = async state => {
      if (state === 'background') {
        return;
      }
      const storedLastRefreshTime = await getLastRefreshTime()
      const storedRides = await getRideData();
      if (!storedLastRefreshTime || !storedRides) {
        return;
      }
      if (!lastRefreshTime) {
        setLastRefreshTime(storedLastRefreshTime);
        setRideData(storedRides);
      }
      if (storedLastRefreshTime > lastRefreshTime) {
        setLastRefreshTime(storedLastRefreshTime);
        setRideData(storedRides);
      }
    };
    const subscription = AppState.addEventListener('change', handleAppStateChange);
    return () => subscription.remove();
  }, [lastRefreshTime, rideData]);

  // Load saved data from AsyncStorage onComponentDidMount.
  useEffect(() => {
    const loadSavedData = async () => {
      setIsLoading(true);
      const savedWebId = await getWebId();
      const savedRefreshTime = await getLastRefreshTime();
      const savedRideData = await getRideData();
      const savedVertGoal = await getVertGoal();
      if (savedWebId) {
        setWebId(savedWebId);
      }
      if (savedRefreshTime) {
        setLastRefreshTime(savedRefreshTime);
      }
      if (savedRideData) {
        setRideData(savedRideData);
      }
      if (savedVertGoal) {
        setVertGoal(savedVertGoal);
      }
      setIsLoading(false);
    };
    loadSavedData();
    initBackgroundFetch();
    setTimeout(requestNotificationPermission, 3 * 1000);
  }, []);

  useEffect(() => {
    // Set a timer to poll data every 5 minutes when the app
    // is in the foreground. Headless calls will be used for
    // background sync.
    const pollRideData = async () => {
      // Should scrape rides ensures that refreshes don't happen
      // more than once every 5 minutes.
      if (await shouldScrapeRides()) {
        await handleRefresh();
      }
    };
    const interval = setInterval(async () => {
      await pollRideData();
    }, 15 * 1000);
    return () => {
      clearInterval(interval);
    };
  }, [handleRefresh]);

  const clearAllData = async () => {
    setRideData(null);
    setLastRefreshTime(null);
    setWebId(null);
    setVertGoal(1e6);
    await clearAllStoredData();
  };

  const handleUpdateWebId = async updatedWebId => {
    setWebId(updatedWebId);
    await storeWebId(updatedWebId);
    // This happens when the user clears their WebId.
    if (!updatedWebId) {
      await clearAllData();
      return;
    }
    // Refresh the data with a new webId
    await handleRefresh();
  };

  const handleUpdateVertGoal = async updatedVertGoal => {
    setVertGoal(updatedVertGoal);
    await storeVertGoal(updatedVertGoal);
  };

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);

    const storedWebId = await getWebId();
    const storedRides = await getRideData();
    let rides;
    try {
      rides = await scrapeRides(storedWebId);
    } catch (thrownError) {
      // Only clear all the data if this is the first attempt to load data.
      if (!storedRides) {
        await clearAllData();
      }
      setIsRefreshing(false);
      showMessage({
        message: thrownError.message,
        type: 'danger',
        duration: 5000,
      });
      return;
    }
    const refreshTime = new Date();
    setLastRefreshTime(refreshTime);
    await storeLastRefreshTime(refreshTime);

    setRideData(rides);
    await storeRideData(rides);

    setIsRefreshing(false);
    if (passedDailyVertThreshold(storedRides, rides)) {
      showMessage({
        message: 'Congrats! You passed 20k feet for the day. Now go home',
        type: 'success',
        duration: 5000,
      });
    }
  }, []);

  const refreshControl = (
    <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />
  );

  if ((isRefreshing && (!lastRefreshTime || !rideData)) || isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
        <FlashMessage position={'top'} />
      </View>
    );
  }

  if (!webId) {
    return (
      <View style={styles.container}>
        <WebIdEntryForm
          savedWebId={webId}
          handleUpdateWebId={handleUpdateWebId}
        />
        <FlashMessage position={'top'} />
      </View>
    );
  }

  // TODO what does a season pass with no rides look like from the API?

  //TODO migrate to React.Context
  return (
    <>
      <TabNavigator
        rideData={rideData}
        refreshControl={refreshControl}
        savedWebId={webId}
        resetWebId={() => handleUpdateWebId('')}
        lastRefreshTime={lastRefreshTime}
        vertGoal={vertGoal}
        handleUpdateVertGoal={handleUpdateVertGoal}
      />
      <FlashMessage position={'top'} />
    </>
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
