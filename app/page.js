"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function Home() {
  const [creators, setCreators] = useState([]);

  useEffect(() => {
    const fetchCreators = async () => {
      try {
        const res = await fetch("/api/creator/all");
        if (!res.ok) throw new Error("Failed to fetch creators");
        const data = await res.json();
        setCreators(data.creators.slice(0, 4));
      } catch (err) {
        console.error(err);
      }
    };

    fetchCreators();
  }, []);

  return (
    <>
      {/* Hero Section */}
      <main className="text-center bg-gradient-to-r from-blue-400 to-purple-400 text-white min-h-[60vh] flex flex-col items-center justify-center px-4">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-8 leading-snug">
          TipTap – Support Creators, Fuel Dreams
        </h1>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link href="/creator/login">
            <button className="bg-white text-blue-600 px-6 py-3 rounded-lg font-bold bg-gradient-to-r from-blue-100 to-blue-300 hover:border-blue-300 hover:ring-3 shadow-2xl w-full sm:w-auto">
              Join as Creator
            </button>
          </Link>
          <Link href="/support/login">
            <button className="bg-white text-purple-500 px-6 py-3 rounded-lg font-bold bg-gradient-to-r from-purple-100 to-purple-300 hover:border-purple-300 hover:ring-3 shadow-2xl w-full sm:w-auto">
              Support a Creator
            </button>
          </Link>
        </div>
      </main>

      {/* How It Works */}
      <section className="py-16 text-center px-4">
        <h1 className="text-3xl sm:text-4xl font-bold mb-12">How TipTap Works</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {[
            { step: "1. Discover", text: "Find amazing creators you want to support." },
            { step: "2. Support", text: "Choose a donation tier or custom amount." },
            { step: "3. Follow", text: "See updates and watch their ideas grow." },
          ].map((item, i) => (
            <div
              key={i}
              className="bg-white p-8 rounded-lg shadow-lg hover:shadow-2xl transition flex flex-col items-center justify-center h-[25vh] sm:h-[20vh]"
            >
              <h3 className="text-xl font-semibold mb-4">{item.step}</h3>
              <p className="text-gray-700">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Creators */}
      <section className="py-20 text-center px-4 max-w-6xl mx-auto">
        <h2 className="text-3xl sm:text-4xl font-bold mb-12">Featured Creators</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {creators.length > 0 ? (
            creators.map((creator) => (
              <div
                key={creator._id || creator.id}
                className="bg-white rounded-lg shadow-lg hover:shadow-2xl p-6 flex flex-col items-center justify-around transition"
              >
                <img
                  src={creator.profilePic || "/default-avatar.png"}
                  alt={creator.name}
                  className="w-24 h-24 rounded-full mb-4 object-cover"
                />
                <h3 className="text-xl font-semibold">{creator.name}</h3>
                <p className="text-gray-600 mb-4 text-center text-sm sm:text-base">
                  {creator.bio}
                </p>
                <Link href={"/support/login"}>
                  <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
                    Support
                  </button>
                </Link>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No creators found!</p>
          )}
        </div>
      </section>

      {/* Call to Action */}
      <section className="text-black text-center px-4 py-16">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6">
          Ready to make an impact?
        </h2>
        <p className="text-base sm:text-lg md:text-xl mb-8 max-w-3xl mx-auto">
          “TipTap makes it effortless to support creators, follow their journey, and see your contributions make a real difference.”
        </p>
      </section>
    </>
  );
}
