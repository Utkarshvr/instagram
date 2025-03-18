import { create } from "zustand";

// create an interface for the store to implement
interface UserStore {
  text: string;
  setText(text: string): void;
}

// create the bear store, implementing the Store interface
const useSearchStore = create<UserStore>((set) => ({
  text: "",
  setText(text) {
    set(() => ({ text }));
  },
}));

// export the useSearchStore hook
export default useSearchStore;
