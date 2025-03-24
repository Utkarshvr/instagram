import * as SplashScreen from "expo-splash-screen";
import { useFonts } from "expo-font";
import { router, Stack, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import "react-native-reanimated";
import "../../global.css";

import {
  Montserrat_400Regular,
  Montserrat_600SemiBold,
  Montserrat_700Bold,
} from "@expo-google-fonts/montserrat";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

import { initializeApp } from "firebase/app";
import { onAuthStateChanged } from "firebase/auth";

import firebaseConfig from "@/constants/firebaseConfig";

// Initialize Firebase
const app = initializeApp(firebaseConfig);

import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
import LoadingScreen from "../components/LoadingScreen";

// Initialize Auth
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});
// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

import { ActionSheetProvider } from "@expo/react-native-action-sheet";

export default function RootLayout() {
  const [loaded] = useFonts({
    // SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    MontserratRegular: Montserrat_400Regular,
    MontserratSemiBold: Montserrat_600SemiBold,
    MontserratBold: Montserrat_700Bold,
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  // Set an initializing state whilst Firebase connects
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();

  const segments = useSegments();

  // Handle user state changes
  function onAuthChanged(user: any) {
    setUser(user);
    if (initializing) setInitializing(false);
  }

  useEffect(() => {
    const subscriber = onAuthStateChanged(auth, onAuthChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  useEffect(() => {
    if (initializing) return;

    const inAuthGroup = segments[0] === "(auth)";
    if (user && inAuthGroup) router.replace("/(tabs)");
    else if (!user) router.replace("/(auth)/login");
  }, [user, initializing]);

  // console.log({ user });

  if (initializing) return <LoadingScreen />;

  return (
    <ActionSheetProvider>
      <>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="(others)" />
          <Stack.Screen name="+not-found" />
        </Stack>
        <StatusBar style="light" />
      </>
    </ActionSheetProvider>
  );
}
