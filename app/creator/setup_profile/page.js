"use client";
import React, { useState } from "react";

const SetupProfile = () => {
  const [profilePic, setProfilePic] = useState(null);
  const [banner, setBanner] = useState(null);
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [website, setWebsite] = useState("");
  const [razorpayId, setRazorpayId] = useState("");
  const [razorpaySecret, setRazorpaySecret] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ name, bio, website, profilePic, banner });
    alert("Profile setup complete!");
  };

  return (
    <main className="min-h-[80vh] p-4 sm:p-6 md:p-8 bg-gray-50 flex justify-center items-center">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 sm:p-8 md:p-10 rounded-lg shadow-lg w-full max-w-md sm:max-w-lg md:max-w-2xl flex flex-col gap-5 sm:gap-6"
      >
        <h1 className="text-2xl sm:text-3xl font-bold text-center mb-2 sm:mb-4">
          Set Up Your Profile
        </h1>

        {/* Profile Picture */}
        <div>
          <label className="block font-medium mb-1 text-sm sm:text-base">
            Profile Picture
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setProfilePic(e.target.files[0])}
            className="border p-2 rounded w-full text-sm sm:text-base"
          />
        </div>

        {/* Banner Image */}
        <div>
          <label className="block font-medium mb-1 text-sm sm:text-base">
            Banner Image
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setBanner(e.target.files[0])}
            className="border p-2 rounded w-full text-sm sm:text-base"
          />
        </div>

        {/* Display Name */}
        <div>
          <label className="block font-medium mb-1 text-sm sm:text-base">
            Display Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your Name"
            className="border p-2 rounded w-full text-sm sm:text-base"
            required
          />
        </div>

        {/* Bio */}
        <div>
          <label className="block font-medium mb-1 text-sm sm:text-base">
            Bio
          </label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Tell supporters about yourself"
            className="border p-2 rounded w-full text-sm sm:text-base"
            rows={4}
          />
        </div>

        {/* Razorpay ID */}
        <div>
          <label className="block font-medium mb-1 text-sm sm:text-base">
            Razorpay ID
          </label>
          <input
            type="text"
            value={razorpayId}
            onChange={(e) => setRazorpayId(e.target.value)}
            placeholder="Your Razorpay ID"
            className="border p-2 rounded w-full text-sm sm:text-base"
          />
        </div>

        {/* Razorpay Secret */}
        <div>
          <label className="block font-medium mb-1 text-sm sm:text-base">
            Razorpay Secret
          </label>
          <input
            type="text"
            value={razorpaySecret}
            onChange={(e) => setRazorpaySecret(e.target.value)}
            placeholder="Your Razorpay Secret"
            className="border p-2 rounded w-full text-sm sm:text-base"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="bg-blue-600 text-white py-2 sm:py-3 rounded-lg font-semibold hover:bg-blue-700 transition text-sm sm:text-base"
        >
          Save Profile
        </button>
      </form>
    </main>
  );
};

export default SetupProfile;
