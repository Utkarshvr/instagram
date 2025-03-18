import { Text, TextInput, TouchableOpacity } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import useSearchStore from "../store/useSearchStore";

export default function SearchBar({
  pushToSearch = false,
}: {
  pushToSearch?: boolean;
}) {
  const { text, setText } = useSearchStore();

  return pushToSearch ? (
    <TouchableOpacity
      onPressIn={() => router.push("/explore/search")}
      className={`bg-neutral-800 rounded-md px-4 py-2 flex-row gap-2 items-center w-full`}
    >
      <Ionicons name={"search-outline"} size={26} color={"white"} />
      <Text className="text-white font-montserrat">Search</Text>
    </TouchableOpacity>
  ) : (
    <TextInput
      onChangeText={(txt) => setText(txt)}
      value={text}
      className="px-4 py-2 w-full rounded-md bg-neutral-800 text-neutral-50 font-montserrat"
      placeholder="Search a user"
      placeholderTextColor={"white"}
      autoCapitalize="none"
    />
  );
}
