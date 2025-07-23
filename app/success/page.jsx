"use client";
import React from "react";
import { CheckCircle } from "lucide-react";
import { useRouter } from "next/navigation";

const SuccessPage = () => {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-green-50 px-4 text-center">
      <CheckCircle className="text-green-600 w-24 h-24 mb-4" />
      <h1 className="text-3xl font-bold text-green-800 mb-2">Payment Successful!</h1>
      <p className="text-lg text-gray-700 mb-6">
        Thank you for your order. Your food will be delivered shortly.
      </p>
      <button
        onClick={() => router.push("/")}
        className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
      >
        Go to Home
      </button>
    </div>
  );
};

export default SuccessPage;
