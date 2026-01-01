import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AppNavigator } from './navigation/AppNavigator';
import { initDB } from '../core/services/sqlite';

export default function Main() {
  const [isDbReady, setIsDbReady] = React.useState(false);

  useEffect(() => {
    const setup = async () => {
      await initDB();
      setIsDbReady(true);
    };
    setup();
  }, []);

  if (!isDbReady) {
    return null; // Or a Splash Screen component
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <StatusBar style="dark" />
        <AppNavigator />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
