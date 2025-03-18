interface UserType {
  uid: string;
  username: string;
  email: string;
  picture?: string;
  name?: string;
  bio?: string;

  isPrivate: boolean;
  followers: string[];
  following: string[];
  followRequests: { userId: string; seen: boolean }[];
}

export default UserType;
