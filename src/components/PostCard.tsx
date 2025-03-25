import { Dimensions, StyleSheet, TouchableOpacity } from "react-native";
import POST_TYPE from "../types/POST_TYPE";
import { AdvancedImage } from "cloudinary-react-native";
import { myCld } from "@/src/lib/cloudinary";
import { router } from "expo-router";

const screenWidth = Dimensions.get("window").width;

export default function PostCard({
  isFeatured,
  post,
}: {
  isFeatured: boolean;
  post: POST_TYPE;
}) {
  const myImage = myCld.image(post.items[0].public_id);

  if (isFeatured)
    return (
      <TouchableOpacity
        onPress={() =>
          router.push({
            pathname: "/post/[postId]",
            params: {
              postId: post.id,
            },
          })
        }
      >
        <AdvancedImage
          cldImg={myImage}
          style={{ width: screenWidth / 3, height: screenWidth / 3 }}
        />
      </TouchableOpacity>
    );
}

const styles = StyleSheet.create({});
