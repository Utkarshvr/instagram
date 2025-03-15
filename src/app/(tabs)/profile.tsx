import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import useUserStore from "@/src/store/userStore";
import { SafeAreaView } from "react-native-safe-area-context";

export default function profile() {
  const { user } = useUserStore();
  return (
    <SafeAreaView className="bg-neutral-950 flex-1 px-4">
      <View className="w-full gap-4">
        <View className="w-full justify-between gap-2 flex-row">
          <Image
            className="border-neutral-300 border rounded-full w-[80px] h-[80px]"
            source={require("@/src/assets/images/person.png")}
          />
          <View className="flex-row gap-4">
            <View className="gap-1 items-center">
              <Text className="text-neutral-200 font-montserrat">24</Text>
              <Text className="text-neutral-400 font-montserratSemiBold">
                Posts
              </Text>
            </View>
            <View className="gap-1 items-center">
              <Text className="text-neutral-200 font-montserrat">400</Text>
              <Text className="text-neutral-400 font-montserratSemiBold">
                Followers
              </Text>
            </View>
            <View className="gap-1 items-center">
              <Text className="text-neutral-200 font-montserrat">304</Text>
              <Text className="text-neutral-400 font-montserratSemiBold">
                Following
              </Text>
            </View>
          </View>
        </View>
        <View>
          <Text className="font-montserrat  text-neutral-100">Bio...</Text>
        </View>

        <TouchableOpacity>
          <View className={`bg-neutral-700 p-2 rounded-md w-full items-center`}>
            <Text className="font-montserrat text-white">Edit Profile</Text>
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({});
