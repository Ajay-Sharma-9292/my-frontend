"use client";

import { useEffect, useContext } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AuthContext } from "@/context/AuthContext";
import AdminNav from "@/components/AdminNav";

const Dashboard = () => {
  const router = useRouter();
  const { user, token } = useContext(AuthContext);

  const isAdmin = user?.role === "admin" || user?.isAdmin === true;

  useEffect(() => {
    if (!token || !isAdmin) {
      router.push("/");
    }
  }, [token, isAdmin, router]);

  if (!user) return <p className="text-center mt-10">Loading...</p>;
  if (!isAdmin) return null;

  return (
    <>
      <AdminNav />
      <div className="min-h-screen px-6 pt-20 bg-gray-100/40">
        <h1 className="text-3xl font-bold mb-6 text-pink-800">Admin Dashboard</h1>

        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">

          <Link href="/add-category">
            <div className="cursor-pointer bg-white shadow-md rounded-2xl p-6 hover:shadow-xl transition">
              <h2 className="text-xl font-semibold">Add Category</h2>
              <p className="text-gray-600 mt-2">Create a new food category.</p>
            </div>
          </Link>

          <Link href="/add-item">
            <div className="cursor-pointer bg-white shadow-md rounded-2xl p-6 hover:shadow-xl transition">
              <h2 className="text-xl font-semibold">Add Item</h2>
              <p className="text-gray-600 mt-2">Add a new item to a category.</p>
            </div>
          </Link>

          <Link href="/manage-items">
            <div className="cursor-pointer bg-white shadow-md rounded-2xl p-6 hover:shadow-xl transition">
              <h2 className="text-xl font-semibold">Manage Items</h2>
              <p className="text-gray-600 mt-2">Edit or delete existing items.</p>
            </div>
          </Link>

           <Link href="/manage-categories">
            <div className="cursor-pointer bg-white shadow-md rounded-2xl p-6 hover:shadow-xl transition">
              <h2 className="text-xl font-semibold">Manage Category</h2>
              <p className="text-gray-600 mt-2">Edit or delete existing categories</p>
            </div>
          </Link>

        </div>
      </div>
    </>
  );
};

export default Dashboard;
