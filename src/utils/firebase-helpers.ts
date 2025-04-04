import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../app/_layout";
import FlwType from "../types/FlwType";
import FlwReqType from "../types/FlwReqType";
import UserType from "../types/UserType";
import COLLECTION_NAME_TYPE from "../types/COLLECTION_NAME_TYPE";
import { FirebaseError } from "firebase/app";
import POST_TYPE from "../types/POST_TYPE";

export const sendFollowRequest = async (
  currentUserId: string,
  targetUserId: string
) => {
  const targetUserRef = doc(db, "users", targetUserId);
  const targetUserSnap = await getDoc(targetUserRef);

  if (targetUserSnap.exists()) {
    const targetUser = targetUserSnap.data();
    try {
      if (targetUser.isPrivate) {
        // Create follow request document
        const requestRef = doc(collection(db, "followRequests"));
        await setDoc(requestRef, {
          from: currentUserId,
          to: targetUserId,
          seen: false, // Mark as unseen initially
        });
      } else {
        // Public profile: Directly follow
        const followingRef = doc(collection(db, "following"));
        await setDoc(followingRef, {
          owner: currentUserId,
          user_id: targetUserId,
        });

        const followerRef = doc(collection(db, "followers"));
        await setDoc(followerRef, {
          owner: targetUserId,
          user_id: currentUserId,
        });
      }
      return { isDone: true, error: null };
    } catch (error) {
      // console.log(error);
      return { isDone: false, error };
    }
  }
  return { isDone: false, error: null };
};

export const unfollowUser = async (
  currentUserId: string,
  targetUserId: string
): Promise<boolean> => {
  try {
    // ✅ Remove 'following' record (currentUser stops following targetUser)
    const followingQuery = query(
      collection(db, "following"),
      where("owner", "==", currentUserId), // currentUser follows targetUser
      where("user_id", "==", targetUserId)
    );
    const followingSnap = await getDocs(followingQuery);

    if (!followingSnap.empty) {
      await deleteDoc(followingSnap.docs[0].ref);
    }

    // ✅ Remove 'followers' record (targetUser loses currentUser as a follower)
    const followersQuery = query(
      collection(db, "followers"),
      where("owner", "==", targetUserId), // targetUser's followers list
      where("user_id", "==", currentUserId) // currentUser is in their followers list
    );
    const followersSnap = await getDocs(followersQuery);

    if (!followersSnap.empty) {
      await deleteDoc(followersSnap.docs[0].ref);
    }
    // console.log("Successfully unfollowed the user.");
    return true;
  } catch (error) {
    console.error("Error unfollowing user:", error);
    return false;
  }
};

export const removeFollowRequest = async (
  fromUserId: string,
  toUserId: string
): Promise<boolean> => {
  try {
    // ✅ Query for follow requests where `from` or `to` match current/target user
    const requestQuery = query(
      collection(db, "followRequests"),
      where("from", "==", fromUserId),
      where("to", "==", toUserId)
    );

    const requestSnap = await getDocs(requestQuery);

    if (requestSnap.empty) {
      // console.log("No follow request found.");
      return false; // No request found
    }

    // ✅ Delete all matching requests (should only be one)
    const deletePromises = requestSnap.docs.map((docSnap) =>
      deleteDoc(docSnap.ref)
    );
    await Promise.all(deletePromises);

    // console.log("Follow request removed successfully.");
    return true;
  } catch (error) {
    console.error("Error removing follow request:", error);
    return false;
  }
};

export const checkFollowStatus = async (
  currentUserId: string,
  targetUserId: string
): Promise<{ isFollowing: boolean; hasRequested: boolean }> => {
  try {
    // Reference to 'following' document (if currentUser follows targetUser)
    const followingRef = collection(db, "following");
    // ✅ Check if a follow request exists (where `from` or `to` matches current or target user)
    const followingQuery = query(
      followingRef,
      where("owner", "==", currentUserId),
      where("user_id", "==", targetUserId)
    );
    const followingSnap = await getDocs(followingQuery);
    const isFollowing = !followingSnap.empty;

    // Reference to 'followRequests' document (if currentUser has requested to follow targetUser)
    const requestRef = collection(db, "followRequests");
    // ✅ Check if a follow request exists (where `from` or `to` matches current or target user)
    const requestQuery = query(
      requestRef,
      where("from", "==", currentUserId),
      where("to", "==", targetUserId)
    );
    const requestSnap = await getDocs(requestQuery);
    const hasRequested = !requestSnap.empty;

    return {
      isFollowing, // True if the document exists
      hasRequested, // True if the request exists
    };
  } catch (error) {
    console.error("Error checking follow status:", error);
    return { isFollowing: false, hasRequested: false };
  }
};

