import SearchBar from "@/src/components/SearchBar";
import { Stack } from "expo-router";

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
          headerRight: () => <SearchBar pushToSearch />,
        }}
      />
      <Stack.Screen
        name="search"
        options={{
          headerShown: true,
          headerRight: () => <SearchBar />,
        }}
      />
    </Stack>
  );
}
