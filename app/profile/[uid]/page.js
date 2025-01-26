"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { doc, getDoc, updateDoc, getDocs, query, where, collection } from "firebase/firestore";
import { db, auth } from "@/lib/firebase";

export default function UserProfile() {
  const { uid } = useParams(); // Get UID from the route
  const [profile, setProfile] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [followersData, setFollowersData] = useState([]);
  const [followingData, setFollowingData] = useState([]);
  const [viewingFollowers, setViewingFollowers] = useState(false);
  const [viewingFollowing, setViewingFollowing] = useState(false);
  const [createdChallenges, setCreatedChallenges] = useState([]); // State for created challenges
  const [joinedChallenges, setJoinedChallenges] = useState([]); // State for joined challenges

  const router = useRouter();

  useEffect(() => {
    const fetchProfile = async () => {
      const userDoc = await getDoc(doc(db, "users", uid));
      if (userDoc.exists()) {
        setProfile({ id: userDoc.id, ...userDoc.data() });
      }
    };

    const fetchCurrentUser = async () => {
      const user = auth.currentUser;
      if (user) {
        const currentUserDoc = await getDoc(doc(db, "users", user.uid));
        if (currentUserDoc.exists()) {
          setCurrentUser({ id: currentUserDoc.id, ...currentUserDoc.data() });
          setIsFollowing(currentUserDoc.data().following.includes(uid));
        }
      }
    };

    const fetchCreatedChallenges = async () => {
      const challengesQuery = query(
        collection(db, "challenges"),
        where("createdBy", "==", uid)
      );
      const challengesSnapshot = await getDocs(challengesQuery);
      const challenges = challengesSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCreatedChallenges(challenges);
    };

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const fetchJoinedChallenges = async () => {
      if (profile?.joinedChallenges?.length) {
        const joinedChallengesQuery = query(
          collection(db, "challenges"),
          where("__name__", "in", profile.joinedChallenges)
        );
        const challengesSnapshot = await getDocs(joinedChallengesQuery);
        const challenges = challengesSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setJoinedChallenges(challenges);
      }
    };

    fetchProfile();
    fetchCurrentUser();
    fetchCreatedChallenges();
  }, [uid]);

  useEffect(() => {
    if (profile) {
      const loadFollowers = async () => {
        const followers = await fetchUsers(profile.followers);
        setFollowersData(followers);
      };

      const loadFollowing = async () => {
        const following = await fetchUsers(profile.following);
        setFollowingData(following);
      };

      const fetchJoinedChallenges = async () => {
        if (profile?.joinedChallenges?.length) {
          const joinedChallengesQuery = query(
            collection(db, "challenges"),
            where("__name__", "in", profile.joinedChallenges)
          );
          const challengesSnapshot = await getDocs(joinedChallengesQuery);
          const challenges = challengesSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setJoinedChallenges(challenges);
        }
      };

      loadFollowers();
      loadFollowing();
      fetchJoinedChallenges();
    }
  }, [profile]);

  const fetchUsers = async (uids) => {
    if (!uids.length) return [];
    const usersQuery = query(collection(db, "users"), where("__name__", "in", uids));
    const querySnapshot = await getDocs(usersQuery);
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  };

  const handleFollow = async () => {
    if (!currentUser) return;

    const currentUserRef = doc(db, "users", currentUser.id);
    const profileRef = doc(db, "users", profile.id);

    if (isFollowing) {
      // Unfollow logic
      await updateDoc(currentUserRef, {
        following: currentUser.following.filter((id) => id !== uid),
      });
      await updateDoc(profileRef, {
        followers: profile.followers.filter((id) => id !== currentUser.id),
      });
    } else {
      // Follow logic
      await updateDoc(currentUserRef, {
        following: [...currentUser.following, uid],
      });
      await updateDoc(profileRef, {
        followers: [...profile.followers, currentUser.id],
      });
    }

    setIsFollowing(!isFollowing);
  };

  const renderFollowers = () => (
    <div className="p-4">
      <h2 className="text-xl font-bold text-pink-600 mb-4">Followers</h2>
      <ul>
        {followersData.map((follower) => (
          <li
            key={follower.id}
            className="cursor-pointer text-pink-500 hover:underline"
            onClick={() => router.push(`/profile/${follower.id}`)}
          >
            {follower.name || follower.email}
          </li>
        ))}
      </ul>
      <button
        className="mt-4 bg-gray-400 text-white py-2 px-4 rounded-md hover:bg-gray-600"
        onClick={() => setViewingFollowers(false)}
      >
        Close
      </button>
    </div>
  );

  const renderFollowing = () => (
    <div className="p-4">
      <h2 className="text-xl font-bold text-pink-600 mb-4">Following</h2>
      <ul>
        {followingData.map((following) => (
          <li
            key={following.id}
            className="cursor-pointer text-pink-500 hover:underline"
            onClick={() => router.push(`/profile/${following.id}`)}
          >
            {following.name || following.email}
          </li>
        ))}
      </ul>
      <button
        className="mt-4 bg-gray-400 text-white py-2 px-4 rounded-md hover:bg-gray-600"
        onClick={() => setViewingFollowing(false)}
      >
        Close
      </button>
    </div>
  );

  if (!profile) return <p className="text-center mt-6">Loading...</p>;

  return (
    <div className="min-h-screen bg-pink-100 flex flex-col items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md text-center">
        <h1 className="text-3xl font-bold text-pink-600 mb-4">{profile.name}</h1>
        <p className="text-gray-600 mb-4">{profile.email}</p>
        <div className="flex justify-around mb-4">
          <button
            onClick={() => setViewingFollowers(true)}
            className="text-pink-500 underline"
          >
            Followers: {profile.followers?.length || 0}
          </button>
          <button
            onClick={() => setViewingFollowing(true)}
            className="text-pink-500 underline"
          >
            Following: {profile.following?.length || 0}
          </button>
        </div>
        {profile.id !== currentUser?.id && (
          <button
            onClick={handleFollow}
            className={`py-2 px-4 rounded-lg transition duration-200 ${
              isFollowing
                ? "bg-gray-400 text-white hover:bg-gray-600"
                : "bg-pink-500 text-white hover:bg-pink-600"
            }`}
          >
            {isFollowing ? "Unfollow" : "Follow"}
          </button>
        )}
      </div>
      {viewingFollowers && renderFollowers()}
      {viewingFollowing && renderFollowing()}
      <div className="bg-white mt-6 p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-xl font-bold text-pink-600 mb-4">Created Challenges</h2>
        <ul>
          {createdChallenges.map((challenge) => (
            <li key={challenge.id} className="text-pink-500 mb-2">
              {challenge.title}
            </li>
          ))}
        </ul>
      </div>
      <div className="bg-white mt-6 p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-xl font-bold text-pink-600 mb-4">Joined Challenges</h2>
        <ul>
          {joinedChallenges.map((challenge) => (
            <li key={challenge.id} className="text-pink-500 mb-2">
              {challenge.title}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
