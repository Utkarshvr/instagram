import LoadingScreen from "@/src/components/LoadingScreen";
import useUserStore from "@/src/store/userStore";
import UserType from "@/src/types/UserType";
import {
  acceptFollowRequest,
  fetchUsersByIds,
  removeFollowRequest,
} from "@/src/utils/firebase-helpers";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { auth } from "../../_layout";
import Ionicons from "@expo/vector-icons/Ionicons";
import { toastMsg } from "@/src/utils/helpers";

export default function FollowReq() {
  const { flwReqs, setFlwReqs } = useUserStore();

  const [allUsers, setAllUsers] = useState<UserType[]>([]);
  const [isFetchingUsers, setIsFetchingUsers] = useState(true);

  const currentUserId = auth.currentUser?.uid || "";

  useEffect(() => {
    if (flwReqs.length === 0) {
      setAllUsers([]);
      return;
    }
    (async () => {
      setIsFetchingUsers(true);
      try {
        const allUserIDs = flwReqs.map((e) => e.from);
        const users = await fetchUsersByIds(allUserIDs);
        console.log(users);
        setAllUsers(users);
      } catch (error) {
        console.log(error);
      } finally {
        setIsFetchingUsers(false);
      }
    })();
  }, [flwReqs]);

  console.log({ flwReqs });

  const [isConfirmBtnDisabled, setIsConfirmBtnDisabled] = useState(false);
  const [isCancelBtnDisabled, setIsCancelBtnDisabled] = useState(false);

  const acceptReq = async (targetUserId: string) => {
    const reqID = flwReqs.find((e) => e.from === targetUserId)?.id;
    if (!reqID) return console.log("reqID is not present");

    try {
      setIsConfirmBtnDisabled(true);

      const response = await acceptFollowRequest(
        reqID,
        targetUserId,
        currentUserId
      );
      if (response === true) {
        // filter out follow requests

        const newReqs = flwReqs.filter((e) => e.from !== targetUserId);
        console.log({ newReqs });
        setFlwReqs(newReqs);
        toastMsg("Confirmed");
      } else {
        console.log("Couldn't  accept request");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsConfirmBtnDisabled(false);
    }
  };
  const deleteReq = async (targetUserId: string) => {
    try {
      setIsCancelBtnDisabled(true);

      const response = await removeFollowRequest(targetUserId, currentUserId);
      if (response === true) {
        // filter
        const newReqs = flwReqs.filter((e) => e.from !== targetUserId);
        console.log({ newReqs });
        setFlwReqs(newReqs);
        toastMsg("Deleted");
      } else {
        console.log("Couldn't cancel request");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsCancelBtnDisabled(false);
    }
  };

  if (isFetchingUsers) return <LoadingScreen />;

  return (
    <SafeAreaView className="bg-neutral-950 flex-1 p-4">
      {allUsers.length > 0 ? (
        <FlatList
          data={allUsers}
          keyExtractor={(item) => item.uid || ""}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() =>
                router.push({
                  pathname: "/profile/[userId]",
                  params: { userId: item?.uid },
                })
              }
              className="px-2 py-4 w-full flex-row items-center justify-between"
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
              <View className="flex-row gap-4 items-center">
                <TouchableOpacity onPress={() => acceptReq(item?.uid || "")}>
                  <View
                    className={`bg-sky-500 py-2 px-4 rounded-md items-center`}
                  >
                    {isConfirmBtnDisabled ? (
                      <ActivityIndicator size={"small"} />
                    ) : (
                      <Text className="font-montserratSemiBold text-sm text-neutral-50">
                        Confirm
                      </Text>
                    )}
                  </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => deleteReq(item?.uid || "")}>
                  <View
                  // className={`bg-neutral-800 py-2 px-3 rounded-md items-center`}
                  >
                    {isCancelBtnDisabled ? (
                      <ActivityIndicator size={"small"} />
                    ) : (
                      <Ionicons name="close" size={18} color={"#aaa"} />
                    )}
                  </View>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          )}
        />
      ) : (
        <Text className="text-neutral-500 font-montserrat">
          No requests available
        </Text>
      )}
    </SafeAreaView>
  );
}
