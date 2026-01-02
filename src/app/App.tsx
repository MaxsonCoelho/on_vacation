import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { AppNavigator } from './navigation/AppNavigator';
import { SyncProvider } from '../core/offline/SyncProvider';

export default function App() {
  return (
    <SyncProvider>
      <StatusBar style="dark" />
      <AppNavigator />
    </SyncProvider>
  );
}
