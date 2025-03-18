import { create } from "zustand";
import UserType from "../types/UserType";
import FlwReqType from "../types/FlwReqType";

// create an interface for the store to implement
interface UserStore {
  user: null | UserType;
  setUser(user: UserType): void;
  flwReqs: FlwReqType[];
  setFlwReqs: (array: FlwReqType[]) => void;
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
}));

// export the useUserStore hook
export default useUserStore;
