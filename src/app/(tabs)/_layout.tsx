import { Tabs } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import InstaDarkSvg from "@/src/assets/insta-dark-svg.svg";
import { auth } from "../_layout";
import { useEffect, useState } from "react";
import LoadingScreen from "@/src/components/LoadingScreen";
import useUserStore from "@/src/store/userStore";
import { Image, Text } from "react-native";

export default function TabLayout() {
  const [hasVerifiedUsername, setHasVerifiedUsername] = useState(false);
  const user = auth.currentUser;
  const { fetchUser, user: userInfo } = useUserStore();

  useEffect(() => {
    if (user && !hasVerifiedUsername) {
      user?.uid && fetchUser(user?.uid);
      setHasVerifiedUsername(true);
    }
  }, [user, hasVerifiedUsername]);

  if (!hasVerifiedUsername) return <LoadingScreen />;

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#fafafa",
        headerShown: true,
        headerStyle: {
          backgroundColor: "#0a0a0a",
        },
        headerTitleStyle: { color: "#fafafa", fontFamily: "MontserratRegular" },
        tabBarStyle: {
          backgroundColor: "#0a0a0a",
          borderTopWidth: 0,
        },
      }}
      initialRouteName="create"
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Instagram",
          headerTitleStyle: { display: "none" },
          headerLeft: () => {
            return <InstaDarkSvg width={160} />;
          },
          tabBarShowLabel: false,
          tabBarIcon: ({ color, focused, size }) => (
            <Ionicons
              name={focused ? "home" : "home-outline"}
              size={24}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: "Explore",
          headerTitleStyle: { display: "none" },

          tabBarShowLabel: false,
          headerShown: false,
          tabBarIcon: ({ color, focused, size }) => (
            <Ionicons
              name={focused ? "search" : "search-outline"}
              size={26}
              color={color}
              // onLongPress={() => {
              //   Haptics.selectionAsync();
              //   router.push("/explore/search");
              // }}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="create"
        options={{
          title: "Create",
          headerTitleStyle: { display: "none" },

          tabBarShowLabel: false,
          headerShown: false,
          tabBarIcon: ({ color, focused, size }) => (
            <Ionicons
              name={focused ? "add-circle-outline" : "add-circle"}
              size={26}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="notifications"
        options={{
          title: "Notifications",
          headerTitleStyle: { display: "none" },

          tabBarShowLabel: false,
          headerShown: false,
          tabBarIcon: ({ color, focused, size }) => (
            <Ionicons
              name={focused ? "heart" : "heart-outline"}
              size={26}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          headerTitleStyle: { display: "none" },
          headerLeft: () => {
            return (
              <Text className="ml-4 text-neutral-50 text-lg font-montserratSemiBold">
                {userInfo?.username}
              </Text>
            );
          },
          tabBarShowLabel: false,
          tabBarIcon: ({ color, focused, size }) =>
            userInfo?.picture ? (
              <Image
                className={`${
                  focused ? "border-neutral-300 border-2" : null
                } rounded-full w-[26px] h-[26px]`}
                source={{ uri: userInfo.picture }}
              />
            ) : (
              <Ionicons
                name={focused ? "person-circle" : "person-circle-outline"}
                size={26}
                color={color}
              />
            ),
        }}
      />
    </Tabs>
  );
}
