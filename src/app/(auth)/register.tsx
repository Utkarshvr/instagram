import { Link } from "expo-router";
import { useState } from "react";
import {
  Button,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function login() {
  const [form_value, setform_value] = useState({ email: "", password: "" });

  const isFormValid = form_value.email !== "" && form_value.password !== "";

  return (
    <SafeAreaView className="bg-neutral-950 flex-1 p-4 items-center ">
      <View className="w-full gap-4 items-center mt-32">
        <Image
          className="w-[240px] h-[70px]"
          source={require("../../assets/insta-dark.png")}
        />

        <TextInput
          editable
          multiline
          numberOfLines={4}
          maxLength={40}
          onChangeText={(text) =>
            setform_value((prev) => ({ ...prev, email: text }))
          }
          value={form_value.email}
          className="p-4 w-full rounded-md bg-neutral-800 text-neutral-50 font-montserrat"
          placeholder="Enter Email"
          placeholderTextColor={"white"}
        />

        <TextInput
          editable
          multiline
          numberOfLines={4}
          maxLength={40}
          onChangeText={(text) =>
            setform_value((prev) => ({ ...prev, password: text }))
          }
          value={form_value.password}
          className="p-4 w-full rounded-md bg-neutral-800 text-neutral-50 font-montserrat"
          placeholder="Enter Password"
          placeholderTextColor={"white"}
        />

        <Pressable disabled={!isFormValid} className="w-full">
          <TouchableOpacity disabled={!isFormValid}>
            <View
              className={`${
                isFormValid ? "bg-sky-400" : "bg-sky-300"
              } p-2 rounded-md w-full items-center`}
            >
              <Text className="font-montserrat text-white">Register</Text>
            </View>
          </TouchableOpacity>
        </Pressable>

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
