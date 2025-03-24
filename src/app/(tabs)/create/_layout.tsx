import { router } from "expo-router";
import { useEffect } from "react";

export default function layout() {
  useEffect(() => {
    router.push("/(others)/create/post");
  }, []);

  return null;
}
