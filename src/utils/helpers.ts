import { ToastAndroid } from "react-native";
import * as FileSystem from "expo-file-system";

export function toastMsg(msg: string) {
  ToastAndroid.showWithGravityAndOffset(
    msg,
    ToastAndroid.LONG,
    ToastAndroid.BOTTOM,
    25,
    50
  );
}

export const uploadToCloudinary = async (imageUri: string) => {
  const base64 = await FileSystem.readAsStringAsync(imageUri, {
    encoding: "base64",
  });

  const cloudinaryData = new FormData();
  cloudinaryData.append("file", `data:image/jpeg;base64,${base64}`);
  cloudinaryData.append("upload_preset", "gqe2cz1u"); // From Cloudinary Dashboard
  cloudinaryData.append("cloud_name", "uv-codes");

  try {
    const response = await fetch(
      "https://api.cloudinary.com/v1_1/uv-codes/image/upload",
      {
        method: "POST",
        body: cloudinaryData,
      }
    );

    const data = await response.json();
    console.log("Cloudinary Repsne: ", data);
    console.log("Cloudinary URL:", data.secure_url);
    return data.secure_url;
  } catch (error) {
    console.error("Upload Error:", error);
    return null;
  }
};

export function shortenString(str: string, maxLength: number) {
  let newStr = "";

  if (str.length > maxLength) {
    newStr = str.slice(0, maxLength) + "...";
  }

  return newStr;
}
