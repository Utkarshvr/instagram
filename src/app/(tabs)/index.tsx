import { Button, StyleSheet, Text, View } from "react-native";
import "../../../global.css";
import { Link } from "expo-router";

export default function Home() {
  return (
    <View>
      <Text className="font-montserrat text-2xl">Home Page</Text>
      <Link href={"/(auth)/login"} asChild>
        <Button title="Login" />
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({});
