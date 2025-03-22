import { create } from "zustand";
import UserType from "../types/UserType";
import FlwReqType from "../types/FlwReqType";
import { fetchDocByID } from "../utils/firebase-helpers";

// create an interface for the store to implement
interface UserStore {
  user: null | UserType;
  setUser(user: UserType): void;
  flwReqs: FlwReqType[];
  setFlwReqs: (array: FlwReqType[]) => void;

  fetchUser: (userID: string) => Promise<void>;

  isFetching: boolean;
  setIsFetching: () => void;
}

// create the bear store, implementing the Store interface
const useUserStore = create<UserStore>((set) => ({
  user: null,
  flwReqs: [],

  setUser(user) {
    set((state) => ({ user }));
  },
  setFlwReqs(array: FlwReqType[]) {
    set(() => ({ flwReqs: array }));
  },
  async fetchUser(userID) {
    set(() => ({ isFetching: true }));
    if (!userID) {
      set(() => ({ isFetching: false }));
      return console.log("userID not present");
    }
    const { isSuccess, data } = await fetchDocByID<UserType>("users", userID);
    if (isSuccess)
      set(() => ({
        user: data,
      }));

    set(() => ({ isFetching: false }));
  },

  isFetching: false,
  setIsFetching() {
    set((state) => ({ isFetching: !state.isFetching }));
  },
}));

// export the useUserStore hook
export default useUserStore;
