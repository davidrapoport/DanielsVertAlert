import {getCurrentDateAlta} from './RideUtils';
import {getLastRefreshTime, getWebId} from './Storage';

const FIVE_MIN_MILLIS = 5 * 60 * 1000;

export const shouldScrapeRides = async () => {
  // Ensure the users webID is set.
  const webID = await getWebId();
  if (webID === null) {
    return false;
  }
  const currentDateAlta = getCurrentDateAlta();
  // Only scrape if it's been more than 5 minutes.
  const lastRefreshTime = await getLastRefreshTime();
  if (lastRefreshTime !== null) {
    if (
      currentDateAlta.getTime() - lastRefreshTime.getTime() <
      FIVE_MIN_MILLIS
    ) {
      return false;
    }
  }
  // Only return true between 9:00 AM and 5:00 PM
  if (currentDateAlta.getHours() < 9 || currentDateAlta.getHours > 16) {
    return false;
  }
  // Only return true between Nov 15 and Apr 30
  if (currentDateAlta.getMonth() + 1 >= 11 && currentDateAlta.getDay() >= 15) {
    return true;
  }
  if (currentDateAlta.getMonth() + 1 <= 4 && currentDateAlta.getDay() <= 30) {
    return true;
  }
  return false;
};
