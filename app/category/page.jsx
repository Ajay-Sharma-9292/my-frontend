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

        if (Array.isArray(data)) {
          setCategories(data);
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
      <div className="p-6 min-h-screen bg-white/90">
        <h1 className="text-2xl font-bold mb-6 text-pink-800 text-center">
          🍽️ Food Categories & Items
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {categories.map((cat) => (
            <div
              key={cat._id}
              className="border p-4 rounded-lg shadow bg-white hover:shadow-md transition"
            >
              <img
                src={cat.image || "/images/Background-1.jpg"}
                alt={cat.title}
                className="w-full h-48 object-cover rounded mb-3"
              />
              <h2 className="text-xl font-semibold text-black mb-1">
                {cat.title}
              </h2>
              {cat.description && (
                <p className="text-sm text-gray-600 mb-2">{cat.description}</p>
              )}

              {Array.isArray(cat.items) && cat.items.length > 0 ? (
                <div>
                  <h3 className="text-pink-700 font-medium mb-1">Items:</h3>
                  <ul className="list-disc pl-4 text-sm text-gray-800">
                    {cat.items.map((item) => (
                      <li key={item._id} className="mb-1">
                        <span className="font-medium">{item.name}</span>
                        {item.price && (
                          <span className="text-gray-500"> - ₹{item.price}</span>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <p className="text-gray-400 italic">No items added yet</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
