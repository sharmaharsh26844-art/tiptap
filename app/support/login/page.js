"use client";
import React, { useState } from "react";

const SupporterAuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [profilePic, setProfilePic] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) return alert("Email and password are required");

    try {
      const res = await fetch("/api/supporter/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("supporter", JSON.stringify(data.supporter));

        if (data.supporter.mustChangePassword) {
          window.location.href = "/support/change-password";
          return;
        }

        window.location.href = "/support/dashboard";
      } else {
        alert(data.error || "Login failed");
      }
    } catch (err) {
      console.error("Login failed:", err);
      alert("Login failed. Try again.");
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!name || !email || !password)
      return alert("All fields except profile picture are required");

    try {
      const res = await fetch("/api/supporter/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, profilePic }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Signup successful! Please login.");
        setIsLogin(true);
      } else {
        alert(data.error || "Signup failed");
      }
    } catch (err) {
      console.error("Signup failed:", err);
      alert("Signup failed. Try again.");
    }
  };

  return (
    <main className="flex justify-center items-center min-h-screen bg-gradient-to-r from-blue-400 to-purple-400 px-4 sm:px-6 md:px-0">
      <div className="bg-white p-6 sm:p-8 md:p-10 rounded-lg shadow-2xl w-full max-w-sm sm:max-w-md">
        {/* Tabs */}
        <div className="flex justify-center gap-6 mb-6 text-sm sm:text-base">
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

        {/* Forms */}
        {isLogin ? (
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
              className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition text-sm sm:text-base"
            >
              Login
            </button>
          </form>
        ) : (
          <form onSubmit={handleSignup} className="flex flex-col gap-4">
            <input
              type="text"
              value={name}
              placeholder="Full Name"
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
            <label className="text-xs sm:text-sm">Profile Picture (optional)</label>
            <input
              type="text"
              placeholder="Profile Pic URL"
              value={profilePic}
              onChange={(e) => setProfilePic(e.target.value)}
              className="border p-2 rounded w-full text-sm sm:text-base"
            />
            <button
              type="submit"
              className="bg-green-600 text-white py-2 rounded hover:bg-green-700 transition text-sm sm:text-base"
            >
              Sign Up
            </button>
          </form>
        )}

        {/* Toggle between login/signup */}
        <p className="text-center mt-4 text-xs sm:text-sm text-gray-600">
          {isLogin ? "New to TipTap? " : "Already have an account? "}
          <span
            className="text-blue-600 cursor-pointer"
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? "Sign Up" : "Login"}
          </span>
        </p>
      </div>
    </main>
  );
};

export default SupporterAuthPage;
