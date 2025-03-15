import { Button, StyleSheet, ToastAndroid } from "react-native";
import "../../../global.css";
import { signOut } from "firebase/auth";
import { auth } from "../_layout";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Home() {
  return (
    <SafeAreaView className="bg-neutral-950 flex-1 p-4">
      <Button
        onPress={() => {
          signOut(auth);
        }}
        title="Log out"
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({});
