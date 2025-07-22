"use client";
import { useContext, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";

export default function ProfilePage() {
    const { user, token } = useContext(AuthContext);
    const router = useRouter();

    //Protected
    useEffect(() => {
        if (!token) {
            router.push("/login");
        }
    }, [token]);

    return token ? (
        <>
          <Navbar />
            <div className="flex justify-center items-center min-h-[100vh] bg-white/60">
                <div className="bg-gray-800/50 p-6 rounded-lg shadow-lg max-w-sm w-full">
                    <h2 className="text-xl font-bold mb-4 text-center text-pink-800">Profile</h2>
                    <div className="bg-gray-900/70 p-4 rounded-md mb-2">
                        <p className="text-gray-400 text-sm ">Name:</p>
                        <p className="text-white">{user?.name}</p>
                    </div>
                    <div className="bg-gray-900/70 p-4 rounded-md">
                        <p className="text-gray-400 text-sm">Email:</p>
                        <p className="text-white">{user?.email}</p>
                    </div>
                </div>
            </div>
        </>
    ) : null;
}
