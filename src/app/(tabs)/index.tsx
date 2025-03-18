import {
  Button,
  StyleSheet,
  TextInput,
  ToastAndroid,
  TouchableWithoutFeedback,
} from "react-native";
import "../../../global.css";
import { signOut } from "firebase/auth";
import { auth } from "../_layout";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRef } from "react";

export default function Home() {
  const inputRef = useRef<TextInput>(null);

  return (
    <SafeAreaView className="bg-neutral-950 flex-1 p-4 gap-5">
      <Button
        onPress={() => {
          signOut(auth);
        }}
        title="Log out"
      />
      <Button title="Clikc" onPress={() => inputRef.current?.focus()} />
      <TextInput
        // onChangeText={(txt) => setText(txt)}
        ref={inputRef}
        // value={text}
        className="px-4 py-2 w-full rounded-md bg-neutral-800 text-neutral-50 font-montserrat"
        placeholder="Search a user"
        placeholderTextColor={"white"}
        autoCapitalize="none"
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({});
