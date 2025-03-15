import { Tabs } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import InstaDarkSvg from "@/src/assets/insta-dark-svg.svg";
import { SvgUri } from "react-native-svg";

export default function TabLayout() {
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
            return (
              <InstaDarkSvg width={160} />
              // <SvgUri
              //   width="100%"
              //   height="100%"
              //   uri="https://dev.w3.org/SVG/tools/svgweb/samples/svg-files/android.svg"
              // />

              // <Image
              //   className="ml-4"
              //   source={require("../../assets/insta-dark-svg.svg")}
              // />
            );
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
