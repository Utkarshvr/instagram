import { Redirect, Tabs } from "expo-router";

export default function TabLayout() {
  const isAuth = false;

  if (!isAuth) return <Redirect href={"/(auth)/login"} />;

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
