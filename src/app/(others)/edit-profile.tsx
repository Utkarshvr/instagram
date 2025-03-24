import * as ImagePicker from "expo-image-picker";
import useUserStore from "@/src/store/userStore";
import { capitalizeFirstLetter } from "@/src/utils/utils";
import { useActionSheet } from "@expo/react-native-action-sheet";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router, useNavigation } from "expo-router";
import { doc, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { db } from "../_layout";
import { toastMsg, uploadToCloudinary } from "@/src/utils/helpers";
import UserType from "@/src/types/UserType";

export default function EditProfile() {
  const { user, setUser } = useUserStore();
  const navigation = useNavigation();
  const { showActionSheetWithOptions } = useActionSheet();

  const [form_value, setForm_value] = useState({
    name: user?.name || "",
    username: user?.username || "",
    email: user?.email || "",
    picture: user?.picture || "",
    bio: user?.bio || "",
  });

  const forms = ["name", "username", "bio"];

  const selectPicture = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const img = result.assets[0];
      console.log({ uri: img.uri });
      setForm_value((prev) => ({ ...prev, picture: img.uri }));
    }
  };

  const editPicture = () => {
    const options = ["New picture picture", "Remove current picture", "Cancel"];
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
            // New picture Picture
            selectPicture();
            break;

          case destructiveButtonIndex:
            // Delete
            setForm_value((prev) => ({ ...prev, picture: "" }));
            break;

          case cancelButtonIndex:
            // Cancel
            break;
        }
      }
    );
  };

  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);

  async function updateProfile() {
    setIsUpdatingProfile(true);
    try {
      const docRef = doc(db, "users", user?.uid || "");
      let url = form_value.picture;

      if (form_value.picture !== user?.picture)
        // Upload to cloudinary
        url = await uploadToCloudinary(form_value.picture);

      await updateDoc(docRef, {
        picture: url,
        name: form_value.name,
        username: form_value.username,
        bio: form_value.bio,
      });

      setUser({
        ...user,
        picture: form_value.picture,
        name: form_value.name,
        username: form_value.username,
        bio: form_value.bio,
      } as UserType);

      toastMsg("Profile updated");
      router.back();
    } catch (error) {
      console.log(error);
    } finally {
      setIsUpdatingProfile(false);
    }
  }

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity className="p-2" onPressIn={updateProfile}>
          {isUpdatingProfile ? (
            <ActivityIndicator size={"large"} color={"#0284c7"} />
          ) : (
            <Ionicons name={"checkmark"} size={24} color={"#0284c7"} />
          )}
        </TouchableOpacity>
      ),
    });
  }, [navigation, form_value, isUpdatingProfile, updateProfile]);

  return (
    <SafeAreaView className="bg-neutral-950  flex-1 py-2">
      <ScrollView>
        <View className="items-center justify-center">
          <TouchableOpacity
            className="gap-2 items-center"
            onPress={editPicture}
          >
            <Image
              source={
                form_value.picture
                  ? { uri: form_value.picture }
                  : require("@/src/assets/images/person.png")
              }
              className="w-[80px] h-[80px] rounded-full"
            />

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
