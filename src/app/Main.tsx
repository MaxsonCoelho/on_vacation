import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AppNavigator } from './navigation/AppNavigator';
import { initOfflineDatabase } from '../core/offline';
import { NetworkMonitor } from '../core/offline/connectivity/NetworkMonitor';
import { SyncProvider } from '../core/offline/SyncProvider';

export default function Main() {
  const [isDbReady, setIsDbReady] = React.useState(false);

  useEffect(() => {
    const setup = async () => {
      await initOfflineDatabase();
      NetworkMonitor.init();
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
        <SyncProvider>
          <StatusBar style="dark" />
          <AppNavigator />
        </SyncProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
