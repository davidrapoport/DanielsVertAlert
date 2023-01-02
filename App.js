import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { getRides } from './src/Scraper';

import WebIdEntryForm from './src/WebIdEntryForm';

const WEB_ID_KEY = '@WEB_ID_KEY';

export async function getWebId() {
  return await AsyncStorage.getItem(WEB_ID_KEY);
}

const storeWebId = async webId => {
  return await AsyncStorage.setItem(WEB_ID_KEY, webId);
};

const App = () => {
  const [webId, setWebId] = React.useState();
  useEffect(() => {
    const loadWebId = async () => {
      const savedWebId = getWebId();
      if (savedWebId) {
        setWebId(savedWebId);
      }
    };
    loadWebId();
  }, []);

  const handleUpdateWebId = async updatedWebId => {
    setWebId(updatedWebId);
    await storeWebId(updatedWebId);
    await getRides(updatedWebId);
  };

  return (
    <View style={styles.container}>
      <WebIdEntryForm
        savedWebId={webId}
        handleUpdateWebId={handleUpdateWebId}
      />
    </View>
  );
};

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
