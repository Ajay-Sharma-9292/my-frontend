"use client";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useRouter } from "next/navigation";
import axios from "axios";
import Link from "next/link";

export default function SignupPage() {
  const { login, token } = useContext(AuthContext);
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");

  useEffect(() => {
    if (token) {
      router.push("/");
    }
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { name, email, password } = form;
    if (!name || !email || !password || password.trim() === "") {
      setError("All fields including password are required.");
      return;
    }

    try {
      const res = await axios.post("http://localhost:4000/api/auth/register", form);
      login(res.data.token, res.data.user);
    } catch (err) {
      setError(err.response?.data?.error || "Signup failed");
    }
  };

  return (
    <div className="w-full h-screen bg-cover bg-center">
  <div className="rounded-md p-5 w-[30vw] h-[50vh] flex flex-col justify-center items-center mx-auto mt-10 bg-white/60">
    <h2 className="text-2xl font-bold mb-4 text-pink-800">Signup</h2>
    {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
    <div className="w-full">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          className="p-2 bg-gray-800 text-white"
          placeholder="Name"
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <input
          className="p-2 bg-gray-800 text-white"
          placeholder="Email"
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <input
          className="p-2 bg-gray-800 text-white"
          type="password"
          placeholder="Password"
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        <button className="bg-gray-700 rounded-xl hover:bg-pink-800 p-2 text-white">
          Signup
        </button>
      </form>
      <p className="mt-4 text-black">
        Already have an account?{" "}
        <Link href="/login" className="text-black hover:text-pink-800">Login</Link>
      </p>
    </div>
  </div>
</div>


  );
}
