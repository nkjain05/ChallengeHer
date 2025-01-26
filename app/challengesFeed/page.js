"use client";

import { useEffect, useState } from "react";
import {
  collection,
  onSnapshot,
  query,
  orderBy,
  updateDoc,
  doc,
  getDoc,
} from "firebase/firestore";
import { db, auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function ChallengesFeed() {
  const [challenges, setChallenges] = useState([]);
  const [userUid, setUserUid] = useState("");
  const [userName, setUserName] = useState("");
  const router = useRouter();

  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged((user) => {
      if (user) {
        setUserUid(user.uid);
        setUserName(user.displayName || "User");
      } else {
        router.push("/login");
      }
    });

    const challengesQuery = query(
      collection(db, "challenges"),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(challengesQuery, (snapshot) => {
      const challengesData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setChallenges(challengesData);
    });

    return () => {
      unsubscribe();
      unsubscribeAuth();
    };
  }, [router]);

  const joinChallenge = async (challengeId) => {
    const challengeRef = doc(db, "challenges", challengeId);
    const userRef = doc(db, "users", userUid);

    try {
      const challengeDoc = await getDoc(challengeRef);
      if (challengeDoc.exists()) {
        const challengeData = challengeDoc.data();
        const alreadyJoined = challengeData.participant_list.some(
          (p) => p.uid === userUid
        );

        if (alreadyJoined) {
          return; // User has already joined
        }

        // Update challenge's participant_list
        await updateDoc(challengeRef, {
          participant_list: [
            ...challengeData.participant_list,
            { uid: userUid, name: userName, score: 0 },
          ],
        });

        // Update user's joinedChallenges in their profile
        const userDoc = await getDoc(userRef);
        if (userDoc.exists()) {
          const userData = userDoc.data();
          const updatedJoinedChallenges = [
            ...(userData.joinedChallenges || []),
            challengeId,
          ];
          await updateDoc(userRef, { joinedChallenges: updatedJoinedChallenges });
        }

        // Update state locally to reflect changes immediately
        setChallenges((prevChallenges) =>
          prevChallenges.map((challenge) =>
            challenge.id === challengeId
              ? {
                  ...challenge,
                  participant_list: [
                    ...challenge.participant_list,
                    { uid: userUid, name: userName, score: 0 },
                  ],
                }
              : challenge
          )
        );
      }
    } catch (error) {
      console.error("Error joining challenge:", error);
    }
  };

  return (
    <div className="min-h-screen p-6" style={{ backgroundColor: "#FEDEF1" }}>
      <h1 className="text-3xl font-bold text-center text-pink-600 mb-8">
        Challenges Feed
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {challenges.map((challenge) => {
          const joined = challenge.participant_list.some(
            (p) => p.uid === userUid
          );

          return (
            <div
              key={challenge.id}
              className="bg-white rounded-lg shadow-md p-4 text-center"
            >
              <Link
                href={`/challenges/${challenge.id}`}
                className="text-xl font-semibold text-pink-500 mb-2 hover:underline"
              >
                {challenge.title}
              </Link>
              <p className="text-gray-600 mb-4">{challenge.description}</p>
              <p className="text-gray-500 mb-4">
                Participants: {challenge.participant_list.length || 0}
              </p>
              <button
                onClick={() => joinChallenge(challenge.id)}
                disabled={joined}
                className={`${
                  joined ? "bg-gray-500" : "bg-pink-500"
                } text-white py-2 px-6 rounded-md transition duration-200 ${
                  joined ? "" : "hover:bg-pink-600"
                }`}
              >
                {joined ? "Joined" : "Join"}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
