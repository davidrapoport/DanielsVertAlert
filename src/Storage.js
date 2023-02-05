import AsyncStorage from '@react-native-async-storage/async-storage';

const WEB_ID_KEY = '@WEB_ID_KEY';
const RIDE_DATA_KEY = '@RIDE_DATA_KEY';
const LAST_REFRESH_KEY = '@LAST_REFRESH_KEY';
const VERT_GOAL_KEY = '@VERT_GOAL_KEY';

export async function clearAllStoredData() {
    await AsyncStorage.removeItem(WEB_ID_KEY);
    await AsyncStorage.removeItem(RIDE_DATA_KEY);
    await AsyncStorage.removeItem(LAST_REFRESH_KEY);
}

export async function getWebId() {
    return await AsyncStorage.getItem(WEB_ID_KEY);
}

export async function storeWebId(webId) {
    return await AsyncStorage.setItem(WEB_ID_KEY, webId);
}

export async function getLastRefreshTime() {
    const refreshTime = await AsyncStorage.getItem(LAST_REFRESH_KEY);
    if (refreshTime === null) {
        return null;
    }
    return new Date(JSON.parse(refreshTime));
}

export async function storeLastRefreshTime(refreshTime) {
    return await AsyncStorage.setItem(LAST_REFRESH_KEY, JSON.stringify(refreshTime));
};

export async function getRideData() {
    const rideData = await AsyncStorage.getItem(RIDE_DATA_KEY);
    return rideData != null ? JSON.parse(rideData) : null;
}

export async function storeRideData(rideData) {
    return await AsyncStorage.setItem(RIDE_DATA_KEY, JSON.stringify(rideData));
};

export async function getVertGoal() {
    const vertGoal = await AsyncStorage.getItem(VERT_GOAL_KEY);
    return parseInt(vertGoal, 10) ?? 1e6;
}

export async function storeVertGoal(vertGoal) {
    return await AsyncStorage.setItem(VERT_GOAL_KEY, "" + vertGoal);
};

