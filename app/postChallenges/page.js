"use client";

import { useState, useEffect } from "react";
import { addDoc, collection, Timestamp } from "firebase/firestore";
import { db, auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";

export default function PostChallenge() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [metric, setMetric] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [userUid, setUserUid] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      setUserUid(currentUser.uid);
    } else {
      setError("User not logged in.");
      router.push("/login");
    }
    setLoading(false);
  }, [router]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !description || !metric) {
      setError("All fields are required.");
      return;
    }

    try {
      await addDoc(collection(db, "challenges"), {
        title,
        description,
        metric,
        participants: 0, // Creator is NOT auto-joined
        participant_list: [], // Empty list on creation
        createdAt: Timestamp.fromDate(new Date()),
        createdBy: userUid,
      });

      setTitle("");
      setDescription("");
      setMetric("");
      setError("");
      setSuccess("Challenge posted successfully!");

      router.push("/challengesFeed");
    } catch (err) {
      console.error("Error posting challenge:", err);
      setError("Failed to post challenge. Try again later.");
    }
  };

  if (loading) return <p className="text-center mt-6">Loading...</p>;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <h1 className="text-2xl font-bold mb-6 text-pink-500">Post a Challenge</h1>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 bg-white p-6 rounded-lg shadow-md w-full max-w-md"
      >
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Challenge Title"
          className="border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-pink-500 text-black"
          required
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Challenge Description"
          rows="4"
          className="border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-pink-500 text-black"
          required
        ></textarea>
        <select
          value={metric}
          onChange={(e) => setMetric(e.target.value)}
          className="border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-pink-500 text-black"
          required
        >
          <option value="" disabled>
            Select Metric
          </option>
          <option value="distance">Distance</option>
          <option value="time">Time</option>
          <option value="steps">Steps</option>
          <option value="calories">Calories Burned</option>
        </select>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        {success && <p className="text-green-500 text-sm">{success}</p>}
        <button
          type="submit"
          className="bg-pink-500 text-white py-3 px-6 rounded-lg hover:bg-pink-600 transition duration-200"
        >
          Post Challenge
        </button>
      </form>
    </div>
  );
}
