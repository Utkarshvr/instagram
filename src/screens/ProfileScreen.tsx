import {
  ActivityIndicator,
  Image,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Link } from "expo-router";
import UserType from "../types/UserType";
import { auth } from "../app/_layout";
import {
  acceptFollowRequest,
  checkFollowStatus,
  checkFriendRequestByUserID,
  fetchFollowers,
  fetchFollowing,
  removeFollowRequest,
  sendFollowRequest,
  unfollowUser,
} from "../utils/firebase-helpers";
import { useEffect, useState } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import useProfileStore from "../store/useProfileStore";

export default function ProfileScreen({
  user,
  refreshing,
  fetchUser,
}: {
  user: UserType | null;
  refreshing: boolean;
  fetchUser: () => Promise<void>;
}) {
  const currentUser = auth.currentUser;
  const currentUserId = currentUser?.uid || "";
  const targetUserId = user?.uid || "";
  const isTargetUserPrivate = user?.isPrivate;
  const isMe =
    targetUserId !== "" &&
    currentUserId !== "" &&
    targetUserId === currentUserId;

  const [isBtnDisabled, setIsBtnDisabled] = useState(false);
  const [isConfirmBtnDisabled, setIsConfirmBtnDisabled] = useState(false);
  const [isCancelBtnDisabled, setIsCancelBtnDisabled] = useState(false);
  const [hasRequested, setHasRequested] = useState(false);
  const [isFollowed, setisFollowed] = useState(false);

  const [isReqReceived, setIsReqReceived] = useState(false);
  const [reqID, setReqID] = useState<string | null>(null);

  const followUser = async () => {
    if (currentUser?.uid && user?.uid) {
      setIsBtnDisabled(true);
      try {
        await sendFollowRequest(currentUser?.uid, user?.uid);
        setisFollowed(!isTargetUserPrivate ? true : false);
        setHasRequested(isTargetUserPrivate ? true : false);
      } catch (error) {
        console.log(error);
      } finally {
        setIsBtnDisabled(false);
      }
    }
  };
  const removeFollowReq = async () => {
    try {
      setIsBtnDisabled(true);

      const response = await removeFollowRequest(currentUserId, targetUserId);
      if (response === true) {
        setHasRequested(false);
      } else {
        console.log("Couldn't remove request");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsBtnDisabled(false);
    }
  };
  const unfollowTargetUser = async () => {
    try {
      setIsBtnDisabled(true);

      const response = await unfollowUser(currentUserId, targetUserId);
      if (response === true) {
        setisFollowed(false);
      } else {
        console.log("Couldn't unfollow");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsBtnDisabled(false);
    }
  };
  const acceptReq = async () => {
    if (!reqID) return console.log("reqID is not present");
    try {
      setIsConfirmBtnDisabled(true);

      const response = await acceptFollowRequest(
        reqID,
        targetUserId,
        currentUserId
      );
      if (response === true) {
        setIsReqReceived(false);
      } else {
        console.log("Couldn't  accept request");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsConfirmBtnDisabled(false);
    }
  };
  const deleteReq = async () => {
    if (!reqID) return console.log("reqID is not present");
    try {
      setIsCancelBtnDisabled(true);

      const response = await removeFollowRequest(targetUserId, currentUserId);
      if (response === true) {
        setIsReqReceived(false);
      } else {
        console.log("Couldn't cancel request");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsCancelBtnDisabled(false);
    }
  };

  const { userFollowers, userFollowing, setUserFollowers, setUserFollowing } =
    useProfileStore();

  async function fetchFlwrsAndFlwngs(userID: string) {
    try {
      console.log({ userID });
      const flwrs = await fetchFollowers(userID);
      const flwngs = await fetchFollowing(userID);

      console.log({ flwrs, flwngs });

      setUserFollowers(flwrs);
      setUserFollowing(flwngs);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    if (currentUserId && targetUserId && !isMe) {
      // Check if current user follows or has requested the target user
      (async () => {
        setIsBtnDisabled(true);
        try {
          const { hasRequested, isFollowing } = await checkFollowStatus(
            currentUserId,
            targetUserId
          );
          console.log({ hasRequested, isFollowing });
          setisFollowed(isFollowing);
          setHasRequested(hasRequested);
        } catch (error) {
          console.log(error);
        } finally {
          setIsBtnDisabled(false);
        }
      })();

      // Check if friend req is received
      (async () => {
        try {
          const { hasReqReceieved, requestId } =
            await checkFriendRequestByUserID(currentUserId, targetUserId);
          setIsReqReceived(hasReqReceieved);
          setReqID(requestId);
        } catch (error) {
          console.log(error);
        }
      })();

      fetchFlwrsAndFlwngs(targetUserId);
    }
    if (isMe) fetchFlwrsAndFlwngs(currentUserId);
  }, [currentUserId, targetUserId, isMe]);

  console.log({ isMe });

  return (
    <ScrollView
      className="bg-neutral-950 flex-1"
      // contentContainerStyle={styles.scrollView}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={fetchUser} />
      }
    >
      {/* Accept Request */}
      {isReqReceived && (
        <View className="p-4 border-t border-b border-neutral-800 gap-4 items-center">
          <View className="flex-row gap-1 items-center">
            <Ionicons name="person-add-outline" size={12} color={"#fafafa"} />

            <Text className="text-neutral-50 font-montserratSemiBold text-sm">
              <Text className="font-montserratBold">{user?.username}</Text>{" "}
              wants to follow you
            </Text>
          </View>
          <View className="flex-row gap-4 items-center">
            <TouchableOpacity onPress={acceptReq}>
              <View className={`bg-sky-500 py-2 px-8 rounded-md items-center`}>
                {isConfirmBtnDisabled ? (
                  <ActivityIndicator size={"small"} />
                ) : (
                  <Text className="font-montserratSemiBold text-sm text-neutral-50">
                    Confirm
                  </Text>
                )}
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={deleteReq}>
              <View
                className={`bg-neutral-800 py-2 px-8 rounded-md items-center`}
              >
                {isCancelBtnDisabled ? (
                  <ActivityIndicator size={"small"} />
                ) : (
                  <Text className="font-montserratSemiBold text-sm  text-neutral-50">
                    Delete
                  </Text>
                )}
              </View>
            </TouchableOpacity>
          </View>
        </View>
      )}

      <View className="w-full gap-4 p-4">
        <View className="w-full justify-between gap-2 flex-row items-center">
          {user?.picture ? (
            <Image
              className="border-neutral-300 border rounded-full w-[80px] h-[80px]"
              source={{ uri: user.picture }}
            />
          ) : (
            <Image
              className="border-neutral-300 border rounded-full w-[80px] h-[80px]"
              source={require("@/src/assets/images/person.png")}
            />
          )}
          <View className="flex-row gap-4">
            <TouchableOpacity className="gap-1 items-center">
              <Text className="text-neutral-200 font-montserrat">24</Text>
              <Text className="text-neutral-400 font-montserratSemiBold">
                Posts
              </Text>
            </TouchableOpacity>
            <TouchableOpacity className="gap-1 items-center">
              <Text className="text-neutral-200 font-montserrat">
                {userFollowers.length}
              </Text>
              <Text className="text-neutral-400 font-montserratSemiBold">
                Followers
              </Text>
            </TouchableOpacity>
            <TouchableOpacity className="gap-1 items-center">
              <Text className="text-neutral-200 font-montserrat">
                {userFollowing.length}
              </Text>
              <Text className="text-neutral-400 font-montserratSemiBold">
                Following
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <View>
          <View className="gap-1">
            <Text className="font-montserratSemiBold text-neutral-100">
              {user?.name}
            </Text>
            <Text className="font-montserrat text-neutral-100 max-w-[80%]">
              {user?.bio}
            </Text>
          </View>
        </View>

        {isMe ? (
          <Link asChild href={"/edit-profile"}>
            <TouchableOpacity>
              <View
                className={`bg-neutral-700 p-2 rounded-md w-full items-center`}
              >
                <Text className="font-montserrat text-white">Edit Profile</Text>
              </View>
            </TouchableOpacity>
          </Link>
        ) : (
          <TouchableOpacity
            onPress={
              hasRequested
                ? removeFollowReq
                : isFollowed
                ? unfollowTargetUser
                : followUser
            }
          >
            <View
              className={`${
                isBtnDisabled
                  ? "bg-neutral-500"
                  : hasRequested || isFollowed
                  ? "bg-neutral-600"
                  : "bg-sky-500"
              } p-2 rounded-md w-full items-center`}
            >
              {isBtnDisabled ? (
                <ActivityIndicator size={"large"} />
              ) : (
                <Text className="font-montserrat text-neutral-50">
                  {hasRequested
                    ? "Requested"
                    : isFollowed
                    ? "Following"
                    : "Follow"}
                </Text>
              )}
            </View>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
}
