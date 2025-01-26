"use client";

import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "@/lib/firebase"; // Import Firestore
import { doc, setDoc } from "firebase/firestore"; // Firestore functions
import { useRouter } from "next/navigation"; // Import useRouter for navigation

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState(""); // New state for the user's name
  const router = useRouter(); // Create the router instance

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      // Create user in Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Save user data to Firestore
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        name: name, // Save the user's name
        email: user.email,
        photoURL: "/default-profile.png", // Placeholder for profile photo
        followers: [], // Initialize empty followers list
        following: [], // Initialize empty following list
        createdAt: new Date(),
      });

      alert("Account created successfully!");
      router.push("/login"); // Redirect to the login page after successful sign-up
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="min-h-screen bg-pink-100 flex justify-center items-center">
      <form
        onSubmit={handleSignup}
        className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md"
      >
        <h2 className="text-3xl font-bold text-center text-pink-600 mb-6">
          Sign Up
        </h2>
        <input
          type="text"
          placeholder="Name" // New input for the user's name
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 text-black"
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 text-black"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-2 mb-6 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 text-black"
        />
        <button
          type="submit"
          className="w-full py-2 px-4 bg-pink-500 text-white font-semibold rounded-md hover:bg-pink-600 transition duration-200"
        >
          Sign Up
        </button>
      </form>
    </div>
  );
}
