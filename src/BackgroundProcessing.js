import BackgroundFetch from 'react-native-background-fetch';
import {
  getWebId,
  getLastRefreshTime,
  storeRideData,
  storeLastRefreshTime,
  getNotificationStatus,
  storeNotificationStatus,
  getRideData,
} from './Storage';
import { shouldScrapeRides } from './ScraperController';
import { scrapeRides } from './Scraper';
import notifee from '@notifee/react-native';
import { Alert } from 'react-native';
import { sortDescending } from './RideUtils';

export async function initBackgroundFetch() {
  const onEvent = async taskId => {
    console.log('[BackgroundFetch] task: ', taskId);
    const storedWebId = await getWebId();
    const storedLastRefreshTime = await getLastRefreshTime();
    const storedRides = await getRideData();
    if (!storedWebId || !storedLastRefreshTime || !storedRides) {
      console.log(
        '[BackgroundFetch] Attempted to run background task but ' +
        'stored data was empty ' +
        `webId: ${storedWebId} refreshTime ${storeLastRefreshTime}`,
      );
    } else if (!(await shouldScrapeRides())) {
      console.log(
        '[BackgroundFetch] aborted because shouldScrapeRidesReturned false',
      );
    } else {
      try {
        const rides = await scrapeRides(storedWebId);
        const date = new Date();
        await storeLastRefreshTime(date);
        await storeRideData(rides);
        console.log(
          '[BackgroundFetch] Succeeded at ' +
          date.toISOString() +
          ' with ' +
          rides,
        );
        if (passedDailyVertThreshold(storedRides, rides)) {
          await displayNotification(
            'Vert Alert!',
            "Congrats! You've hit 20k vert. Time to go home.",
          );
        }
      } catch (thrownError) {
        console.error(
          '[BackgroundFetch] fetch failed with ' + thrownError.message,
        );
      }
    }
    BackgroundFetch.finish(taskId);
  };

  const onTimeout = async taskId => {
    console.warn('[BackgroundFetch] TIMEOUT task: ', taskId);
    BackgroundFetch.finish(taskId);
  };

  let status = await BackgroundFetch.configure(
    {
      minimumFetchInterval: 15,
      stopOnTerminate: false,
      enableHeadless: true,
    },
    onEvent,
    onTimeout,
  );
  console.log('[BackgroundFetch] configure status: ', status);
}

export function passedDailyVertThreshold(oldRides, newRides) {
  if (!oldRides || !newRides) {
    console.error("Got an empty rides list when checking thresholds");
    return false;
  }
  if (oldRides.length !== newRides.length) {
    return false;
  }
  if (!oldRides.length) {
    return false;
  }
  const oldVert = sortDescending(oldRides)[0].totalVert;
  const newVert = sortDescending(newRides)[0].totalVert;
  const VERT_THRESHOLD = 20000;
  return oldVert < VERT_THRESHOLD && newVert > VERT_THRESHOLD;
}

export async function displayNotification(title, body) {
  await notifee.requestPermission();
  const channelId = await notifee.createChannel({
    id: 'default',
    name: 'Default Channel',
  });
  await notifee.displayNotification({
    title: title,
    body: body,
    android: {
      channelId,
      smallIcon: 'ic_stat_name',
      pressAction: {
        id: 'default',
      },
    },
  });
}

export async function requestNotificationPermission() {
  const notificationMessageShown = await getNotificationStatus();
  if (notificationMessageShown) {
    return;
  }
  Alert.alert(
    'Turn on Vert Alerts?',
    'Would you like to turn on notifications' +
    ' for when you hit 20k vert for the day so that you know when you can go back inside? ' +
    'You can always turn this off later in settings.',
    [
      {
        text: 'No',
        onPress: async () => {
          await storeNotificationStatus(true);
        },
        style: 'cancel',
      },
      {
        text: 'Yes',
        onPress: async () => {
          await storeNotificationStatus(true);
          await notifee.requestPermission();
        },
        style: 'cancel',
      },
    ],
    {
      onDismiss: async () => {
        await storeNotificationStatus(true);
      },
      userInterfaceStyle: 'light',
    },
  );
}
