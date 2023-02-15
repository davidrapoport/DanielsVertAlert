import BackgroundFetch from 'react-native-background-fetch';
import { getWebId, getLastRefreshTime, storeRideData, storeLastRefreshTime } from './Storage';
import { shouldScrapeRides, } from './ScraperController';
import { scrapeRides } from './Scraper';

export async function initBackgroundFetch() {
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

    let status = await BackgroundFetch.configure(
        {
            minimumFetchInterval: 15,
            stopOnTerminate: false,
            enableHeadless: true,
        },
        onEvent, onTimeout);
    console.log('[BackgroundFetch] configure status: ', status);
}