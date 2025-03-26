import * as VideoThumbnails from "expo-video-thumbnails";
import { Dimensions, Image, StyleSheet, TouchableOpacity } from "react-native";
import POST_TYPE from "../types/POST_TYPE";
import { router } from "expo-router";
import { useEffect, useState } from "react";

const screenWidth = Dimensions.get("window").width;

export default function PostCard({
  isFeatured,
  post,
}: {
  isFeatured: boolean;
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
}

const styles = StyleSheet.create({});
