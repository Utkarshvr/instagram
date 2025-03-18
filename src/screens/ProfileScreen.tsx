import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link } from "expo-router";
import UserType from "../types/UserType";
import { auth } from "../app/_layout";

export default function ProfileScreen({ user }: { user: UserType | null }) {
  const currentUser = auth.currentUser;
  const isMe = user?.uid === currentUser?.uid;

  return (
    <ScrollView className="bg-neutral-950 flex-1 px-4">
      <View className="w-full gap-4">
        <View className="w-full justify-between gap-2 flex-row">
          {user?.picture ? (
            <Image
              className="border-neutral-300 border rounded-full w-[80px] h-[80px]"
              source={{ uri: user.picture }}
            />
          ) : (
            <Image
              className="border-neutral-300 border rounded-full w-[80px] h-[80px]"
              source={require("@/src/assets/images/person.png")}
            />
          )}
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
          <View className="gap-1">
            <Text className="font-montserratSemiBold text-neutral-100">
              {user?.name}
            </Text>
            <Text className="font-montserrat text-neutral-100 max-w-[80%]">
              {user?.bio}
            </Text>
          </View>
        </View>

        {isMe ? (
          <Link asChild href={"/edit-profile"}>
            <TouchableOpacity>
              <View
                className={`bg-neutral-700 p-2 rounded-md w-full items-center`}
              >
                <Text className="font-montserrat text-white">Edit Profile</Text>
              </View>
            </TouchableOpacity>
          </Link>
        ) : (
          <TouchableOpacity>
            <View className={`bg-sky-500 p-2 rounded-md w-full items-center`}>
              <Text className="font-montserrat text-neutral-50">Follow</Text>
            </View>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
}
