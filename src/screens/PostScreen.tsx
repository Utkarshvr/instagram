import Carousel, {
  ICarouselInstance,
  Pagination,
} from "react-native-reanimated-carousel";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  Dimensions,
  Image,
  ScrollView,
  Text,
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
import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { TextInput } from "react-native-gesture-handler";
import useUserStore from "../store/userStore";
import CommentType from "../types/CommentType";
import PostCard from "../components/PostCard";

const screenWidth = Dimensions.get("window").width;

export default function PostScreen() {
  const { postId } = useLocalSearchParams();
  // Convert postId to a string
  const uid = Array.isArray(postId) ? postId[0] : postId;

  const [post, setPost] = useState<POST_TYPE>();

  useEffect(() => {
    (async () => {
      const { data } = await fetchDocByID<POST_TYPE>("posts", uid);
      setPost(data);
    })();
  }, []);

  if (!post) return;

  return (
    <ScrollView contentContainerStyle={{ flex: 1 }} className="bg-neutral-950">
      <PostCard post={post} />
    </ScrollView>
  );
}
