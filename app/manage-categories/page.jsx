"use client";

import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { AuthContext } from "@/context/AuthContext";
import { toast } from "react-toastify";

const ManageCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, token } = useContext(AuthContext);
  const router = useRouter();

  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:4000/api/categories", {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Categories API response:", res.data);

      if (Array.isArray(res.data)) {
        setCategories(res.data);
      } else if (Array.isArray(res.data.categories)) {
        setCategories(res.data.categories);
      } else {
        setCategories([]);
        toast.error("Unexpected response structure from categories API.");
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error("Failed to load categories.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.role === "admin") {
      fetchCategories();
    } else {
      router.push("/");
    }
  }, [token, user, router]);

  const confirmDelete = (category) => {
    setCategoryToDelete(category);
    setShowDeletePopup(true);
  };

  const cancelDelete = () => {
    setCategoryToDelete(null);
    setShowDeletePopup(false);
  };

  const handleDelete = async () => {
    if (!categoryToDelete) return;

    try {
      await axios.delete(
        `http://localhost:4000/api/categories/${categoryToDelete._id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("Category deleted successfully.");
      setShowDeletePopup(false);
      setCategoryToDelete(null);
      fetchCategories();
    } catch (error) {
      console.error("Delete category error:", error);
      toast.error(
        error.response?.data?.message || "Failed to delete category."
      );
      setShowDeletePopup(false);
      setCategoryToDelete(null);
    }
  };

  if (loading) {
    return <p className="text-center mt-10 text-lg font-semibold">Loading...</p>;
  }

  return (
    <>
      <button
        onClick={() => router.push("/dashboard")}
        className="mb-4 text-xl bg-black text-white px-4 py-1 rounded-4xl font-bold hover:bg-pink-800"
      >
        ← Back to Dashboard
      </button>

      <div className="max-w-5xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4 text-center">📁 Manage Categories</h1>
        {categories.length === 0 ? (
          <p className="text-center">No categories found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => (
              <div
                key={category._id}
                className="bg-white p-4 rounded shadow relative"
              >
                <h2 className="text-lg font-semibold">{category.title}</h2>
                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() =>
                      router.push(`/manage-categories/edit/${category._id}`)
                    }
                    className="bg-blue-400 hover:bg-blue-700 text-black px-3 py-1 rounded-2xl"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => confirmDelete(category)}
                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-2xl"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showDeletePopup && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-white/50 bg-opacity-50 z-50"
          onClick={cancelDelete}
        >
          <div
            className="bg-white rounded p-6 w-80 text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="mb-4 text-lg font-semibold">
              Are you sure you want to delete <br />
              <span className="text-red-600">{categoryToDelete?.title}</span>?
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={handleDelete}
                className="bg-red-600 hover:bg-red-700 text-white px-5 py-1 rounded-2xl"
              >
                Yes
              </button>
              <button
                onClick={cancelDelete}
                className="bg-gray-300 hover:bg-gray-400 text-black px-5 py-1 rounded-2xl"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ManageCategories;
