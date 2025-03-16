import useUserStore from "@/src/store/userStore";
import { capitalizeFirstLetter } from "@/src/utils/utils";
import { useActionSheet } from "@expo/react-native-action-sheet";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useNavigation } from "expo-router";
import { useEffect, useState } from "react";
import {
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
export default function EditProfile() {
  const { user } = useUserStore();
  const navigation = useNavigation();
  const { showActionSheetWithOptions } = useActionSheet();

  const [form_value, setForm_value] = useState({
    name: user?.name || "",
    username: user?.username || "",
    email: user?.email || "",
    profile: user?.profile || "",
    bio: user?.bio || "",
  });

  const forms = ["name", "username", "bio"];

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Ionicons name={"checkmark"} size={24} color={"#0284c7"} />
      ),
    });
  }, [navigation]);

  const editPicture = () => {
    const options = ["New profile picture", "Remove current picture"];
    const destructiveButtonIndex = 1;
    const cancelButtonIndex = 2;

    showActionSheetWithOptions(
      {
        options,
        destructiveButtonIndex,
        cancelButtonIndex,
        useModal: true,
        containerStyle: {
          backgroundColor: "#262626",
        },
        textStyle: { color: "#fafafa" },
        cancelButtonTintColor: "#a3a3a3",
      },
      (selectedIndex) => {
        switch (selectedIndex) {
          case 0:
            // New Profile Picture
            break;

          case destructiveButtonIndex:
            // Delete
            break;

          case cancelButtonIndex:
            // Cancel
            break;
        }
      }
    );
  };

  return (
    <SafeAreaView className="bg-neutral-950  flex-1 py-2">
      <ScrollView>
        <View className="items-center justify-center">
          <TouchableOpacity className="gap-2" onPress={editPicture}>
            {form_value.profile ? (
              <Image
                source={{ uri: form_value.profile }}
                className="w-[80] h-[80]"
              />
            ) : (
              <Ionicons name={"person-circle"} size={80} color={"white"} />
            )}
            <Text className="font-montserrat text-sm text-sky-600">
              Edit picture
            </Text>
          </TouchableOpacity>
        </View>
        <View className="gap-4">
          {forms.map((f) => (
            <View key={f} className="px-4">
              <Text className="font-montserrat text-sm text-neutral-200">
                {capitalizeFirstLetter(f)}
              </Text>
              <TextInput
                onChangeText={(text) =>
                  setForm_value((prev) => ({ ...prev, [f]: text }))
                }
                multiline={f === "bio"}
                value={form_value[f as keyof typeof form_value]}
                className="w-full rounded-md text-neutral-100 font-montserrat border-b border-b-neutral-800"
                placeholder={`Enter ${f}`}
                placeholderTextColor={"#a3a3a3"}
              />
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({});
