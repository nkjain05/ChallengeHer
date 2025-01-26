"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  doc,
  getDoc,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

export default function ChallengePage() {
  const { cid } = useParams();
  const [challenge, setChallenge] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [userMetricInput, setUserMetricInput] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChallengeAndParticipants = async () => {
      try {
        const challengeRef = doc(db, "challenges", cid);
        const challengeDoc = await getDoc(challengeRef);

        if (challengeDoc.exists()) {
          const challengeData = challengeDoc.data();
          setChallenge(challengeData);

          const user = auth.currentUser;
          if (user) {
            setCurrentUser({
              uid: user.uid,
            });

            // Fetch participants' names and sort by score
            const participantUIDs = challengeData.participant_list.map(
              (p) => p.uid
            );
            if (participantUIDs.length > 0) {
              const usersQuery = query(
                collection(db, "users"),
                where("__name__", "in", participantUIDs)
              );
              const usersSnapshot = await getDocs(usersQuery);

              const fetchedParticipants = challengeData.participant_list.map(
                (participant) => {
                  const userDoc = usersSnapshot.docs.find(
                    (doc) => doc.id === participant.uid
                  );
                  return {
                    ...participant,
                    name: userDoc?.data()?.name || "Unknown",
                  };
                }
              );
              // Sort by score in descending order
              fetchedParticipants.sort((a, b) => b.score - a.score);
              setParticipants(fetchedParticipants);
            } else {
              setParticipants([]);
            }
          }
        } else {
          console.error("Challenge not found!");
        }
      } catch (error) {
        console.error("Error fetching challenge data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchChallengeAndParticipants();
  }, [cid]);

  const updateScore = async () => {
    if (!currentUser || !challenge) return;

    const challengeRef = doc(db, "challenges", cid);

    const updatedParticipants = participants.map((p) =>
      p.uid === currentUser.uid ? { ...p, score: parseFloat(userMetricInput) } : p
    );

    await updateDoc(challengeRef, { participant_list: updatedParticipants });
    setParticipants(updatedParticipants.sort((a, b) => b.score - a.score)); // Sort updated list
  };

  const userInChallenge = participants.some((p) => p.uid === currentUser?.uid);

  if (loading) return <p className="text-center mt-6">Loading...</p>;

  return (
    <div className="min-h-screen flex flex-col items-center bg-pink-100">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md text-center">
        <h1 className="text-3xl font-bold text-pink-600 mb-4">{challenge.title}</h1>
        <p className="text-gray-700 mb-4">{challenge.description}</p>
        <p className="text-gray-700 font-bold mb-4">Metric: {challenge.metric}</p>
      </div>

      {userInChallenge && (
        <div className="bg-white mt-6 p-6 rounded-lg shadow-lg w-full max-w-md">
          <h2 className="text-xl font-bold text-pink-600 mb-4">Input Your {challenge.metric}</h2>
          <input
            type="number"
            value={userMetricInput}
            onChange={(e) => setUserMetricInput(e.target.value)}
            placeholder={`Enter your ${challenge.metric}`}
            className="border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-pink-500 text-black w-full mb-4"
          />
          <button
            onClick={updateScore}
            className="bg-pink-500 text-white py-2 px-6 rounded-md hover:bg-pink-600 transition duration-200 w-full"
          >
            Submit
          </button>
        </div>
      )}

      {!userInChallenge && (
        <div className="bg-white mt-6 p-6 rounded-lg shadow-lg w-full max-w-md">
          <p className="text-gray-500 text-center">
            You are not a participant in this challenge.
          </p>
        </div>
      )}

      <div className="bg-white mt-6 p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-xl font-bold text-pink-600 mb-4">Leaderboard</h2>
        {participants.length > 0 ? (
          <ol className="list-decimal pl-5 text-gray-700">
            {participants.map((participant, index) => (
              <li key={participant.uid || index} className="flex justify-between">
                <span>{participant.name}</span>
                <span>{participant.score}</span>
              </li>
            ))}
          </ol>
        ) : (
          <p className="text-gray-500">No participants yet.</p>
        )}
      </div>
    </div>
  );
}
