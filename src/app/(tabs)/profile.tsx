import LoadingScreen from "@/src/components/LoadingScreen";
import ProfileScreen from "@/src/screens/ProfileScreen";
import useUserStore from "@/src/store/userStore";

export default function profile() {
  const { user, fetchUser, isFetching } = useUserStore();
  
  if (isFetching) return <LoadingScreen />;
  return (
    user && (
      <ProfileScreen
        user={user}
        refreshing={isFetching}
        fetchUser={() => fetchUser(user.uid)}
      />
    )
  );
}
