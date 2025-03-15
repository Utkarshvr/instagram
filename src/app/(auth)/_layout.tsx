import { Stack } from "expo-router";

export default function _layout() {
  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen
          name="login"
          options={{
            headerShown: false,
            animation: "slide_from_left",
            animationTypeForReplace: "push",
          }}
        />
        <Stack.Screen
          name="register"
          options={{
            headerShown: false,
            animation: "slide_from_right",
            animationTypeForReplace: "push",
          }}
        />
      </Stack>
    </>
  );
}
