import { Stack } from 'expo-router';
import { Platform } from 'react-native';

import { migrateDbIfNeeded } from '../database/initDatabase';

let SQLiteProvider: any = null;

if (Platform.OS !== 'web') {
  SQLiteProvider = require('expo-sqlite').SQLiteProvider;
}

export default function RootLayout() {

  // WEB
  if (Platform.OS === 'web') {
    return (
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
      </Stack>
    );
  }

  // MOBILE
  return (
    <SQLiteProvider
      databaseName="sistema-vitta.db"
      onInit={migrateDbIfNeeded}
    >
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
      </Stack>
    </SQLiteProvider>
  );
}