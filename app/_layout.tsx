import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { useColorScheme } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Drawer } from 'expo-router/drawer';

import {
  MD3DarkTheme,
  MD3LightTheme,
  PaperProvider,
} from 'react-native-paper';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {

  const colorScheme = useColorScheme();
  const paperTheme = colorScheme === 'dark' ? { ...MD3DarkTheme } : { ...MD3LightTheme };

  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }


  return (
    <PaperProvider theme={paperTheme}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <Drawer>
          <Drawer.Screen
            name="index" // Matches app/(drawer)/index.tsx
            options={{
              drawerLabel: 'Home',
              title: 'Overview',
            }}
          />
          <Drawer.Screen
            name="grades" // Matches app/(drawer)/user/[id].tsx
            options={{
              drawerLabel: 'User',
              title: 'User Overview',
            }}
          />
        </Drawer>
      </GestureHandlerRootView>
    </PaperProvider >
  );
}
