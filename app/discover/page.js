"use client";

import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase"; // Firebase config
import { useRouter } from "next/navigation";

export default function DiscoverUsers() {
  const [users, setUsers] = useState([]);
  const router = useRouter();

  // Fetch users from Firestore
  useEffect(() => {
    const fetchUsers = async () => {
      const querySnapshot = await getDocs(collection(db, "users"));
      const fetchedUsers = [];
      querySnapshot.forEach((doc) => {
        fetchedUsers.push({ id: doc.id, ...doc.data() });
      });
      setUsers(fetchedUsers);
    };

    fetchUsers();
  }, []);

  return (
    <div className="min-h-screen bg-pink-100 p-6">
      <h1 className="text-3xl font-bold text-center text-pink-600 mb-6">
        Discover Users
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {users.map((user) => (
          <div
            key={user.id}
            className="bg-white p-4 rounded-lg shadow-lg text-center"
            onClick={() => router.push(`/profile/${user.id}`)} // Navigate to profile
            style={{ cursor: "pointer" }}
          >
            <h2 className="text-xl font-bold text-pink-600">{user.name}</h2>
            <p className="text-gray-600">{user.email}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
