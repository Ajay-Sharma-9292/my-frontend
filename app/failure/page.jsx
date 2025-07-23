"use client";
import React from "react";
import { XCircle } from "lucide-react";
import { useRouter } from "next/navigation";

const FailurePage = () => {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-red-50 px-4 text-center">
      <XCircle className="text-red-600 w-24 h-24 mb-4" />
      <h1 className="text-3xl font-bold text-red-800 mb-2">Payment Failed</h1>
      <p className="text-lg text-gray-700 mb-6">
        Oops! Something went wrong during the payment process.
      </p>
      <button
        onClick={() => router.push("/orders")}
        className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
      >
        Try Again
      </button>
    </div>
  );
};

export default FailurePage;
