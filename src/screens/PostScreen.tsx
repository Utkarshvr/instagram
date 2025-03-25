import Carousel, {
  ICarouselInstance,
  Pagination,
} from "react-native-reanimated-carousel";
import { useEffect, useRef, useState } from "react";
import { Dimensions, Image, ScrollView, View } from "react-native";
import { fetchDocByID } from "../utils/firebase-helpers";
import { useLocalSearchParams } from "expo-router/build/hooks";
import POST_TYPE from "../types/POST_TYPE";
import { useSharedValue } from "react-native-reanimated";
import MyVideoComponent from "../components/MyVideoComponent";

const screenWidth = Dimensions.get("window").width;

export default function PostScreen() {
  const { postId } = useLocalSearchParams();
  // Convert postId to a string
  const uid = Array.isArray(postId) ? postId[0] : postId;

  const [post, setPost] = useState<POST_TYPE>();
  const ref = useRef<ICarouselInstance>(null);
  const progress = useSharedValue<number>(0);

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

  useEffect(() => {
    (async () => {
      const { data } = await fetchDocByID<POST_TYPE>("posts", uid);
      setPost(data);
    })();
  }, []);

  if (post)
    return (
      <ScrollView
        contentContainerStyle={{ flex: 1 }}
        className="bg-neutral-950"
      >
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
        </View>
      </ScrollView>
    );
}
