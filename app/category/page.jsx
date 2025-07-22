"use client";

import Navbar from "@/components/Navbar";
import { useEffect, useState } from "react";

export default function CategoryPage() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("http://localhost:4000/api/categories");
        const data = await res.json();

        if (Array.isArray(data.categories)) {
          setCategories(data.categories);
        } else {
          console.error("Unexpected response:", data);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  return (
    <>
      <Navbar />
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4 text-pink-800">🍴 Food Categories</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {categories.map((cat) => (
            <div key={cat._id} className="border p-4 rounded-lg shadow bg-white">
              <img
                src={cat.image || "/images/Background-1.jpg"} // fallback image
                alt={cat.title}
                className="w-full h-48 object-cover rounded mb-2"
              />
              <h2 className="text-lg font-semibold text-black">{cat.title}</h2>
              {/* Optional description if your model includes it */}
              {cat.description && (
                <p className="text-sm text-gray-700">{cat.description}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
