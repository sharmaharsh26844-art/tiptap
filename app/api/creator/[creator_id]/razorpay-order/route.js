// app/api/creator/[creator_id]/razorpay-order/route.js
import Razorpay from "razorpay";
import dbConnect from "@/lib/mongodb";
import Creator from "@/models/Creator";

export async function POST(req, { params }) {
  const { creator_id } = params;
  const { amount } = await req.json();

  await dbConnect();
  const creator = await Creator.findById(creator_id);
  if (!creator) return new Response(JSON.stringify({ error: "Creator not found" }), { status: 404 });

  const razorpay = new Razorpay({
    key_id: creator.razorpayId,
    key_secret: creator.razorpaySecret,
  });

  const order = await razorpay.orders.create({
    amount: amount * 100,
    currency: "INR",
    receipt: `rcpt_${Date.now()}`,
  });

  return new Response(JSON.stringify({ order, key: creator.razorpayId }), { status: 200 });
}
