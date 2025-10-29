"use client";
import React, { useState } from "react";

const CreatorAuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);

  // Common states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Signup-only states
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [profilePic, setProfilePic] = useState("");
  const [coverPic, setCoverPic] = useState("");
  const [razorpayId, setRazorpayId] = useState("");
  const [razorpaySecret, setRazorpaySecret] = useState("");

  // 👉 handle LOGIN
  const handleLogin = async (e) => {
    e.preventDefault();

    const res = await fetch("/api/creator/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (res.ok) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("creator", JSON.stringify(data.creator));
      window.location.href = `/creator/dashboard/${data.creator.id}`;
    } else {
      alert(data.error || "Login failed");
    }
  };

  // 👉 handle SIGNUP
  const handleSignup = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("bio", bio);
    formData.append("razorpayId", razorpayId);
    formData.append("razorpaySecret", razorpaySecret);

    if (profilePic) formData.append("profilePic", profilePic);
    if (coverPic) formData.append("coverPic", coverPic);

    const res = await fetch("/api/creator/signup", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();

    if (res.ok) {
      alert("Signup successful! Please login.");
      setIsLogin(true);
    } else {
      alert(data.error || "Signup failed");
    }
  };

  return (
    <main className="flex justify-center items-center min-h-[90vh] bg-gray-50 px-4 sm:px-6">
      <div className="bg-white p-6 sm:p-8 md:p-10 rounded-lg shadow-2xl w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-lg">
        {/* Toggle Login / Signup */}
        <div className="flex justify-center gap-6 sm:gap-8 mb-6">
          <button
            className={`px-3 sm:px-4 py-2 font-semibold ${
              isLogin ? "border-b-2 border-blue-600" : ""
            }`}
            onClick={() => setIsLogin(true)}
          >
            Login
          </button>
          <button
            className={`px-3 sm:px-4 py-2 font-semibold ${
              !isLogin ? "border-b-2 border-blue-600" : ""
            }`}
            onClick={() => setIsLogin(false)}
          >
            Signup
          </button>
        </div>

        {/* LOGIN FORM */}
        {isLogin && (
          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <input
              type="email"
              value={email}
              placeholder="Email"
              className="border p-2 rounded focus:ring-2 focus:ring-blue-400 text-sm sm:text-base"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              value={password}
              placeholder="Password"
              className="border p-2 rounded focus:ring-2 focus:ring-blue-400 text-sm sm:text-base"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="submit"
              className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700 text-sm sm:text-base"
            >
              Login as Creator
            </button>
          </form>
        )}

        {/* SIGNUP FORM */}
        {!isLogin && (
          <form onSubmit={handleSignup} className="flex flex-col gap-4">
            <input
              type="text"
              value={name}
              placeholder="Full Name / Display Name"
              className="border p-2 rounded text-sm sm:text-base"
              onChange={(e) => setName(e.target.value)}
              required
            />
            <input
              type="email"
              value={email}
              placeholder="Email"
              className="border p-2 rounded text-sm sm:text-base"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              value={password}
              placeholder="Password"
              className="border p-2 rounded text-sm sm:text-base"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <textarea
              value={bio}
              placeholder="Short Bio"
              className="border p-2 rounded text-sm sm:text-base"
              onChange={(e) => setBio(e.target.value)}
            />
            <label className="text-xs sm:text-sm">Profile Pic</label>
            <input
              type="text"
              placeholder="Profile Pic Link"
              className="border p-2 rounded text-sm sm:text-base"
              value={profilePic}
              onChange={(e) => setProfilePic(e.target.value)}
            />
            <label className="text-xs sm:text-sm">Cover Pic</label>
            <input
              type="text"
              placeholder="Cover Pic Link"
              className="border p-2 rounded text-sm sm:text-base"
              value={coverPic}
              onChange={(e) => setCoverPic(e.target.value)}
            />
            <input
              type="text"
              value={razorpayId}
              placeholder="Razorpay ID"
              className="border p-2 rounded text-sm sm:text-base"
              onChange={(e) => setRazorpayId(e.target.value)}
              required
            />
            <input
              type="text"
              value={razorpaySecret}
              placeholder="Razorpay Secret"
              className="border p-2 rounded text-sm sm:text-base"
              onChange={(e) => setRazorpaySecret(e.target.value)}
              required
            />
            <button
              type="submit"
              className="bg-green-600 text-white py-2 rounded hover:bg-green-700 text-sm sm:text-base"
            >
              Sign Up as Creator
            </button>
          </form>
        )}

        {/* Switch Link */}
        <p className="text-center mt-4 text-xs sm:text-sm text-gray-600">
          {isLogin ? "New to TipTap? " : "Already have an account? "}
          <span
            className="text-blue-600 cursor-pointer hover:underline"
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? "Sign Up" : "Login"}
          </span>
        </p>
      </div>
    </main>
  );
};

export default CreatorAuthPage;
