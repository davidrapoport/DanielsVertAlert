const DEBUG_WEB_ID = 'L98110TQ-GJE-UP1';

import { Platform } from 'react-native';
import credentials from './credentials';

import {
  isSnowBirdLift,
  getSnowBirdLiftName,
  getSnowBirdVert,
} from './SnowbirdUtils';

export async function scrapeRides(webId) {
  const authCookies = await getAuthCookies();
  const headers = Object.assign({}, authCookies);
  headers['Content-Type'] = 'application/json';
  headers.Accept = 'application/json';
  headers['X-Requested-With'] = 'XMLHttpRequest';
  const headersAfterLogin = await loginUser(headers);
  const metadataResponse = await getUserMetadata(headersAfterLogin, webId);
  const metadataResponseBody = await metadataResponse.json();
  return await getRideData(
    metadataResponseBody,
    headersAfterLogin,
  );
}

const getAuthCookies = async () => {
  const url = 'https://shop.alta.com/my-ski-history';
  const headersResponse = await fetch(url);
  if (headersResponse.status !== 200) {
    throw new Error(`Request to alta.com failed with error 
                        code ${headersResponse.status}
                        Maybe the server is down or you aren't connected
                        to the internet?`);
  }
  const cookies = getCookiesFromResponseHeader(headersResponse.headers);
  const responseBody = await headersResponse.text();
  const CSRFToken = getCSRFToken(responseBody);
  cookies['X-CSRF-TOKEN'] = CSRFToken;
  return cookies;
};

const loginUser = async (requestHeaders) => {
  const data = credentials
  const url = 'https://shop.alta.com/customer/login';
  const loginResponse = await fetch(url, {
    method: 'POST',
    headers: requestHeaders,
    body: JSON.stringify(data),
  });
  if (loginResponse.status !== 200) {
    throw new Error(
      'Request to alta.com failed with error ' +
      `code ${loginResponse.status}. ` +
      "Maybe the server is down or you aren't connected " +
      'to the internet?',
    );
  }
  const cookies = getCookiesFromResponseHeader(loginResponse.headers);
  Object.assign(cookies, requestHeaders);
  return requestHeaders;
}

const getUserMetadata = async (requestHeaders, webId) => {
  const data = { wtp: webId, productId: 0 };
  const url = 'https://shop.alta.com/axess/ride-data';
  const webIdResponse = await fetch(url, {
    method: 'POST',
    headers: requestHeaders,
    body: JSON.stringify(data),
  });
  if (webIdResponse.status !== 200) {
    if (webIdResponse.status === 422) {
      throw new Error('Invalid Web Id, please re-enter it and try again.');
    }
    throw new Error(
      'Request to alta.com failed with error ' +
      `code ${webIdResponse.status}. ` +
      "Maybe the server is down or you aren't connected " +
      'to the internet?',
    );
  }
  return webIdResponse;
};

const getCookiesFromResponseHeader = responseHeader => {
  const headers = responseHeader.get('set-cookie');
  // Split into individual cookies
  const cookiesText = headers.split(',');
  let xsrfCookie = '';
  let xsrfToken = '';
  let altaSessionCookie = '';
  // Remove cookie metadata and keep COOKIE-NAME=COOKIEVALUE
  for (let cookieText of cookiesText) {
    const cookieData = cookieText.split(';')[0].trim();
    if (cookieData.startsWith('XSRF-TOKEN')) {
      xsrfCookie = cookieData;
      xsrfToken = cookieData.split('=')[1].trim();
    } else if (cookieData.startsWith('alta_ski_area_session')) {
      altaSessionCookie = cookieData;
    }
  }
  const cookies = { 'X-XSRF-TOKEN': xsrfToken };
  if (Platform.OS !== 'ios') {
    cookies.Cookie = xsrfCookie + '; ' + altaSessionCookie;
  }
  return cookies;
};

const getCSRFToken = response => {
  return /<meta name="csrf-token"\s*content="(\w*)"/gm.exec(response)[1];
};

// Need to extract the data from the auth response to use in the rides request.
// Also need to update to the new XSRF-TOKEN
const getRideData = async (
  authResponseBody,
  requestHeaders,
) => {
  let isCanyonEmp = false;
  for (let i = 0; i < authResponseBody.transactions.length; i++) {
    const transactions = authResponseBody.transactions[i];
    if (!transactions.SZPERSTYPENAME.trim().toLowerCase().startsWith("canyon emp") &&
      !transactions.SZPERSTYPENAME.trim().toLowerCase().startsWith("alta emp")) {
      continue;
    }
    isCanyonEmp = true;
    const rideRequestBody = {
      nposno: transactions.NPOSNO,
      nprojno: transactions.NPROJNO,
      nserialno: transactions.NSERIALNO,
      szvalidfrom: transactions.SZVALIDFROM,
    };
    const ridesResponse = await fetch('https://shop.alta.com/axess/rides', {
      method: 'POST',
      headers: requestHeaders,
      body: JSON.stringify(rideRequestBody),
    });
    if (ridesResponse.status !== 200) {
      continue;
    }
    const data = await ridesResponse.json();
    return parseRides(data);
  }
  if (!isCanyonEmp) {
    throw new Error('Sorry, this app is currently only available to Canyon Employees.');
  }
  throw new Error("Request to alta.com failed with error" +
    ` code ${ridesResponse.status}` +
    " Maybe the server is down or you aren't connected" +
    " to the internet?");
};

const parseRides = ridesJson => {
  const rides = ridesJson.rides;
  const parsed = [];
  rides.forEach(daysRides => {
    if (daysRides.length === 0) {
      return;
    }

    let parsedRides = daysRides.map(ride => {
      const rideData = {
        date: ride.SZDATEOFRIDE,
        isSnowBird: isSnowBirdLift(ride.SZPOENAME),
        time: ride.SZTIMEOFRIDE,
        timestamp: ride.SZDATEOFRIDE + 'T' + ride.SZTIMEOFRIDE,
      };
      if (isSnowBirdLift(ride.SZPOENAME)) {
        Object.assign(rideData, {
          vert: getSnowBirdVert(ride.SZPOENAME),
          lift: getSnowBirdLiftName(ride.SZPOENAME),
          isSnowBird: true,
        });
      } else {
        Object.assign(rideData, {
          vert: ride.NVERTICALFEET ?? 0,
          lift: ride.SZPOENAME,
          isSnowBird: false,
        });
      }
      return rideData;
    });
    parsedRides = filterOutSugarPass(parsedRides);
    parsedRides = dedupeLaps(parsedRides);

    parsed.push({
      date: daysRides[0].SZDATEOFRIDE,
      totalVert: getDaysVert(parsedRides),
      rides: parsedRides,
    });
  });
  return parsed;
};

const filterOutSugarPass = rides => {
  return rides.filter(ride => !ride.lift.startsWith('Sugar Pass'));
};

const dedupeLaps = rides => {
  const filteredRides = [];
  if (rides.length <= 1) {
    return rides;
  }
  for (let i = 0; i < rides.length - 1; i++) {
    const thisLapTime = new Date('1970-01-01T' + rides[i].time).getTime();
    const nextLapTime = new Date('1970-01-01T' + rides[i + 1].time).getTime();
    const diffSec = (nextLapTime - thisLapTime) / 1000;
    if (diffSec < 120) {
      continue;
    }
    filteredRides.push(rides[i]);
  }
  filteredRides.push(rides[rides.length - 1])
  return filteredRides;
}

const getDaysVert = rides => {
  return rides.reduce((acc, { vert }) => {
    return parseInt(vert) + acc;
  }, 0);
};
