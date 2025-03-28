import { signOut } from "firebase/auth";
// import { AdvancedImage } from "cloudinary-react-native";
import { Button, SafeAreaView } from "react-native";
import { auth } from "../_layout";
// import { myCld } from "@/src/lib/cloudinary";

// const myImage = myCld.image("pokedex_315bf9a908");

export default function Home() {
  return (
    <SafeAreaView className="bg-neutral-950 flex-1 gap-5">
      <Button
        onPress={() => {
          signOut(auth);
        }}
        title="Log out"
      />
      {/* <AdvancedImage cldImg={myImage} style={{ width: "100%", height: 200 }} /> */}
    </SafeAreaView>
  );
}
