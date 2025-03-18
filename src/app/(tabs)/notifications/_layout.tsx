import { Stack } from "expo-router";
import { Text } from "react-native";

export default function _layout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: "#0a0a0a",
        },
        headerTitleStyle: { color: "#fafafa", fontFamily: "MontserratRegular" },
        headerTintColor: "#fafafa",
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          headerShown: true,
          headerTitle: () => (
            <Text className="text-neutral-50 font-montserratSemiBold">
              Notifications
            </Text>
          ),
        }}
      />
      <Stack.Screen
        name="follow_requests"
        options={{
          headerShown: true,
          headerTitle: () => (
            <Text className="text-neutral-50 font-montserratSemiBold">
              Follow requests
            </Text>
          ),
        }}
      />
    </Stack>
  );
}
