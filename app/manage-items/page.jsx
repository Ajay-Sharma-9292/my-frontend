"use client";

import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { AuthContext } from "@/context/AuthContext";

const ManageItems = () => {
  const [items, setItems] = useState([]); 
  const [loading, setLoading] = useState(true);
  const { user, token } = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await axios.get("http://localhost:4000/api/items", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setItems(res.data.items || []); 
      } catch (error) {
        console.error("Error fetching items:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user?.role === "admin") {
      fetchItems();
    } else {
      router.push("/");
    }
  }, [token, user, router]);

  if (loading) {
    return <p className="text-center mt-10">Loading...</p>;
  }

  return (
    <>
    <button
          onClick={() => router.push("/dashboard")}
          className="mb-4 text-xl bg-black text-white px-4 py-1 rounded-4xl  font-bold hover:bg-pink-800"
        >
          ← Back to Dashboard
        </button>
      <div className="max-w-5xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4 text-center">🧾 Manage Items</h1>
        {items.length === 0 ? (
          <p className="text-center">No items found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item) => (
              <div key={item._id} className="bg-white p-4 rounded shadow">
                <h2 className="text-lg font-semibold">{item.name}</h2>
                <p className="text-sm text-gray-600">{item.description}</p>
                <p className="mt-1 font-bold">₹{item.price}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default ManageItems;
