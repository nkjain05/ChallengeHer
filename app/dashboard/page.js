"use client";

import { useState, useEffect } from "react";
import { auth, db } from "@/lib/firebase"; // Firebase auth and Firestore setup
import { signOut } from "firebase/auth"; // Firebase sign-out function
import { doc, getDoc } from "firebase/firestore"; // Firestore functions
import { useRouter } from "next/navigation"; // To handle page redirection

export default function DashboardPage() {
  const [userName, setUserName] = useState(""); // To store the user's name
  const router = useRouter();

  // Fetch the user's name from Firestore
  useEffect(() => {
    const fetchUserName = async () => {
      const currentUser = auth.currentUser;
      if (currentUser) {
        try {
          // Get the user's document from the Firestore "users" collection
          const userDocRef = doc(db, "users", currentUser.uid);
          const userDoc = await getDoc(userDocRef);

          if (userDoc.exists()) {
            setUserName(userDoc.data().name || "User");
          } else {
            setUserName("User"); // Default name if no user document found
          }
        } catch (error) {
          console.error("Error fetching user name:", error);
        }
      } else {
        router.push("/login"); // Redirect to login page if not authenticated
      }
    };

    fetchUserName();
  }, [router]);

  // Handle sign out and redirect to home
  const handleSignOut = async () => {
    try {
      await signOut(auth);
      router.push("/home"); // Redirect to the home page after sign out
    } catch (error) {
      alert(error.message);
    }
  };

  // Handle Create Challenge
  const handleCreateChallenge = () => {
    router.push("/postChallenges"); // Redirect to the Create Challenge page
  };

  // Handle Join Challenge
  const handleJoinChallenge = () => {
    router.push("/challengesFeed"); // Redirect to the Join Challenge page
  };

  // Handle My Profile
  const handleMyProfile = () => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      router.push(`/profile/${currentUser.uid}`); // Use dynamic routing with backticks
    } else {
      alert("User not authenticated");
    }
  };

  // Handle Discover Users
  const handleDiscover = () => {
    router.push("/discover"); // Redirect to the Discover Users page
  };

  return (
    <div className="min-h-screen bg-pink-100 flex justify-center items-center">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md text-center">
        <h1 className="text-3xl font-bold text-pink-600 mb-6">
          Welcome, {userName}
        </h1>
        <div className="flex flex-col gap-4">
          <button
            onClick={handleCreateChallenge}
            className="bg-pink-400 text-white py-2 px-4 rounded-md hover:bg-pink-500 transition duration-200"
          >
            Create a Challenge
          </button>
          <button
            onClick={handleMyProfile}
            className="bg-pink-400 text-white py-2 px-4 rounded-md hover:bg-pink-500 transition duration-200"
          >
            My Profile
          </button>
          <button
            onClick={handleJoinChallenge}
            className="bg-pink-400 text-white py-2 px-4 rounded-md hover:bg-pink-500 transition duration-200"
          >
            Join a Challenge
          </button>
          <button
            onClick={handleDiscover}
            className="bg-pink-400 text-white py-2 px-4 rounded-md hover:bg-pink-500 transition duration-200"
          >
            Discover Users
          </button>
          <a
            href="/workout"
            className="bg-pink-400 text-white py-2 px-4 rounded-md hover:bg-pink-500 transition duration-200"
          >
            Generate Workout
          </a>
          <button
            onClick={handleSignOut}
            className="bg-gray-400 text-white py-2 px-4 rounded-md hover:bg-gray-600 transition duration-200"
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}
