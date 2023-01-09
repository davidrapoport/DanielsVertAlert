import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import RidesView from './src/RidesView';
import { getRides } from './src/Scraper';

import WebIdEntryForm from './src/WebIdEntryForm';

const WEB_ID_KEY = '@WEB_ID_KEY';

export async function getWebId() {
  return await AsyncStorage.getItem(WEB_ID_KEY);
}

const storeWebId = async webId => {
  return await AsyncStorage.setItem(WEB_ID_KEY, webId);
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

function App() {
  const [webId, setWebId] = React.useState();
  const [rideData, setRideData] = React.useState();
  useEffect(() => {
    const loadWebId = async () => {
      const savedWebId = getWebId();
      if (savedWebId) {
        setWebId(savedWebId);
      }
    };
    loadWebId();
  }, []);

  const handleUpdateWebId = async (updatedWebId) => {
    setWebId(updatedWebId);
    await storeWebId(updatedWebId);
    const rides = await getRides(updatedWebId);
    setRideData(parseRides(rides));
  };


  console.log(rideData);

  return (
    <View style={styles.container}>
      <WebIdEntryForm
        savedWebId={webId}
        handleUpdateWebId={handleUpdateWebId} />
      {rideData && <RidesView ridesData={rideData} />}
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
