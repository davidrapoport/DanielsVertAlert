const DEBUG_WEB_ID = "L98110TQ-GJE-UP1"

export async function scrapeRides(webId) {
    const authCookies = await getAuthCookies();
    const headers = Object.assign({}, authCookies);
    headers['Content-Type'] = 'application/json';
    headers.Accept = 'application/json';
    headers['X-Requested-With'] = 'XMLHttpRequest';
    const metadataResponse = await getUserMetadata(headers, webId);
    const metadataResponseBody = await metadataResponse.json();
    return await getRideData(metadataResponseBody, metadataResponse.headers, headers);
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
        throw new Error(`Request to alta.com failed with error 
                        code ${webIdResponse.status}
                        Maybe the server is down or you aren't connected
                        to the internet?`);
    }
    return webIdResponse;
}

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
    return {
        Cookie: xsrfCookie + '; ' + altaSessionCookie,
        'X-XSRF-TOKEN': xsrfToken,
    };
};

const getCSRFToken = response => {
    return /<meta name="csrf-token"\s*content="(\w*)"/gm.exec(response)[1];
};

// Need to extract the data from the auth response to use in the rides request.
// Also need to update to the new XSRF-TOKEN
const getRideData = async (
    authResponseBody,
    authResponseHeaders,
    requestHeaders,
) => {
    // TODO error handling of malformed WTP.
    const transactions = authResponseBody.transactions[0];
    const rideRequestBody = {
        nposno: transactions.NPOSNO,
        nprojno: transactions.NPROJNO,
        nserialno: transactions.NSERIALNO,
        szvalidfrom: transactions.SZVALIDFROM,
    };
    const cookies = getCookiesFromResponseHeader(authResponseHeaders);
    Object.assign(cookies, requestHeaders);
    const ridesResponse = await fetch('https://shop.alta.com/axess/rides', {
        method: 'POST',
        headers: requestHeaders,
        body: JSON.stringify(rideRequestBody),
    });
    if (ridesResponse.status !== 200) {
        throw new Error(`Request to alta.com failed with error 
                        code ${ridesResponse.status}
                        Maybe the server is down or you aren't connected
                        to the internet?`);
    }
    const data = await ridesResponse.json();
    return parseRides(data);
};


const parseRides = ridesJson => {
    const rides = ridesJson.rides;
    const parsed = [];
    rides.forEach(daysRides => {
        if (daysRides.length === 0) {
            return;
        }

        parsed.push({
            date: daysRides[0].SZDATEOFRIDE,
            totalVert: daysRides[0].total,
            rides: daysRides.map(ride => {
                return {
                    date: ride.SZDATEOFRIDE,
                    vert: ride.NVERTICALFEET,
                    time: ride.SZTIMEOFRIDE,
                    lift: ride.SZPOENAME,
                    timestamp: ride.SZDATEOFRIDE + 'T' + ride.SZTIMEOFRIDE,
                };
            })
        });
    });
    return parsed;
};
