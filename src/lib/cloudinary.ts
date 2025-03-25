import { Cloudinary } from "@cloudinary/url-gen";

export const myCld = new Cloudinary({
  cloud: {
    cloudName: process.env.EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME,
  },
});
