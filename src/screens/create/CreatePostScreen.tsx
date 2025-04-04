import * as React from "react";
import * as ImagePicker from "expo-image-picker";
import { useVideoPlayer, VideoView } from "expo-video";
import LoadingScreen from "@/src/components/LoadingScreen";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { useSharedValue } from "react-native-reanimated";
import Carousel, {
  ICarouselInstance,
  Pagination,
} from "react-native-reanimated-carousel";
import Ionicons from "@expo/vector-icons/Ionicons";
import { toastMsg } from "@/src/utils/helpers";
import { upload } from "cloudinary-react-native";
import { myCld } from "@/src/lib/cloudinary";
import { createFB } from "@/src/utils/firebase-helpers";
import POST_TYPE from "@/src/types/POST_TYPE";
import { router } from "expo-router";
import { auth } from "@/src/app/_layout";

const width = Dimensions.get("window").width;

export default function CreatePostScreen() {
  const [isOpeningImageLib, setIsOpeningImageLib] = useState(false);
  const [isUploadingItems, setIsUploadingItems] = useState(false);
  const [selectedItems, setSelectedItems] = useState<
    ImagePicker.ImagePickerAsset[]
  >([]);

  const [videoSource, setVideoSource] = useState("");

  async function selectItems() {
    try {
      setIsOpeningImageLib(true);
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        // allowsEditing: true,
        allowsMultipleSelection: true,
        quality: 0.5,
        // videoQuality:,
      });

      // Ensure result is not canceled and has assets before updating state
      if (!result.canceled && result.assets && selectedItems !== null) {
        setSelectedItems((prev) => [...prev, ...result.assets]);
      }
    } catch (error) {
      // console.log(error);
    } finally {
      setIsOpeningImageLib(false);
    }
  }

  const player = useVideoPlayer(videoSource, (player) => {
    player.loop = true;
    player.play();
  });

  useEffect(() => {
    if (selectedItems?.length > 0) return;
    selectItems();
  }, []);

  const ref = React.useRef<ICarouselInstance>(null);
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

  const removeImg = () => {
    // console.log(progress.get());
    setSelectedItems((prev) =>
      prev.filter((_value, index) => index !== progress.get())
    );
  };

  const [form, setForm] = useState({
    caption: "",
  });

  async function uploadPost() {
    if (selectedItems.length === 0) return toastMsg("No image selected");
    let errorWhileUploadingOnCloudinary = false;
    // Upload images to cloudinary
    setIsUploadingItems(true);
    const uploadedItems = [];
    await Promise.all(
      selectedItems.map(async (item) => {
        // console.log(item);
        return await upload(myCld, {
          file: item.uri,
          options: {
            upload_preset: process.env.EXPO_PUBLIC_CLOUDINARY_PRESET_NAME,
            unsigned: true,
            resource_type: "auto",
          },
          callback: (error, response) => {
            // console.log(error, response);
            if (error || !response) errorWhileUploadingOnCloudinary = true;
            if (response) {
              uploadedItems.push({
                public_id: response.public_id,
                asset_id: response.asset_id,
                folder: response.folder,
                resource_type: response.resource_type,
                secure_url: response.secure_url,
              });
            }
            if (error) toastMsg(error.message);
          },
        });
      })
    );

    if (errorWhileUploadingOnCloudinary) {
      setIsUploadingItems(false);
      return;
    }

    try {
      // Upload to firebase
      await createFB("posts", {
        items: uploadedItems,
        caption: form.caption,
        type: "post",
        owner: auth.currentUser.uid,
      } as POST_TYPE);
      toastMsg("Uploaded Successfully!");
      router.back();
    } catch (error) {
      // console.log(error);
      toastMsg(error.message || "Unkown error");
    } finally {
      setIsUploadingItems(false);
    }
  }

  const setVideoSourceFunction = (currentIndex: number) => {
    const currentItem = selectedItems[currentIndex];
    if (currentItem && currentItem.type === "video") {
      setVideoSource(currentItem.uri);
    }
  };

  useEffect(() => {
    setVideoSourceFunction(0);
  }, [selectedItems]);

  if (isOpeningImageLib) return <LoadingScreen />;

  return (
    <View className="flex-1 bg-neutral-950">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        {selectedItems.length > 0 && (
          <View className="relative">
            <Carousel
              data={selectedItems}
              ref={ref}
              width={width}
              height={width}
              loop={false}
              onProgressChange={progress}
              onSnapToItem={(index) => setVideoSourceFunction(index)} // Track current index
              renderItem={({ item }) => (
                <View
                  style={{
                    flex: 1,
                    borderWidth: 1,
                    justifyContent: "center",
                  }}
                >
                  {item.type === "image" ? (
                    <Image
                      key={item.uri}
                      source={{ uri: item.uri }}
                      style={{
                        width: width,
                        height: width,
                        objectFit: "scale-down",
                      }}
                    />
                  ) : (
                    <VideoView
                      style={{
                        width: width,
                        height: width,
                      }}
                      player={player}
                      allowsFullscreen
                      allowsPictureInPicture
                    />
                  )}
                </View>
              )}
            />

            <Pagination.Basic
              progress={progress}
              data={selectedItems}
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
              className="absolute top-4 left-4"
              onPress={removeImg}
            >
              <Ionicons
                name="close"
                size={24}
                color={"white"}
                className="bg-neutral-900 rounded-full p-2"
              />
            </TouchableOpacity>
          </View>
        )}

        {selectedItems.length === 0 && (
          <Text className="p-2 text-sm text-neutral-400 font-montserratSemiBold">
            No Image is selected
          </Text>
        )}
        <TouchableOpacity className="mx-auto" onPress={selectItems}>
          <Text className="text-sky-500 font-montserratSemiBold text-sm pt-2">
            Add media
          </Text>
        </TouchableOpacity>

        <View className="px-2 py-4">
          <TextInput
            value={form.caption}
            onChangeText={(text) =>
              setForm((prev) => ({ ...prev, caption: text }))
            }
            className=" w-full rounded-md border-b border-b-neutral-600 text-neutral-50 font-montserrat"
            placeholder="Caption"
            placeholderTextColor={"white"}
            multiline
          />

          {/* (ADD MUSIC) COMING SOON 🙂 */}
          {/* <TouchableOpacity className="py-4 flex flex-row items-center justify-between">
            <View className={`flex flex-row gap-2`}>
              <Ionicons name="musical-note" size={18} color={"white"} />
              <Text className="font-montserrat text-white">Add Music</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={"#525252"} />
          </TouchableOpacity> */}
        </View>
      </ScrollView>
      <View className="flex gap-2 items-center justify-center w-[95%] fixed bottom-4 left-[2.5%] right-[2.5%]">
        <TouchableOpacity
          className="w-full"
          disabled={selectedItems.length === 0}
          onPress={uploadPost}
        >
          <View
            className={`${
              selectedItems.length === 0 || isUploadingItems
                ? "bg-neutral-800"
                : "bg-sky-500"
            } p-2 rounded-md w-full items-center`}
          >
            {isUploadingItems ? (
              <ActivityIndicator size={"small"} />
            ) : (
              <Text className="font-montserrat text-white">Upload</Text>
            )}
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}