export const checkFriendRequestByUserID = async (
  currentUserId: string,
  targetUserId: string
): Promise<{ hasReqReceieved: boolean; requestId: string | null }> => {
  try {
    // Reference to 'followRequests' document (if currentUser has requested to follow targetUser)
    const requestRef = collection(db, "followRequests");
    // ✅ Check if a follow request exists (where `from` or `to` matches current or target user)
    const requestQuery = query(
      requestRef,
      where("from", "==", targetUserId),
      where("to", "==", currentUserId)
    );
    const requestSnap = await getDocs(requestQuery);
    const hasReqReceieved = !requestSnap.empty;
    // // console.log(requestSnap.docs[0].id);
    return {
      hasReqReceieved, // True if the request exists
      requestId: !requestSnap.empty ? requestSnap.docs[0].id : null,
    };
  } catch (error) {
    console.error("Error checking follow status:", error);
    return { hasReqReceieved: false, requestId: null };
  }
};

export const markFollowRequestsAsSeen = async (currentUserId: string) => {
  const requestRef = collection(db, "followRequests");
  const q = query(requestRef, where("to", "==", currentUserId));

  const querySnapshot = await getDocs(q);
  querySnapshot.forEach(async (docSnap) => {
    await updateDoc(docSnap.ref, { seen: true });
  });
};

export const acceptFollowRequest = async (
  requestId: string,
  fromUserId: string,
  toUserId: string
) => {
  // console.log({ requestId });
  try {
    // Add to followers
    const followerRef = doc(collection(db, "followers"));
    await setDoc(followerRef, {
      owner: toUserId,
      user_id: fromUserId,
    });

    // Add to following
    const followingRef = doc(collection(db, "following"));
    await setDoc(followingRef, {
      owner: fromUserId,
      user_id: toUserId,
    });

    // Remove the follow request
    await deleteDoc(doc(db, "followRequests", requestId));
    return true;
  } catch (error) {
    // console.log(error);
    return false;
  }
};

export const getUnseenFollowRequests = async (currentUserId: string) => {
  const requestRef = collection(db, "followRequests");
  const q = query(
    requestRef,
    where("to", "==", currentUserId),
    where("seen", "==", false)
  );

  const querySnapshot = await getDocs(q);
  return querySnapshot.size; // Count unseen requests
};

export const fetchFollowers = async (userId: string) => {
  try {
    const followersRef = collection(db, "followers");
    const q = query(followersRef, where("owner", "==", userId));

    const querySnapshot = await getDocs(q);
    const followers = querySnapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        } as FlwType)
    );

    return followers; // Returns an array of followers
  } catch (error) {
    console.error("Error fetching followers:", error);
    return [];
  }
};
export const fetchFollowing = async (userId: string) => {
  try {
    const followersRef = collection(db, "following");
    const q = query(followersRef, where("owner", "==", userId));

    const querySnapshot = await getDocs(q);
    const followers = querySnapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        } as FlwType)
    );

    return followers; // Returns an array of followers
  } catch (error) {
    console.error("Error fetching followers:", error);
    return [];
  }
};

export const fetchFollowRequests = async (userId: string) => {
  try {
    const followersRef = collection(db, "followRequests");
    const q = query(followersRef, where("to", "==", userId));

    const querySnapshot = await getDocs(q);
    const followers = querySnapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        } as FlwReqType)
    );

    return followers; // Returns an array of followers
  } catch (error) {
    console.error("Error fetching followers:", error);
    return [];
  }
};

export const fetchUsersByIds = async (userIds: string[]) => {
  // Ensure userIds is an array of strings
  if (userIds.length === 0) return []; // ✅ Handle empty array case

  try {
    const userPromises = userIds.map(async (userId) => {
      const userDocRef = doc(db, "users", userId); // userId should be a string
      const userSnap = await getDoc(userDocRef);
      return userSnap.exists()
        ? ({ uid: userSnap.id, ...userSnap.data() } as UserType)
        : null;
    });

    const users = await Promise.all(userPromises);
    return users.filter((user) => user !== null); // ✅ Remove null values (non-existing users)
  } catch (error) {
    console.error("Error fetching users:", error);
    return [];
  }
};

// BETTER & FLEXIBLE FOR ALL TYPES

export async function fetchDocByID<T = any>(
  collection_name: COLLECTION_NAME_TYPE,
  id: string
) {
  try {
    const ref = doc(db, collection_name, id);
    const snap = await getDoc(ref);

    if (!snap.exists()) {
      return {
        isSuccess: false,
        error: { message: "Doc not found" },
        data: null,
      };
    }

    return {
      isSuccess: true,
      error: null,
      data: { uid: snap.id, id: snap.id, ...snap.data() } as T,
    };
  } catch (error) {
    console.error("Error fetching doc:", error);
    return { isSuccess: false, error: error as FirebaseError, data: null };
  }
}

