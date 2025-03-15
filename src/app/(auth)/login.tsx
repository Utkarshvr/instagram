import { Link } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  ToastAndroid,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FirebaseError } from "firebase/app";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../_layout";

export default function login() {
  const [form_value, setform_value] = useState({ email: "", password: "" });
  const isFormValid = form_value.email !== "" && form_value.password !== "";

  const [isLogging, setIsLogging] = useState(false);

  async function loginAccount() {
    setIsLogging(true);
    try {
      await signInWithEmailAndPassword(
        auth,
        form_value.email,
        form_value.password
      );
      ToastAndroid.showWithGravityAndOffset(
        "Welcome back!",
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
        25,
        50
      );
    } catch (e: any) {
      const error = e as FirebaseError;

      ToastAndroid.showWithGravityAndOffset(
        error.message,
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
        25,
        50
      );

      console.error(error);
    } finally {
      setIsLogging(false);
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
          className="w-full"
          disabled={!isFormValid && isLogging}
          onPress={loginAccount}
        >
          <View
            className={`${
              isFormValid && !isLogging ? "bg-sky-500" : "bg-sky-300"
            } p-2 rounded-md w-full items-center`}
          >
            {isLogging ? (
              <ActivityIndicator size={"large"} />
            ) : (
              <Text className="font-montserrat text-white">Log in</Text>
            )}
          </View>
        </TouchableOpacity>

        <Text className="text-neutral-400 font-montserrat">
          Don't have an account?{" "}
          <Link href={"/(auth)/register"} asChild replace>
            <Text className="text-sky-600 font-montserratBold">Register</Text>
          </Link>
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({});
