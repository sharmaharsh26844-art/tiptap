"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";

export default function Explore() {
  const [creators, setCreators] = useState([]);

  useEffect(() => {
    async function fetchCreators() {
      try {
        const res = await fetch("/api/creator/getall");
        const data = await res.json();
        if (res.ok) setCreators(data.creators);
      } catch (err) {
        console.error("Error fetching creators:", err);
      }
    }
    fetchCreators();
  }, []);

  return (
    <main className="min-h-screen py-6 sm:py-10 px-3 sm:px-6 md:px-10 bg-gray-50">
      {/* Globe with Centered Text */}
      <div className="flex flex-col sm:flex-row justify-center items-center mb-8 sm:mb-12 gap-4">
        <img
          src="/globe.gif"
          alt="globe"
          className="w-20 h-20 sm:w-24 sm:h-24"
        />
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center text-black">
          Explore Creators
        </h1>
      </div>

      {/* Creator Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto">
        {creators.map((creator) => (
          <div
            key={creator._id}
            className="bg-white rounded-lg shadow-lg hover:shadow-2xl transition p-4 sm:p-5 flex flex-col justify-between"
          >
            {/* Cover + Profile */}
            <div className="relative">
              <img
                src={creator.coverPic || "/default-cover.jpg"}
                alt="cover"
                className="w-full h-32 sm:h-36 md:h-40 object-cover rounded-t-lg"
              />
              <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2">
                <img
                  src={creator.profilePic || "/default-profile.jpg"}
                  alt="profile"
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-4 border-white shadow"
                />
              </div>
            </div>

            {/* Info */}
            <div className="mt-12 text-center px-2">
              <h2 className="text-lg sm:text-xl font-semibold truncate">
                {creator.name}
              </h2>
              <p className="text-gray-600 text-sm mt-2 line-clamp-2">
                {creator.bio}
              </p>

              <Link href={`/support/${creator._id}`}>
                <button className="mt-4 w-full sm:w-auto text-white bg-gradient-to-r from-cyan-500 via-cyan-600 to-cyan-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-cyan-400 font-medium rounded-lg text-sm px-5 py-2.5 text-center">
                  Support
                </button>
              </Link>
            </div>
          </div>
        ))}

        {/* Handle empty state gracefully */}
        {creators.length === 0 && (
          <p className="col-span-full text-center text-gray-500 text-sm sm:text-base">
            No creators found at the moment.
          </p>
        )}
      </div>
    </main>
  );
}
