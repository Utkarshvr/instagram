import useSearchStore from "@/src/store/useSearchStore";
import UserType from "@/src/types/UserType";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { FlatList, Image, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { db } from "../../_layout";
import { useDebounce } from "@/src/hooks/useDebounce";
import { router } from "expo-router";
import SearchBar from "@/src/components/SearchBar";

export default function Search() {
  const { text } = useSearchStore();
  const debouncedText = useDebounce(text, 500); // 500ms delay

  const [users, setUsers] = useState<UserType[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      if (!debouncedText) return;
      setIsSearching(true);

      try {
        const usersRef = collection(db, "users");
        const q = query(
          usersRef,
          where("username", ">=", text),
          where("username", "<=", text + "\uf8ff")
        );
        const querySnapshot = await getDocs(q);

        const userList: UserType[] = querySnapshot.docs.map((doc) => ({
          uid: doc.id,
          ...doc.data(),
        })) as UserType[];

        setUsers(userList);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setIsSearching(false);
      }
    };

    fetchUsers();
  }, [debouncedText]); // Run only when debouncedText changes

  return (
    <SafeAreaView className="bg-neutral-950 flex-1">
      <SearchBar />
      {!isSearching && users.length > 0 ? (
        <FlatList
          data={users}
          keyExtractor={(item) => item.uid}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() =>
                router.push({
                  pathname: "/profile/[userId]",
                  params: { userId: item?.uid },
                })
              }
              className="p-4 w-full"
            >
              <View className="flex-row gap-2 items-center">
                {item?.picture ? (
                  <Image
                    className="border-neutral-300 border rounded-full w-[48px] h-[48px]"
                    source={{ uri: item.picture }}
                  />
                ) : (
                  <Image
                    className="border-neutral-300 border rounded-full w-[48px] h-[48px]"
                    source={require("@/src/assets/images/person.png")}
                  />
                )}
                <View>
                  <Text className="text-neutral-100 font-montserratSemiBold">
                    {item.username}
                  </Text>

                  <Text className="text-neutral-300 font-montserrat">
                    {item.name}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          )}
        />
      ) : (
        <Text className="text-neutral-400">No users found</Text>
      )}
      {isSearching && (
        <Text className="text-neutral-300 font-montserratSemiBold">
          Searching...
        </Text>
      )}
    </SafeAreaView>
  );
}
