"use client";

import { useState, useEffect, useContext } from "react";
import { useRouter, useParams } from "next/navigation";
import axios from "axios";
import { AuthContext } from "@/context/AuthContext";

const EditItem = () => {
  const { id } = useParams();
  const { user, token } = useContext(AuthContext);
  const router = useRouter();

  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user?.role !== "admin") {
      router.push("/");
      return;
    }

    const fetchItem = async () => {
      try {
        const res = await axios.get(`http://localhost:4000/api/items/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setItem(res.data);
      } catch (err) {
        setError("Failed to fetch item data.");
      } finally {
        setLoading(false);
      }
    };

    fetchItem();
  }, [id, token, user, router]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setItem((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `http://localhost:4000/api/items/${id}`,
        {
          name: item.name,
          description: item.description,
          price: item.price,
          // Add other fields if needed
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Item updated successfully!");
      router.push("/manage-items");
    } catch (err) {
      alert("Failed to update item. Please try again.");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Edit Item</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <label>
          Name
          <input
            type="text"
            name="name"
            value={item.name || ""}
            onChange={handleChange}
            required
            className="border p-2 rounded w-full"
          />
        </label>
        <label>
          Description
          <textarea
            name="description"
            value={item.description || ""}
            onChange={handleChange}
            required
            className="border p-2 rounded w-full"
          />
        </label>
        <label>
          Price
          <input
            type="number"
            name="price"
            value={item.price || ""}
            onChange={handleChange}
            required
            className="border p-2 rounded w-full"
            min="0"
            step="0.01"
          />
        </label>
        <button
          type="submit"
          className="bg-black text-white py-2 rounded hover:bg-pink-800"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default EditItem;
