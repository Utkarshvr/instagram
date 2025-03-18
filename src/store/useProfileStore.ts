import { create } from "zustand";
import FlwType from "../types/FlwType";

// create an interface for the store to implement
interface ProfileStore {
  userFollowers: FlwType[];
  userFollowing: FlwType[];
  setUserFollowers: (array: FlwType[]) => void;
  setUserFollowing: (array: FlwType[]) => void;
}

// create the bear store, implementing the Store interface
const useProfileStore = create<ProfileStore>((set) => ({
  userFollowers: [],
  userFollowing: [],

  setUserFollowers(array: FlwType[]) {
    set(() => ({ userFollowing: array }));
  },
  setUserFollowing(array: FlwType[]) {
    set(() => ({ userFollowing: array }));
  },
}));

// export the useProfileStore hook
export default useProfileStore;
