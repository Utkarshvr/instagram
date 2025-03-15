import { Link } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FirebaseError } from "firebase/app";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../_layout";

export default function register() {
  const [form_value, setform_value] = useState({ email: "", password: "" });
  const isFormValid = form_value.email !== "" && form_value.password !== "";

  const [isRegistering, setIsRegistering] = useState(false);

  async function registerAccount() {
    setIsRegistering(true);
    try {
      await createUserWithEmailAndPassword(
        auth,
        form_value.email,
        form_value.password
      );
      alert("User account created & signed in!");
    } catch (e: any) {
      const error = e as FirebaseError;
      if (error.code === "auth/email-already-in-use") {
        alert("That email address is already in use!");
      } else if (error.code === "auth/invalid-email") {
        alert("That email address is invalid!");
      } else {
        alert(error.message);
      }

      console.error(error);
    } finally {
      setIsRegistering(false);
    }
  }

  return (
    <SafeAreaView className="bg-neutral-950 flex-1 p-4 items-center ">
      <View className="w-full gap-4 items-center mt-32">
        <Image
          className="w-[240px] h-[70px]"
          source={require("../../assets/insta-dark.png")}
        />

        <TextInput
          onChangeText={(text) =>
            setform_value((prev) => ({ ...prev, email: text }))
          }
          value={form_value.email}
          className="p-4 w-full rounded-md bg-neutral-800 text-neutral-50 font-montserrat"
          placeholder="Enter Email"
          placeholderTextColor={"white"}
          autoCapitalize="none"
          keyboardType="email-address"
        />

        <TextInput
          onChangeText={(text) =>
            setform_value((prev) => ({ ...prev, password: text }))
          }
          value={form_value.password}
          className="p-4 w-full rounded-md bg-neutral-800 text-neutral-50 font-montserrat"
          placeholder="Enter Password"
          placeholderTextColor={"white"}
          autoCapitalize="none"
          secureTextEntry
        />

        <TouchableOpacity
          onPress={registerAccount}
          disabled={!isFormValid && isRegistering}
          className="w-full"
        >
          <View
            className={`${
              isFormValid && !isRegistering ? "bg-sky-400" : "bg-sky-300"
            } p-2 rounded-md w-full items-center`}
          >
            {isRegistering ? (
              <ActivityIndicator size={"large"} />
            ) : (
              <Text className="font-montserrat text-white">Register</Text>
            )}
          </View>
        </TouchableOpacity>

        <Text className="text-neutral-400 font-montserrat">
          Already have an account?{" "}
          <Link href={"/(auth)/login"} asChild replace>
            <Text className="text-sky-600 font-montserratBold">Login</Text>
          </Link>
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({});
