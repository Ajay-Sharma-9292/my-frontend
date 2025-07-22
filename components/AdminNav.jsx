"use client";
import { useContext } from "react";
import Link from "next/link";
import { AuthContext } from "../context/AuthContext";

export default function AdminNav() {
  const { logout, token } = useContext(AuthContext);

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-white/60 bg-opacity-90 backdrop-blur-md text-black px-6 py-4 shadow-md">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link href="/">
          <h1 className="text-xl font-bold text-pink-800">Apna Khana</h1>
        </Link>

        {token && (
          <div className="flex gap-6 items-center">
            <Link href="/dashboard" className="hover:text-pink-800">Dashboard</Link>
            <button
              onClick={logout}
              className="bg-black text-white hover:bg-pink-800 px-3 py-1 rounded-xl"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
