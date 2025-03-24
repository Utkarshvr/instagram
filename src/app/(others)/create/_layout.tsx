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
        name="post"
        options={{
          headerShown: true,
          headerTitle: () => (
            <Text className="text-neutral-50 font-montserratSemiBold">
              New post
            </Text>
          ),
        }}
      />
    </Stack>
  );
}
