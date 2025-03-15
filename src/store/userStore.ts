import { create } from "zustand";
import UserType from "../types/UserType";

// create an interface for the store to implement
interface UserStore {
  user: null | UserType;
  setUser(user: UserType): void;
}

// create the bear store, implementing the Store interface
const useUserStore = create<UserStore>((set) => ({
  user: null,
  setUser(user) {
    set((state) => ({ user }));
  },
}));

// export the useUserStore hook
export default useUserStore;
