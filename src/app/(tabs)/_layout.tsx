import { router, Tabs, useSegments } from "expo-router";
import { onAuthStateChanged } from "firebase/auth";
import { ActivityIndicator, View } from "react-native";
import { auth } from "../_layout";
import { useEffect, useState } from "react";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={
        {
          // tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
          // headerShown: false,
          // tabBarButton: HapticTab,
          // tabBarBackground: TabBarBackground,
          // tabBarStyle: Platform.select({
          //   ios: {
          //     // Use a transparent background on iOS to show the blur effect
          //     position: "absolute",
          //   },
          //   default: {},
          // }),
        }
      }
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          // tabBarIcon: ({ color }) => (
          //   <IconSymbol size={28} name="house.fill" color={color} />
          // ),
        }}
      />
      {/* <Tabs.Screen
        name="explore"
        options={{
          title: "Explore",
          // tabBarIcon: ({ color }) => (
          //   <IconSymbol size={28} name="paperplane.fill" color={color} />
          // ),
        }}
      /> */}
    </Tabs>
  );
}
