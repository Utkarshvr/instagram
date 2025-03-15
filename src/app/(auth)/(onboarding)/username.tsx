import { useState } from "react";
import {
  ActivityIndicator,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FirebaseError } from "firebase/app";
import { auth, db } from "../../_layout";
import {
  collection,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import InstaDarkSvg from "@/src/assets/insta-dark-svg.svg";
import { router } from "expo-router";

export default function register() {
  const [username, setUsername] = useState("");
  const isFormValid = username !== "";

  const [isCreating, setIsCreating] = useState(false);

  const user = auth.currentUser;

  async function createUsername() {
    setIsCreating(true);
    try {
      // Step 1: Check if username already exists
      const q = query(
        collection(db, "users"),
        where("username", "==", username)
      );
      const querySnapshot = await getDocs(q);
      console.log("Passed getDocs");

      if (!querySnapshot.empty) {
        alert("Username already taken! Choose a different one.");
        setIsCreating(false);
        alert("Username not available!");
        return;
      }

      // Step 2: If username is unique, update the user document
      await updateDoc(doc(db, "users", user?.uid || ""), {
        username: username,
      });
      router.replace("/(tabs)");
      console.log("Passed updateDoc");
    } catch (e: any) {
      const error = e as FirebaseError;
      alert(error.message);
      console.error(error);
    } finally {
      setIsCreating(false);
    }
  }

  return (
    <SafeAreaView className="bg-neutral-950 flex-1 p-4 items-center ">
      <View className="w-full gap-4 items-center mt-32">
        <InstaDarkSvg width={200} />

        <TextInput
          onChangeText={(text) => setUsername(text)}
          value={username}
          className="p-4 w-full rounded-md bg-neutral-800 text-neutral-50 font-montserrat"
          placeholder="username..."
          placeholderTextColor={"white"}
          autoCapitalize="none"
          keyboardType="default"
        />

        <TouchableOpacity
          onPress={createUsername}
          disabled={!isFormValid && isCreating}
          className="w-full"
        >
          <View
            className={`${
              isFormValid && !isCreating ? "bg-sky-500" : "bg-sky-300"
            } p-2 rounded-md w-full items-center`}
          >
            {isCreating ? (
              <ActivityIndicator size={"large"} />
            ) : (
              <Text className="font-montserrat text-white">Create</Text>
            )}
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
