import { useFonts } from 'expo-font';
import { Stack, Tabs, useNavigation } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
// import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { useColorScheme } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Drawer } from 'expo-router/drawer';

import {
  MD3DarkTheme,
  MD3LightTheme,
  PaperProvider,
} from 'react-native-paper';
// import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

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
        <Drawer screenOptions={{
          headerStyle: {
            backgroundColor: paperTheme.colors.surface, // header background color
          },
          headerTintColor: '#ffffff', // header text color (title & back button)
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}>
          <Drawer.Screen
            name="index"
            options={{
              drawerLabel: 'Index',
              title: 'Overview',
              drawerItemStyle: { display: 'none' },
            }}
          />
          <Drawer.Screen
            name="(tabs)/init"
            options={{
              drawerLabel: 'Initialization',
              title: '',
              swipeEnabled: false, // disable just for this screen.
              headerShown: false, // hide the header for this screen.
              drawerItemStyle: { display: 'none' },
            }}
          />
          <Drawer.Screen
            name="(tabs)/auth"
            options={{
              drawerLabel: 'Login',
              title: 'Login',
              swipeEnabled: false, // disable just for this screen.
              headerShown: false, // hide the header for this screen.
              drawerItemStyle: { display: 'none' },
            }}
          />
          <Drawer.Screen
            name="(tabs)/overview"
            options={{
              drawerLabel: '',
              title: '',
              swipeEnabled: false, // disable just for this screen.
              headerShown: false, // hide the header for this screen.
              drawerItemStyle: { display: 'none' },
            }}
          />
          <Drawer.Screen
            name="(tabs)/exam_schedule"
            options={{
              drawerLabel: 'ตารางสอบ',
              title: 'ตารางสอบ',
            }}
          />
          <Drawer.Screen
            name="(tabs)/learning_plan"
            options={{
              drawerLabel: 'แผนการเรียน',
              title: 'แผนการเรียน',
            }}
          />
          <Drawer.Screen
            name="(tabs)/class_scheduleTable"
            options={{
              drawerLabel: 'ตารางเรียนทั้งหมด',
              title: 'ตารางเรียน',
            }}
          />
          <Drawer.Screen
            name="(tabs)/grades"
            options={{
              drawerLabel: 'ผลการเรียน',
              title: 'ผลการเรียน',
            }}
          />
          <Drawer.Screen
            name="(tabs)/academic_statistics"
            options={{
              drawerLabel: 'Academic Statistics',
              title: 'Academic Statistics',
            }}
          />
          <Drawer.Screen
            name="courseschedule_planner"
            options={{
              drawerLabel: 'ตารางเรียน',
              title: 'ตารางเรียน',
              headerShown: false, // hide the header for this screen.

            }}
          />
          <Drawer.Screen
            name="+not-found"
            options={{
              drawerLabel: '',
              title: '',
              // drawerItemStyle: { display: 'none' },
            }}
          />
          <Drawer.Screen
            name="(tabs)/gpa_Calculator"
            options={{
              drawerLabel: '',
              title: '',
              drawerItemStyle: { display: 'none' },
            }}
          />

        </Drawer>
        {/* <StatusBar /> */}
      </GestureHandlerRootView>
    </PaperProvider >
  );
}
