import React, { useCallback, useEffect } from 'react';
import { StyleSheet, View, RefreshControl, ActivityIndicator } from 'react-native';
import BackgroundFetch from 'react-native-background-fetch';
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

function App() {
  const [webId, setWebId] = React.useState();
  const [rideData, setRideData] = React.useState();
  const [lastRefreshTime, setLastRefreshTime] = React.useState();
  const [vertGoal, setVertGoal] = React.useState(1e6);
  const [isRefreshing, setIsRefreshing] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);

  async function initBackgroundFetch() {
    const onEvent = async (taskId) => {
      console.log('[BackgroundFetch] task: ', taskId);
      const storedWebId = await getWebId();
      const storedLastRefreshTime = await getLastRefreshTime();
      if (!storedWebId || !storedLastRefreshTime) {
        console.log("[BackgroundFetch] Attempted to run background task but " +
          "stored data was empty " + `webId: ${storedWebId} refreshTime ${storeLastRefreshTime}`);
      } else if (!(await shouldScrapeRides())) {
        console.log("[BackgroundFetch] aborted because shouldScrapeRidesReturned false");
      } else {
        try {
          const rides = await scrapeRides(storedWebId);
          const date = new Date();
          setLastRefreshTime(date);
          await storeLastRefreshTime(date);
          await storeRideData(rides);
          console.log("[BackgroundFetch] Succeeded at " + date.toISOString() + " with " + rides);
        } catch (thrownError) {
          console.error("[BackgroundFetch] fetch failed with " + thrownError.message);
        }
      }
      BackgroundFetch.finish(taskId);
    }

    const onTimeout = async (taskId) => {
      console.warn('[BackgroundFetch] TIMEOUT task: ', taskId);
      BackgroundFetch.finish(taskId);
    }

    // Initialize BackgroundFetch only once when component mounts.
    let status = await BackgroundFetch.configure(
      {
        minimumFetchInterval: 15,
        stopOnTerminate: false,
        enableHeadless: true,
      },
      onEvent, onTimeout);
    console.log('[BackgroundFetch] configure status: ', status);
  }

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
  }

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
  }

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);

    // TODO fix race condition causing you to have to read this from storage
    // instead of ReactState.
    const storedWebId = await getWebId();
    let rides;
    try {
      rides = await scrapeRides(storedWebId);
    } catch (thrownError) {
      // Only clear all the data if this is the first attempt to load data.
      const storedRideData = await getRideData();
      if (!rideData && !storedRideData) {
        await clearAllData();
      }
      setIsRefreshing(false);
      showMessage({ message: thrownError.message, type: 'danger', duration: 5000 });
      return;
    }
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
        <WebIdEntryForm savedWebId={webId} handleUpdateWebId={handleUpdateWebId} />
        <FlashMessage position={'top'} />
      </View>
    )
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
        handleUpdateVertGoal={handleUpdateVertGoal} />
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
