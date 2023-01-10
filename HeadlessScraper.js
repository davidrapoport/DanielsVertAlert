import React from "react";

const { scrapeRides } = require("./src/Scraper")
const { shouldScrapeRides } = require("./src/ScraperController");
const { storeRideData, storeLastRefreshTime, getWebId } = require("./src/Storage");

module.exports = async taskData => {
    if (shouldScrapeRides) {
        const webID = getWebId()
        const rides = await scrapeRides(webID);
        await storeRideData(rides);

        const refreshTime = new Date();
        await storeLastRefreshTime(refreshTime);
    }
}