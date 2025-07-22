"use client";

import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useRouter } from "next/navigation";
import axios from "axios";
import Navbar from "@/components/Navbar";
import AdminNav from "@/components/AdminNav";
import CategoryCard from "@/components/CategoryCard";

export default function HomePage() {
  const { token, user } = useContext(AuthContext);
  const router = useRouter();
  const [categories, setCategories] = useState([]);
  const [itemsMap, setItemsMap] = useState({});

  useEffect(() => {
    if (!token) {
      router.push("/login");
      return;
    }

    const fetchData = async () => {
      try {
        // Fetch categories and items concurrently
        const [catRes, itemRes] = await Promise.all([
          axios.get("http://localhost:4000/api/categories"),
          axios.get("http://localhost:4000/api/items"),
        ]);

        // Normalize categories data
        const fetchedCats = Array.isArray(catRes.data.categories)
          ? catRes.data.categories
          : Array.isArray(catRes.data)
          ? catRes.data
          : [];

        // Normalize items data
        const fetchedItems = Array.isArray(itemRes.data.items)
          ? itemRes.data.items
          : Array.isArray(itemRes.data)
          ? itemRes.data
          : [];

        // Group items by category id
        const groupedItems = {};
        fetchedCats.forEach((cat) => {
          groupedItems[cat._id] = [];
        });

        fetchedItems.forEach((item) => {
          // item.category could be populated or just ID
          const catId = item.category?._id || item.category;
          if (groupedItems[catId]) {
            groupedItems[catId].push(item);
          }
        });

        setCategories(fetchedCats);
        setItemsMap(groupedItems);
      } catch (err) {
        console.error("Error loading data", err);
      }
    };

    fetchData();
  }, [token, router]);

  const isAdmin = user?.role === "admin";

  if (!token) {
    return <p className="text-center mt-10">Loading...</p>;
  }

  return (
    <div className="w-full bg-white/30 text-black min-h-screen pb-10">
      {isAdmin ? <AdminNav /> : <Navbar />}
      <div className="pt-[60px]">
        {categories.map((cat) => (
          <CategoryCard
            key={cat._id}
            title={cat.title}
            items={itemsMap[cat._id] || []}
          />
        ))}
      </div>
    </div>
  );
}