export async function fetchAllDocs<T>(collection_name: COLLECTION_NAME_TYPE) {
  try {
    const ref = collection(db, collection_name);
    const snapshot = await getDocs(ref);
    // Convert Firestore data to ProjectType[]
    const data = snapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        } as T)
    );

    return {
      isSuccess: true,
      error: null,
      data,
    };
  } catch (error) {
    // console.log(error);
    return { isSuccess: false, error: error as FirebaseError, data: null };
  }
}

export async function createFB(
  collection_name: COLLECTION_NAME_TYPE,
  data: any
) {
  try {
    const ref = doc(collection(db, collection_name));
    await setDoc(ref, data);

    return { isSuccess: true, error: null, id: ref.id };
  } catch (error) {
    // console.log(error);
    return { isSuccess: false, error: error as FirebaseError, id: null };
  }
}

export async function updateFB(
  collection_name: COLLECTION_NAME_TYPE,
  id: string,
  data: any
) {
  try {
    const ref = doc(db, collection_name, id);
    await updateDoc(ref, data);

    return { isSuccess: true, error: null };
  } catch (error) {
    console.error("Error updating project:", error);
    return { isSuccess: false, error: error as FirebaseError };
  }
}
export async function deleteFB(
  collection_name: COLLECTION_NAME_TYPE,
  id: string
) {
  try {
    const ref = doc(db, collection_name, id);
    await deleteDoc(ref);

    return { isSuccess: true, error: null };
  } catch (error) {
    console.error("Error deleting document:", error);
    return { isSuccess: false, error: error as FirebaseError };
  }
}

// export async function fetchPosts(targetUserID: string, currentUserID: string) {
//   try {
//     // Create a query to fetch only posts where owner === targetUserID
//     const ref = query(
//       collection(db, "posts"),
//       where("owner", "==", targetUserID)
//     );

//     const snapshot = await getDocs(ref);

//     // Convert Firestore data to POST_TYPE[]
//     const data = snapshot.docs.map(
//       (doc) =>
//         ({
//           id: doc.id,
//           ...doc.data(),
//         } as POST_TYPE)
//     );

//     return {
//       isSuccess: true,
//       error: null,
//       data,
//     };
//   } catch (error) {
//     // console.log(error);
//     return { isSuccess: false, error: error as FirebaseError, data: null };
//   }
// }
export async function fetchPosts(targetUserID: string, currentUserID: string) {
  try {
    async function sendPosts() {
      const postsRef = query(
        collection(db, "posts"),
        where("owner", "==", targetUserID)
      );
      const postsSnapshot = await getDocs(postsRef);
      const data = postsSnapshot.docs.map(
        (doc) =>
          ({
            id: doc.id,
            ...doc.data(),
          } as POST_TYPE)
      );

      return {
        isSuccess: true,
        error: null,
        data,
      };
    }

    const usersRef = collection(db, "users");
    const targetUserDoc = await getDoc(doc(usersRef, targetUserID));
    const targetUserData = targetUserDoc.data();

    if (targetUserID === currentUserID) return sendPosts();

    if (!targetUserData.isPrivate) return sendPosts();

    // Check if following
    const followersRef = collection(db, "followers");
    const followersSnapshot = await getDocs(followersRef);
    const currentUserFollowsTargetUser = followersSnapshot.docs.some((f) => {
      const data = f.data();
      return data.owner === targetUserDoc.id && data.user_id === currentUserID;
    });

    if (currentUserFollowsTargetUser) return sendPosts();
    return {
      isSuccess: false,
      error: "This is a private account and you don't follow the account!",
      data: null,
    };
  } catch (error) {
    // console.log(error);
    return { isSuccess: false, error: error as FirebaseError, data: null };
  }
}

export const fetchAllPosts = async (currentUserID: string) => {
  try {
    const postsRef = collection(db, "posts");
    const usersRef = collection(db, "users");
    const followersRef = collection(db, "followers");

    const postsSnapshot = await getDocs(postsRef);
    const followersSnapshot = await getDocs(followersRef);
    let filteredPosts = [];

    for (let post of postsSnapshot.docs) {
      const postData = post.data();
      const ownerId = postData.owner;

      // Fetch owner's user data
      const ownerDoc = await getDoc(doc(usersRef, ownerId));
      if (!ownerDoc.exists()) continue;

      const ownerData = ownerDoc.data();

      const currentUserFollowesOwner = followersSnapshot.docs.some((f) => {
        const data = f.data();
        return data.owner === ownerId && data.user_id === currentUserID;
      });

      const isMe = currentUserID === ownerId;

      if (isMe || !ownerData.isPrivate || currentUserFollowesOwner) {
        filteredPosts.push({ id: post.id, ...postData });
      }
    }

    return filteredPosts;
  } catch (error) {
    console.error("Error fetching posts:", error);
    return [];
  }
};
