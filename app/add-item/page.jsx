"use client";

import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

const AddItemPage = () => {
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [price, setPrice] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [image, setImage] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  const { token, user } = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    if (!user || user.role !== "admin") {
      router.push("/");
      return;
    }

    const fetchCategories = async () => {
      try {
        const res = await axios.get("http://localhost:4000/api/categories");
        const cats = Array.isArray(res.data)
          ? res.data
          : res.data.categories || [];

        setCategories(cats);
      } catch (err) {
        console.error("Error fetching categories:", err);
        toast.error("Failed to fetch categories");
      }
    };

    fetchCategories();
  }, [user, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !desc || !price || !categoryId || !image) {
      toast.error("All fields are required");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", desc);
    formData.append("price", price);
    formData.append("categoryId", categoryId);
    formData.append("image", image);

    try {
      setLoading(true);
      await axios.post("http://localhost:4000/api/items", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success(" Item created successfully!");
      router.push("/dashboard");
    } catch (err) {
      console.error("Error creating item:", err);
      toast.error(" Failed to create item");
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return <p className="text-center mt-10">Loading user info...</p>;
  }

  return (
    <>
      <button
        onClick={() => router.push("/dashboard")}
        className="mb-4 text-xl bg-black text-white px-4 py-1 rounded-4xl font-bold hover:bg-pink-800"
      >
        ← Back to Dashboard
      </button>
      <div className="max-w-xl mx-auto p-6 bg-white/60 rounded-md">
        <h1 className="text-2xl font-bold mb-4 text-center">🍽️ Add New Item</h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Item Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border p-2 rounded"
          />
          <textarea
            placeholder="Description"
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            className="border p-2 rounded"
          />
          <input
            type="number"
            placeholder="Price (₹)"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="border p-2 rounded"
          />
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="border p-2 rounded"
          >
            <option value="">-- Select Category --</option>
            {categories.length > 0 ? (
              categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.title}
                </option>
              ))
            ) : (
              <option disabled>Loading categories...</option>
            )}
          </select>
          <input
            type="file"
            onChange={(e) => setImage(e.target.files[0])}
            accept="image/*"
            className="border p-2 rounded"
          />
          <button
            type="submit"
            disabled={loading}
            className="text-white py-2 px-4 rounded bg-black hover:bg-pink-800 disabled:opacity-50"
          >
            {loading ? "Creating..." : "Create Item"}
          </button>
        </form>
      </div>
    </>
  );
};

export default AddItemPage;
