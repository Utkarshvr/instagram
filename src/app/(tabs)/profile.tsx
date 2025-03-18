import ProfileScreen from "@/src/screens/ProfileScreen";
import useUserStore from "@/src/store/userStore";

export default function profile() {
  const { user } = useUserStore();

  return <ProfileScreen user={user} />;
}
