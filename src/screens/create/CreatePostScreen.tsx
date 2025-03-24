import * as React from "react";
import * as ImagePicker from "expo-image-picker";
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

const width = Dimensions.get("window").width;

export default function CreatePostScreen() {
  const [isOpeningImageLib, setIsOpeningImageLib] = useState(false);
  const [selectedItems, setSelectedItems] = useState<
    ImagePicker.ImagePickerAsset[]
  >([]);

  async function selectItems() {
    try {
      setIsOpeningImageLib(true);
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        // allowsEditing: true,
        allowsMultipleSelection: true,
      });

      // Ensure result is not canceled and has assets before updating state
      if (!result.canceled && result.assets && selectedItems !== null) {
        setSelectedItems((prev) => [...prev, ...result.assets]);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsOpeningImageLib(false);
    }
  }

  useEffect(() => {
    if (selectedItems && selectedItems?.length > 0) return;
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

  const [form, setForm] = useState({
    caption: "",
  });

  async function uploadPost() {}

  if (isOpeningImageLib) return <LoadingScreen />;

  return (
    <View className="flex-1 bg-neutral-950">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        {selectedItems && (
          <View className="relative">
            <Carousel
              data={selectedItems}
              ref={ref}
              width={width}
              height={width}
              onProgressChange={progress}
              renderItem={({ item }) => (
                <View
                  style={{
                    flex: 1,
                    borderWidth: 1,
                    justifyContent: "center",
                  }}
                  // className="bg-sky-500"
                >
                  <Image
                    key={item.uri}
                    source={{ uri: item.uri }}
                    style={{
                      width: width,
                      height: width,
                      objectFit: "scale-down",
                    }}
                  />
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
              className="absolute bottom-4 right-4 bg-white rounded-full"
              onPress={selectItems}
            >
              <Ionicons
                name="add-circle-outline"
                size={36}
                color={"#333"}
                className="bg-transparent rounded-full"
              />
            </TouchableOpacity>
          </View>
        )}

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
          // disabled={!isFormValid && isLogging}
          onPress={uploadPost}
        >
          <View className={`bg-sky-500 p-2 rounded-md w-full items-center`}>
            {false ? (
              <ActivityIndicator size={"large"} />
            ) : (
              <Text className="font-montserrat text-white">Upload</Text>
            )}
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}
