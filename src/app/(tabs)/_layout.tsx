import { router, Tabs } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import InstaDarkSvg from "@/src/assets/insta-dark-svg.svg";
import { auth, db } from "../_layout";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import LoadingScreen from "@/src/components/LoadingScreen";

export default function TabLayout() {
  const [isVerifyingUsername, setIsVerifyingUsername] = useState(true);
  const user = auth.currentUser;

  useEffect(() => {
    if (user) {
      (async () => {
        // Reference to the document
        const docRef = doc(db, "users", user.uid);

        // Fetch the document
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const user = docSnap.data();

          console.log("User: ", user);

          if (user.username) setIsVerifyingUsername(false);
          else router.replace("/(auth)/(onboarding)/username");
        } else {
          console.log("No such document!");
        }
      })();
    }
  }, [user]);

  if (isVerifyingUsername) return <LoadingScreen />;

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
              size={size}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}
