"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function CreatorPage() {
  const { creator_id } = useParams();
  const [supporter, setSupporter] = useState(null);
  const [creator, setCreator] = useState(null);
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ message: "", amount: "" });

  const loadRazorpayScript = () =>
    new Promise((resolve, reject) => {
      if (typeof window === "undefined") return reject("Window not defined");
      if (document.getElementById("razorpay-script")) return resolve(true);
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.id = "razorpay-script";
      script.onload = () => resolve(true);
      script.onerror = () => reject(false);
      document.body.appendChild(script);
    });

  useEffect(() => {
    const stored = localStorage.getItem("supporter");
    if (stored) setSupporter(JSON.parse(stored));
  }, []);

  useEffect(() => {
    if (!creator_id) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const resCreator = await fetch(`/api/creator/${creator_id}`);
        const dataCreator = await resCreator.json();
        setCreator(dataCreator.creator);

        const resDonations = await fetch(`/api/creator/${creator_id}/donations`);
        const dataDonations = await resDonations.json();

        const formattedDonations = (dataDonations.donations || []).map((d) => ({
          ...d,
          supporterName: d.supporterId?.name || d.supporterName || "Anonymous",
        }));

        setDonations(formattedDonations.reverse());
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [creator_id]);

  const handlePayment = async (e) => {
    e.preventDefault();
    if (!supporter) return alert("You must be logged in to pay");
    if (!form.amount) return alert("Please enter an amount");

    try {
      await loadRazorpayScript();

      const resOrder = await fetch(`/api/creator/${creator_id}/razorpay-order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: form.amount }),
      });
      const dataOrder = await resOrder.json();
      if (!resOrder.ok) throw new Error(dataOrder.error || "Payment failed");

      const options = {
        key: dataOrder.key,
        amount: dataOrder.order.amount,
        currency: "INR",
        name: creator.name,
        description: "Support Creator",
        order_id: dataOrder.order.id,
        handler: async (response) => {
          try {
            const resDonationCreator = await fetch(`/api/creator/${creator_id}/donations`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                creator: creator_id,
                supporterId: supporter._id,
                supporterName: supporter.name,
                message: form.message,
                amount: Number(form.amount),
                paymentId: response.razorpay_payment_id,
              }),
            });
            const dataDonationCreator = await resDonationCreator.json();
            if (!resDonationCreator.ok)
              throw new Error(dataDonationCreator.error || "Failed to save donation");

            const newDonation = dataDonationCreator.donation;

            await fetch(`/api/supporter/${supporter._id}/donations`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                creatorId: creator_id,
                creatorName: creator.name,
                message: form.message,
                amount: Number(form.amount),
                paymentId: response.razorpay_payment_id,
              }),
            });

            setDonations((prev) => [newDonation, ...prev]);
            setForm({ message: "", amount: "" });
          } catch (err) {
            console.error("Donation save error:", err);
            alert(err.message);
          }
        },
        prefill: { name: supporter.name },
        theme: { color: "#2563eb" },
      };

      new window.Razorpay(options).open();
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (!creator) return <p className="text-center mt-10">Creator not found.</p>;

  return (
    <main className="min-h-screen px-4 sm:px-6 lg:px-10 pb-10 bg-gray-50">
      {/* Cover Section */}
      <div className="relative w-full">
        <img
          className="w-full h-[40vh] sm:h-[50vh] object-cover rounded-b-lg"
          src={creator.coverPic}
          alt="Cover"
        />
        <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2">
          <img
            src={creator.profilePic}
            alt="Profile"
            className="w-28 h-28 sm:w-32 sm:h-32 rounded-full border-4 border-white shadow-lg"
          />
        </div>
      </div>

      {/* Creator Info */}
      <div className="mt-20 text-center px-2">
        <h1 className="text-2xl sm:text-3xl font-bold">@{creator.name}</h1>
        <p className="text-gray-600 mt-2 text-sm sm:text-base">
          {donations.length} Payments · ₹
          {donations.reduce((sum, d) => sum + Number(d.amount), 0)} Raised
        </p>
      </div>

      {/* Main Content */}
      <section className="flex flex-col lg:flex-row gap-8 mt-10 w-full max-w-6xl mx-auto">
        {/* Donations List */}
        <div className="bg-white p-5 sm:p-6 rounded-xl shadow-lg hover:shadow-2xl w-full lg:w-1/2">
          <h2 className="text-xl sm:text-2xl font-semibold mb-3">Donation Analytics</h2>
          <div className="overflow-y-auto max-h-80 bg-blue-50 p-3 rounded-lg">
            {donations.length ? (
              donations.map((d, i) => (
                <div key={i} className="p-2 text-sm sm:text-base border-b border-gray-200">
                  <span className="font-medium text-gray-800">₹{d.amount}</span> by{" "}
                  <span className="font-semibold">{d.supporterName}</span> —{" "}
                  <span className="italic">{d.message}</span>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center">No donations yet!</p>
            )}
          </div>
        </div>

        {/* Payment Form */}
        <div className="bg-white p-5 sm:p-6 rounded-xl shadow-lg hover:shadow-2xl w-full lg:w-1/2">
          <h2 className="text-xl sm:text-2xl font-semibold mb-4">
            Support {creator.name}
          </h2>
          {!supporter && <p className="text-red-500">You must be logged in to pay</p>}
          {supporter && (
            <form
              onSubmit={handlePayment}
              className="flex flex-col gap-3 sm:gap-4 text-sm sm:text-base"
            >
              <input
                type="text"
                value={supporter.name}
                disabled
                className="border rounded-lg py-2 px-3 bg-gray-100"
              />
              <input
                type="text"
                placeholder="Message"
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className="border rounded-lg py-2 px-3"
              />
              <input
                type="number"
                placeholder="Amount"
                value={form.amount}
                onChange={(e) => setForm({ ...form, amount: e.target.value })}
                className="border rounded-lg py-2 px-3"
                required
              />
              <button
                type="submit"
                className="text-white bg-gradient-to-r from-cyan-500 via-cyan-600 to-cyan-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-cyan-400 font-medium rounded-lg text-sm sm:text-base px-5 py-2.5 text-center m-auto w-full sm:w-1/2 mt-3"
              >
                Pay
              </button>
            </form>
          )}
        </div>
      </section>
    </main>
  );
}
