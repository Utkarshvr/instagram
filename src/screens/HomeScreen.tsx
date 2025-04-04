import { useEffect, useState } from "react";
import { ScrollView } from "react-native";
import { fetchAllPosts } from "../utils/firebase-helpers";
import { auth } from "../app/_layout";
import POST_TYPE from "../types/POST_TYPE";
import PostCard from "../components/PostCard";
import { RefreshControl } from "react-native-gesture-handler";

export default function HomeScreen() {
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
      className="bg-neutral-950 flex-1 gap-10"
    >
      {allPosts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </ScrollView>
  );
}
