import Carousel, {
  ICarouselInstance,
  Pagination,
} from "react-native-reanimated-carousel";
import { useEffect, useRef, useState } from "react";
import {
  Dimensions,
  Image,
  ScrollView,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  View,
} from "react-native";
import { createFB, deleteFB, fetchDocByID } from "../utils/firebase-helpers";
import { useLocalSearchParams } from "expo-router/build/hooks";
import POST_TYPE from "../types/POST_TYPE";
import { useSharedValue } from "react-native-reanimated";
import MyVideoComponent from "../components/MyVideoComponent";
import Ionicons from "@expo/vector-icons/Ionicons";
import { auth, db } from "../app/_layout";
import { collection, getDocs, query, where } from "firebase/firestore";
import UserType from "../types/UserType";
import { router } from "expo-router";
import { useActionSheet } from "@expo/react-native-action-sheet";
import { toastMsg } from "../utils/helpers";

const screenWidth = Dimensions.get("window").width;

export default function PostScreen() {
  const { postId } = useLocalSearchParams();
  // Convert postId to a string
  const uid = Array.isArray(postId) ? postId[0] : postId;
  const currentUserID = auth.currentUser.uid;

  const [post, setPost] = useState<POST_TYPE>();
  const [owner, setOwner] = useState<UserType>();
  const ref = useRef<ICarouselInstance>(null);
  const progress = useSharedValue<number>(0);

  const [isLiked, setIsLiked] = useState(false);
  const [likeID, setLikeID] = useState<null | string>(null);
  const [totalLikes, setTotalLikes] = useState(0);

  const isMyPost = currentUserID === post?.owner;

  const onPressPagination = (index: number) => {
    ref.current?.scrollTo({
      /**
       * Calculate the difference between the current index and the target index
       * to ensure that the carousel scrolls to the nearest index
       */
      count: index - progress.value,
      animated: true,
    });
  };

  async function togglePostLike() {
    if (!isLiked) {
      setIsLiked(true);
      setTotalLikes((prev) => prev + 1);
      const { isSuccess } = await createFB("likes", {
        likedBy: currentUserID,
        itemId: postId,
        item_type: "post",
      });
      if (!isSuccess) {
        setIsLiked(false);
        setTotalLikes((prev) => prev - 1);
      }
    } else {
      setIsLiked(false);
      setTotalLikes((prev) => prev - 1);
      const { isSuccess } = await deleteFB("likes", likeID);
      if (!isSuccess) {
        setIsLiked(true);
        setTotalLikes((prev) => prev + 1);
      }
    }
  }

  const { showActionSheetWithOptions } = useActionSheet();

  async function deletePost() {
    const { isSuccess } = await deleteFB("posts", uid);
    if (isSuccess) {
      toastMsg("Post deleted!");
      router.back();
    }
  }

  function openSelectItems() {
    const options = ["Delete Post", "Cancel"];
    const destructiveButtonIndex = 0;
    const cancelButtonIndex = 1;

    showActionSheetWithOptions(
      {
        options,
        destructiveButtonIndex,
        cancelButtonIndex,
        useModal: false,
        containerStyle: {
          backgroundColor: "#262626",
        },
        textStyle: { color: "#fafafa" },
        cancelButtonTintColor: "#a3a3a3",
      },
      (selectedIndex) => {
        switch (selectedIndex) {
          case destructiveButtonIndex:
            // Delete
            deletePost();
            break;

          case cancelButtonIndex:
            // Cancel
            break;
        }
      }
    );
  }

  useEffect(() => {
    (async () => {
      const { data } = await fetchDocByID<POST_TYPE>("posts", uid);
      setPost(data);
    })();
  }, []);

  useEffect(() => {
    if (post) {
      (async () => {
        const ref = query(
          collection(db, "likes"),
          where("itemId", "==", postId)
        );
        const snapshot = await getDocs(ref);
        const currentUserLike = snapshot.docs.find(
          (doc) => doc.data().likedBy === currentUserID
        );
        console.log(currentUserLike);

        setTotalLikes(snapshot.size);
        setIsLiked(currentUserLike.exists ? true : false);
        setLikeID(currentUserLike.id);
      })();
      (async () => {
        const { data } = await fetchDocByID("users", post.owner);
        setOwner(data);
      })();
    }
  }, [post]);

  if (post)
    return (
      <ScrollView
        contentContainerStyle={{ flex: 1 }}
        className="bg-neutral-950"
      >
        {owner && (
          <View className="p-2 flex-row items-center justify-between">
            <TouchableOpacity
              onPress={() =>
                router.push({
                  pathname: "/profile/[userId]",
                  params: { userId: owner.uid },
                })
              }
              className="flex-row gap-2 items-center"
            >
              <Image
                className="border-neutral-300 border rounded-full w-[36px] h-[36px]"
                source={
                  owner?.picture
                    ? { uri: owner.picture }
                    : require("@/src/assets/images/person.png")
                }
              />
              <View>
                <Text className="text-neutral-100 font-montserratSemiBold text-md">
                  {owner.username}
                </Text>

                <Text className="text-neutral-300 font-montserrat text-sm">
                  {owner.name}
                </Text>
              </View>
            </TouchableOpacity>
            {isMyPost && (
              <TouchableOpacity onPress={openSelectItems}>
                <Ionicons name="ellipsis-vertical" size={24} color={"#999"} />
              </TouchableOpacity>
            )}
          </View>
        )}
        <View className="relative w-full">
          <Carousel
            data={post.items}
            ref={ref}
            width={screenWidth}
            height={screenWidth}
            loop={false}
            onProgressChange={progress}
            // onSnapToItem={(index) => setVideoSourceFunction(index)} // Track current index
            renderItem={({ item }) => {
              console.log({ item });

              return (
                <View
                  style={{
                    flex: 1,
                    borderWidth: 1,
                    justifyContent: "center",
                  }}
                >
                  {item.resource_type === "image" ? (
                    <Image
                      key={item.asset_id}
                      source={{ uri: item.secure_url }}
                      style={{
                        width: screenWidth,
                        height: screenWidth,
                        // objectFit: "scale-down",
                      }}
                    />
                  ) : (
                    <MyVideoComponent
                      source={item.secure_url}
                      style={{ width: screenWidth, height: screenWidth }}
                    />
                  )}
                </View>
              );
            }}
          />

          <Pagination.Basic
            progress={progress}
            data={post.items}
            dotStyle={{ backgroundColor: "#fff", borderRadius: 100 }}
            activeDotStyle={{ backgroundColor: "#0ea5e9", borderRadius: 100 }}
            containerStyle={{
              position: "absolute",
              top: 12,
              right: 12,
              gap: 8,
            }}
            onPress={onPressPagination}
          />
          <TouchableOpacity
            className=" absolute bottom-4 left-4 bg-neutral-900 rounded-full px-4 py-2"
            onPress={togglePostLike}
          >
            <Ionicons
              name={`${isLiked ? "heart" : "heart-outline"}`}
              color={isLiked ? "red" : "white"}
              size={32}
            />
            <Text className="text-xs text-white font-montserratSemiBold text-center">
              {totalLikes}
            </Text>
          </TouchableOpacity>
        </View>

        <View className="p-2">
          <Text className="text-neutral-300 font-montserrat">
            {post.caption}
          </Text>
        </View>
      </ScrollView>
    );
}
