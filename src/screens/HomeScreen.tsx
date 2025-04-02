import { useEffect, useState } from "react";
import { ScrollView } from "react-native";
import { fetchAllPosts } from "../utils/firebase-helpers";
import { auth } from "../app/_layout";
import POST_TYPE from "../types/POST_TYPE";
import PostCard from "../components/PostCard";

export default function HomeScreen() {
  const currentUserID = auth.currentUser.uid;

  const [allPosts, setAllPosts] = useState<POST_TYPE[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const allPosts = await fetchAllPosts(currentUserID);
        console.log("👽 ALL POSTS: ", allPosts);
        setAllPosts(allPosts);
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);

  return (
    <ScrollView className="bg-neutral-950 flex-1 gap-10">
      {allPosts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </ScrollView>
  );
}
