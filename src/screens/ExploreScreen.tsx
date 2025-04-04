import { useEffect, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { fetchAllPosts } from "../utils/firebase-helpers";
import { auth } from "../app/_layout";
import POST_TYPE from "../types/POST_TYPE";
import PostCard from "../components/PostCard";
import { RefreshControl } from "react-native-gesture-handler";

export default function ExploreScreen() {
  const currentUserID = auth.currentUser.uid;

  const [allPosts, setAllPosts] = useState<POST_TYPE[]>([]);
  const [isFetching, setIsFetching] = useState(true);

  const fetch = async () => {
    try {
      setIsFetching(true);
      const allPosts = await fetchAllPosts(currentUserID);
      // console.log("👽 ALL POSTS: ", allPosts);
      setAllPosts(allPosts);
    } catch (error) {
      // console.log(error);
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    fetch();
  }, []);

  return (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={isFetching} onRefresh={fetch} />
      }
      className="bg-neutral-950"
      contentContainerStyle={{
        flex: 1,
      }}
    >
      <Text className="text-xl text-neutral-100 font-montserratSemiBold my-2">Explore</Text>

      <View className="flex-1 flex-wrap flex-row">
        {allPosts.map((post) => (
          <PostCard key={post.id} post={post} isFeatured />
        ))}
      </View>
    </ScrollView>
  );
}
