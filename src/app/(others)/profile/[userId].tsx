import ProfileScreen from "@/src/screens/ProfileScreen";
import UserType from "@/src/types/UserType";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { useEffect, useState } from "react";
import { db } from "../../_layout";
import { doc, getDoc } from "firebase/firestore";
import LoadingScreen from "@/src/components/LoadingScreen";
import { Text } from "react-native";

export default function Profile() {
  // Use PascalCase for component names
  const { userId } = useLocalSearchParams();
  const [user, setUser] = useState<UserType | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const navigation = useNavigation();

  const [refreshing, setRefreshing] = useState(false);

  // Convert userId to a string
  const uid = Array.isArray(userId) ? userId[0] : userId;

  const fetchUser = async () => {
    setIsLoading(true);
    try {
      const userRef = doc(db, "users", uid); // Now uid is always a string
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        setUser({ uid: userSnap.id, ...userSnap.data() } as UserType);
      } else {
        // console.log("No such user found!");
        setUser(null);
      }
    } catch (error) {
      console.error("Error fetching user:", error);
      setUser(null);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (!uid) {
      console.error("User ID is required!");
      return;
    }

    fetchUser();
  }, [uid]);

  useEffect(() => {
    if (user)
      navigation.setOptions({
        headerTitle: () => (
          <Text className="font-montserratSemiBold text-neutral-50">
            {user?.username}
          </Text>
        ),
      });
    else
      navigation.setOptions({
        headerTitle: "",
      });
  }, [navigation, user]);

  if (isLoading) return <LoadingScreen />;

  return (
    <ProfileScreen
      user={user}
      refreshing={refreshing}
      fetchUser={fetchUser}
    />
  );
}
