"use client";

import { useState } from "react";
import axios from "axios";


export default function Workout() {
  const [goal, setGoal] = useState("");
  const [workout, setWorkout] = useState("");
  const [error, setError] = useState("");

  const generateWorkout = async () => {
    setError("");
    setWorkout("");
    try {
      const response = await axios.post("/api/generate-workout", { goal });
      setWorkout(response.data.workout);
    } catch (err) {
      setError("Failed to generate workout. Please try again.");
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-pink-100 flex flex-col items-center justify-center p-4">
      <div className="bg-white shadow-lg rounded-lg p-6 max-w-md w-full">
        <h1 className="text-2xl font-bold text-gray-800 mb-4 text-center">
          AI Workout Generator
        </h1>
        <input
          type="text"
          className="w-full p-2 border border-gray-300 rounded-md mb-4 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter your fitness goal"
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
        />
        <button
          onClick={generateWorkout}
          className="w-full bg-pink-400 text-white font-bold py-2 px-4 rounded-md hover:bg-pink-500 transition duration-200"
        >
          Generate Workout
        </button>
        {error && (
          <p className="text-red-500 mt-4 text-sm">
            {error}
          </p>
        )}
        {workout && (
          <div className="mt-6 bg-gray-100 p-4 rounded-md shadow-inner">
            <h2 className="text-xl font-extrabold text-gray-800 mb-4">Your Workout Plan:</h2>
            <pre className="whitespace-pre-wrap text-gray-700">{workout}</pre>
          </div>
        )}
      </div>
    </div>
  );
}
