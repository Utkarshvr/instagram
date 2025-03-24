import { useState, useEffect } from "react";
import {
  Button,
  Text,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import * as MediaLibrary from "expo-media-library";
import { Image } from "expo-image";

export default function App() {
  const [permissionResponse, requestPermission] = MediaLibrary.usePermissions();
  const [assets, setAssets] = useState<MediaLibrary.Asset[]>([]);

  useEffect(() => {
    console.log("HELLLOOO");
    async function getAllAssets() {
      if (permissionResponse?.status !== "granted") {
        const { status } = await requestPermission(); // Wait for permission
        if (status !== "granted") {
          console.log("Permission denied!");
          return;
        }
      }

      const albums = await MediaLibrary.getAlbumsAsync({
        includeSmartAlbums: true, // Enable smart albums to access Camera/DCIM
      });
      console.log("📁 Available Albums:", albums);

      const allAssets = await MediaLibrary.getAssetsAsync({
        mediaType: MediaLibrary.MediaType.photo,
        first: 1000, // Fetch more images
        sortBy: MediaLibrary.SortBy.creationTime,
        album: undefined, // Ensure it's fetching from all albums
      });
      console.log("📸 All Images:", allAssets.assets);
      setAssets(allAssets.assets);

      console.log({ allAssets });
      setAssets(allAssets.assets);
    }
    getAllAssets();
  }, [permissionResponse]); // Depend on permissionResponse

  return (
    <ScrollView
      className="bg-neutral-900"
      contentContainerStyle={{ flexDirection: "row", display: "flex", flex: 1 }}
    >
      {assets &&
        assets.map((asset) => {
          console.log(asset);
          return (
            <View className="w-fit gap-1" key={asset.id}>
              {/* <Text className="text-neutral-50 font-monospace">
                {asset.filename}
              </Text> */}
              <Image
                key={asset.id}
                source={{ uri: asset.uri }}
                style={{
                  width: 120,
                  height: 120,
                }}
                contentFit="contain"
              />
            </View>
          );
        })}
    </ScrollView>
  );
}
