import * as VideoThumbnails from "expo-video-thumbnails";
import { useEffect, useState, useRef, useCallback } from "react";
import Carousel, {
  ICarouselInstance,
  Pagination,
} from "react-native-reanimated-carousel";
import { Dimensions, Image, Text, TouchableOpacity, View } from "react-native";
import { createFB, deleteFB, fetchDocByID } from "../utils/firebase-helpers";
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
import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { TextInput } from "react-native-gesture-handler";
import useUserStore from "../store/userStore";
import CommentType from "../types/CommentType";

const screenWidth = Dimensions.get("window").width;

export default function PostCard({
  isFeatured,
  post,
}: {
  isFeatured?: boolean;
  post: POST_TYPE;
}) {
  const firstItem = post.items[0];
  const [thumbnail, setThumbnail] = useState(firstItem.secure_url);

  useEffect(() => {
    if (firstItem.resource_type === "video") {
      (async () => {
        try {
          const { uri } = await VideoThumbnails.getThumbnailAsync(
            firstItem.secure_url,
            {
              time: 1000,
            }
          );
          setThumbnail(uri);
        } catch (e) {
          console.warn(e);
        }
      })();
    } else {
      setThumbnail(firstItem.secure_url);
    }
  }, [post]);

  const postId = post.id;
  const currentUserID = auth.currentUser.uid;

  const { user } = useUserStore();

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
    const { isSuccess } = await deleteFB("posts", postId);
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
    if (postId) {
      (async () => {
        const ref = query(
          collection(db, "likes"),
          where("itemId", "==", postId)
        );
        const snapshot = await getDocs(ref);
        setTotalLikes(snapshot.size);
        console.log({ size: snapshot.size });

        const currentUserLike = snapshot.docs.find(
          (doc) => doc.data().likedBy === currentUserID
        );
        console.log({ currentUserLike: currentUserLike.data() });

        setIsLiked(currentUserLike.exists ? true : false);
        setLikeID(currentUserLike.id);
      })();
      (async () => {
        const { data } = await fetchDocByID("users", post.owner);
        setOwner(data);
      })();
    }
  }, [post]);

  // ref
  const bottomSheetRef = useRef<BottomSheet>(null);

  // callbacks
  const handleSheetChanges = useCallback((index: number) => {
    // console.log("handleSheetChanges", index);
  }, []);
  const handleClosePress = () => bottomSheetRef.current.close();
  function openCommentsSheet() {
    bottomSheetRef.current.expand();
  }

  const [comments, setComments] = useState<CommentType[]>([]);
  const [populatedComments, setPopulatedComments] = useState<
    (CommentType & { owner: UserType })[]
  >([]);

  async function addComment() {
    if (commentText.length === 0) return;
    const newComment = {
      comment: commentText,
      itemId: postId,
      item_type: "post",
      owner: user.uid,
    } as CommentType;

    setComments((prev) => [newComment, ...prev]);

    setCommentText("");
    const { isSuccess, error, id } = await createFB("comments", newComment);
    console.log({ isSuccess, error, id });
    if (!isSuccess) {
      setComments((prev) =>
        prev.filter((c) => c.comment !== commentText && c.owner !== user.uid)
      );
    }
  }

  const [commentText, setCommentText] = useState("");

  useEffect(() => {
    if (!postId) return;

    (async () => {
      const ref = collection(db, "comments");
      const q = query(ref, where("itemId", "==", postId));

      const querySnapshot = await getDocs(q);
      const allComms = querySnapshot.docs.map(
        (doc) =>
          ({
            id: doc.id,
            ...doc.data(),
          } as CommentType)
      );
      setComments(allComms);
    })();
  }, [postId]);

  useEffect(() => {
    if (comments.length > 0) {
      (async () => {
        const populatedComments = await Promise.all(
          comments.map(async (c) => {
            const { data } = await fetchDocByID("users", c.owner);
            return { ...c, owner: data };
          })
        );
        setPopulatedComments(populatedComments);
      })();
    }
  }, [comments]);
  // console.log("Featured: ", isFeatured, { postId });
  console.log(postId, { totalLikes, comments });

  if (isFeatured)
    return (
      <TouchableOpacity
        onPress={() =>
          router.push({
            pathname: "/post/[postId]",
            params: {
              postId,
            },
          })
        }
      >
        <Image
          source={{ uri: thumbnail }}
          style={{ width: screenWidth / 3, height: screenWidth / 3 }}
        />
        {/* <AdvancedImage
          cldImg={cldImg}
          style={{ width: screenWidth / 3, height: screenWidth / 3 }}
        /> */}
      </TouchableOpacity>
    );

  return (
    <>
      <View className="flex-1">
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
              // console.log({ item });

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
        </View>

        <View className="p-2 flex-row items-center justify-between">
          <View className="flex-[0.8]">
            <Text
              numberOfLines={2}
              className="text-neutral-300 font-montserrat"
            >
              {post.caption}
            </Text>
          </View>

          <View className="flex-[0.2] flex-row gap-3 self-start">
            <TouchableOpacity onPress={togglePostLike}>
              <Ionicons
                name={`${isLiked ? "heart" : "heart-outline"}`}
                color={isLiked ? "red" : "white"}
                size={32}
              />
              <Text className="text-xs text-white font-montserratSemiBold text-center">
                {totalLikes}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={openCommentsSheet}>
              <Ionicons name={"chatbubble-outline"} color={"white"} size={32} />
              <Text className="text-xs text-white font-montserratSemiBold text-center">
                {comments.length}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Comments Sheet */}
        <BottomSheet
          snapPoints={["70%", "100%"]}
          ref={bottomSheetRef}
          onChange={handleSheetChanges}
          onClose={handleClosePress}
          enablePanDownToClose
          index={-1}
          handleStyle={{ backgroundColor: "#262626", borderRadius: 20 }}
          backgroundStyle={{ backgroundColor: "#262626", borderRadius: 20 }}
          handleIndicatorStyle={{ backgroundColor: "white" }}
        >
          {/* Use BottomSheetScrollView instead of ScrollView */}
          <BottomSheetScrollView className={"px-2"}>
            {populatedComments.map((c) => (
              <View
                key={c.id}
                className="flex flex-row items-center gap-2 mb-4"
              >
                <Image
                  source={
                    c.owner.picture
                      ? { uri: c.owner.picture }
                      : require("@/src/assets/images/person.png")
                  }
                  className="w-[28px] h-[28px] rounded-full"
                />
                <Text className="text-neutral-100 font-montserrat">
                  {c.comment}
                </Text>
              </View>
            ))}
          </BottomSheetScrollView>

          {/* ✅ Fixed Input at Bottom */}
          <View className="py-2 px-2 flex flex-row gap-4 items-center justify-between w-full max-h-[180px]">
            <Image
              source={
                user.picture
                  ? { uri: user.picture }
                  : require("@/src/assets/images/person.png")
              }
              className="w-[28px] h-[28px] rounded-full flex-[0.1]"
            />
            <TextInput
              value={commentText}
              onChangeText={(text) => setCommentText(text)}
              className="rounded-md w-full text-neutral-50 font-montserrat flex-[0.8]"
              placeholder={`Comment as ${user.username}...`}
              placeholderTextColor={"white"}
              multiline
            />

            <TouchableOpacity
              disabled={commentText.length === 0}
              className="ml-auto flex-[0.1]"
              onPress={addComment}
            >
              <Ionicons
                name="send"
                size={28}
                color={commentText.length === 0 ? "#777" : "#0ea5e9"}
              />
            </TouchableOpacity>
          </View>
        </BottomSheet>
      </View>
    </>
  );
}
