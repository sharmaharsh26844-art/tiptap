"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function CreatorDashboard() {
  const params = useParams();
  const creatorId = params.id;

  const [creator, setCreator] = useState(null);
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!creatorId) return;

    const fetchData = async () => {
      try {
        const resCreator = await fetch(`/api/creator/${creatorId}`);
        const dataCreator = await resCreator.json();

        if (!resCreator.ok) throw new Error(dataCreator.error || "Creator not found");
        setCreator(dataCreator.creator);

        const resDonations = await fetch(`/api/creator/${creatorId}/donations`);
        const dataDonations = await resDonations.json();

        if (resDonations.ok) setDonations(dataDonations.donations || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [creatorId]);

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (!creator) return <p className="text-center mt-10">Creator not found.</p>;

  return (
    <main className="min-h-screen p-4 sm:p-6 lg:p-10 bg-gray-50">
      {/* Cover & Profile Section */}
      <div className="relative w-full">
        <img
          className="w-full h-[35vh] sm:h-[45vh] lg:h-[50vh] object-cover rounded-lg"
          src={creator.coverPic}
          alt="Cover"
        />
        <div className="absolute -bottom-14 sm:-bottom-16 left-1/2 transform -translate-x-1/2">
          <img
            src={creator.profilePic}
            alt="Profile"
            className="w-24 h-24 sm:w-28 sm:h-28 lg:w-32 lg:h-32 rounded-full border-4 border-white shadow-lg"
          />
        </div>
      </div>

      {/* Creator Info */}
      <div className="mt-20 text-center px-2">
        <h1 className="text-2xl sm:text-3xl font-bold">{creator.name}</h1>
        <p className="text-gray-600 text-sm sm:text-base mt-1">{creator.bio}</p>
      </div>

      {/* Donation Analytics */}
      <section className="bg-white p-4 sm:p-6 rounded-xl shadow-lg hover:shadow-2xl mt-10 w-full max-w-3xl mx-auto">
        <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-center sm:text-left">
          Donation Analytics
        </h2>

        <div className="overflow-y-auto max-h-80 bg-blue-50 p-3 rounded-lg">
          {donations.length > 0 ? (
            donations.map((d, idx) => (
              <div
                key={idx}
                className="p-2 border-b border-gray-200 last:border-none text-sm sm:text-base"
              >
                <span className="font-medium text-gray-800">₹{d.amount}</span> donated by{" "}
                <span className="font-semibold">{d.supporterName}</span>{" "}
                <span className="text-gray-600">| {d.message}</span>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center py-4">No donations yet!</p>
          )}
        </div>
      </section>
    </main>
  );
}
