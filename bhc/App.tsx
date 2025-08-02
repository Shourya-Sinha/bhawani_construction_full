/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */
import AppNavigator from './src/navigation/AppNavigator';
import {
  ActivityIndicator,
  Animated,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  useColorScheme,
  View,
} from 'react-native';
import { colors } from './src/styles/colors';
import { Provider } from 'react-redux';
import { persistor, store } from './src/redux/store.ts';
import { PersistGate } from 'redux-persist/integration/react';

function App() {
  const isDarkMode = useColorScheme() === 'dark';


  return (
    <>
      <Provider store={store}>
        <PersistGate loading={<ActivityIndicator />} persistor={persistor}>
          <View style={styles.container}>
            <StatusBar
              barStyle="light-content"
              backgroundColor={colors.background}
            />

            <AppNavigator />
          </View>
        </PersistGate>

      </Provider>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
});

export default App;
