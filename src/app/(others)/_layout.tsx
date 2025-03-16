import { Stack } from "expo-router";

export default function _layout() {
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: "#0a0a0a",
        },
        headerTitleStyle: {
          color: "#fafafa",
          fontFamily: "MontserratRegular",
          fontSize: 16,
        },
        headerTintColor: "#fafafa",
      }}
    >
      <Stack.Screen name="edit-profile" options={{ title: "Edit profile" }} />
    </Stack>
  );
}
