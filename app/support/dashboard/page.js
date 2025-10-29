"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";

export default function SupporterDashboard() {
  const [supporter, setSupporter] = useState(null);
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("supporter");
    if (stored) setSupporter(JSON.parse(stored));
  }, []);

  useEffect(() => {
    if (!supporter?._id) return;

    const fetchDonations = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/supporter/${supporter._id}/donations`);
        const data = await res.json();

        if (!res.ok) throw new Error(data.error || "Failed to fetch donations");

        const formatted = (data.donations || []).map((d) => ({
          ...d,
          creatorName: d.creatorId?.name || d.creatorName || "Unknown Creator",
          date: d.date || d.createdAt || new Date().toISOString(),
        }));

        setDonations(formatted.reverse());
      } catch (err) {
        console.error("Error fetching supporter donations:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDonations();
  }, [supporter?._id]);

  if (!supporter) {
    return (
      <main className="flex flex-col items-center justify-center min-h-[80vh] bg-gray-50 p-4 text-center">
        <p className="text-red-500 text-lg mb-4">
          You must be logged in to view your dashboard.
        </p>
        <Link href="/support/login">
          <button className="bg-blue-600 text-white px-5 py-2 rounded text-sm sm:text-base">
            Go to Login
          </button>
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-[80vh] p-4 sm:p-6 md:p-8">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-center sm:text-left">
        Welcome, {supporter.name}!
      </h1>

      {/* Explore Creators */}
      <section className="bg-white p-4 sm:p-6 rounded-lg shadow-lg hover:shadow-2xl mb-6 transition-all duration-300">
        <h2 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4 text-center sm:text-left">
          Explore Creators
        </h2>
        <p className="text-gray-600 mb-4 text-sm sm:text-base text-center sm:text-left">
          Discover creators to support and follow their journey.
        </p>
        <div className="flex justify-center sm:justify-start">
          <Link href="/support/explore">
            <button className="bg-blue-600 text-white px-5 py-2 rounded text-sm sm:text-base hover:bg-blue-700">
              Explore
            </button>
          </Link>
        </div>
      </section>

      {/* Past Donations */}
      <section className="bg-white p-4 sm:p-6 rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300">
        <h2 className="text-xl sm:text-2xl font-semibold mb-1 text-center sm:text-left">
          Past Donations
        </h2>
        <p className="text-gray-600 text-sm sm:text-base text-center sm:text-left">
          See all the creators you’ve supported so far.
        </p>

        <div className="overflow-y-auto max-h-[28rem] mt-5 bg-blue-50 p-3 rounded-lg">
          {loading ? (
            <p className="text-gray-500 text-center py-4 text-sm sm:text-base">
              Loading donations...
            </p>
          ) : donations.length > 0 ? (
            donations.map((donation) => (
              <div
                key={donation._id || donation.paymentId}
                className="p-3 border-b border-gray-200 text-left text-sm sm:text-base"
              >
                <p className="font-medium text-lg">
                  You donated ₹{donation.amount} to {donation.creatorName}
                </p>
                <p className="text-gray-500 text-sm">
                  {donation.message || "No message left"}
                </p>
                <p className="text-gray-400 text-xs">
                  {new Date(donation.date).toLocaleString()}
                </p>
              </div>
            ))
          ) : (
            <p className="text-gray-500 mt-2 text-center text-sm sm:text-base">
              You haven’t supported any creators yet!
            </p>
          )}
        </div>
      </section>
    </main>
  );
}
