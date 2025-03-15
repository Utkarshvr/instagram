import { ActivityIndicator, View } from "react-native";

export default function LoadingScreen() {
  return (
    <View className="bg-neutral-950 flex-1 items-center justify-center">
      <ActivityIndicator size={"large"} />
    </View>
  );
}
