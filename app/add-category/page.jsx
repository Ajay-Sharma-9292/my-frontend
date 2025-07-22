"use client";

import { useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

const AddCategoryPage = () => {
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const { token, user } = useContext(AuthContext);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title) {
      toast.error("Title is required");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post(
        "http://localhost:4000/api/categories",
        { title },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Category created successfully!");
      setTitle("");
      router.push("/dashboard");
    } catch (err) {
      console.error(err);
      toast.error("Error creating category");
    } finally {
      setLoading(false);
    }
  };

  if (user?.role !== "admin") {
    return <p className="text-center mt-10 text-red-600">Access Denied</p>;
  }

  return (
    <>
      <button
        onClick={() => router.push("/dashboard")}
        className="mb-4 text-xl bg-black text-white px-4 py-1 rounded-4xl font-bold hover:bg-pink-800"
      >
        ← Back to Dashboard
      </button>
      <div className="max-w-md mx-auto p-6 bg-white/60 rounded-md">
        <h1 className="text-2xl font-bold mb-4 text-pink-800 text-center">Add New Category</h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Category Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="border p-2 rounded"
          />
          <button
            type="submit"
            disabled={loading}
            className="text-white py-2 px-4 rounded bg-black hover:bg-pink-800 disabled:opacity-50"
          >
            {loading ? "Creating..." : "Create Category"}
          </button>
        </form>
      </div>
    </>
  );
};

export default AddCategoryPage;
