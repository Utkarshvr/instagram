import LoadingScreen from "@/src/components/LoadingScreen";
import { fetchFollowRequests } from "@/src/utils/firebase-helpers";
import { useEffect, useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { auth } from "../../_layout";
import useUserStore from "@/src/store/userStore";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import { useIsFocused } from "@react-navigation/native";

export default function Notifications() {
  const [isLoading, setIsLoading] = useState(true);
  const currentUserId = auth.currentUser?.uid;
  const { flwReqs, setFlwReqs } = useUserStore();
  const isFocused = useIsFocused();

  useEffect(() => {
    if (!currentUserId) return;
    (async () => {
      setIsLoading(true);

      try {
        const reqs = await fetchFollowRequests(currentUserId);
        setFlwReqs(reqs);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    })();
  }, [currentUserId, isFocused]);

  if (isLoading) return <LoadingScreen />;

  return (
    <ScrollView className="bg-neutral-950 flex-1 p-4">
      {flwReqs.length > 0 ? (
        <TouchableOpacity
          onPress={() => router.push("/notifications/follow_requests")}
          className="w-full py-2 flex-row items-center justify-between"
        >
          <Text className="text-neutral-50 font-montserratSemiBold text-sm">
            Follow requests{" "}
            <Text className="text-sky-600">({flwReqs.length})</Text>
          </Text>
          <View className="flex-row items-center">
            <Ionicons name="ellipse" size={7} color={"#0284c7"} />
            <Ionicons name="chevron-forward" size={18} color={"#525252"} />
          </View>
        </TouchableOpacity>
      ) : (
        <Text className="text-neutral-300 font-montserrat">
          Nothing to see here!
        </Text>
      )}
    </ScrollView>
  );
}
