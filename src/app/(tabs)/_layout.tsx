import { router, Tabs } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import InstaDarkSvg from "@/src/assets/insta-dark-svg.svg";
import { auth, db } from "../_layout";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import LoadingScreen from "@/src/components/LoadingScreen";
import useUserStore from "@/src/store/userStore";
import UserType from "@/src/types/UserType";
import { Text } from "react-native";

export default function TabLayout() {
  const [hasVerifiedUsername, setHasVerifiedUsername] = useState(false);
  const user = auth.currentUser;
  const { user: userInfo, setUser } = useUserStore();

  useEffect(() => {
    if (user && !hasVerifiedUsername) {
      (async () => {
        // Reference to the document
        const docRef = doc(db, "users", user.uid);

        // Fetch the document
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const userDoc = docSnap.data() as UserType;
          setUser(userDoc);

          if (userDoc.username) setHasVerifiedUsername(true);
          else router.replace("/(auth)/(onboarding)/username");
        } else {
          console.log("No such document!");
        }
      })();
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
      initialRouteName="profile"
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
          tabBarIcon: ({ color, focused, size }) => (
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
