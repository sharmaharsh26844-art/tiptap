import Razorpay from "razorpay";
import dbConnect from "@/lib/mongodb";
import Creator from "@/models/Creator";

export async function POST(req) {
  const { amount, creatorId } = await req.json();
  await dbConnect();

  const creator = await Creator.findById(creatorId);
  if (!creator) return new Response(JSON.stringify({ error: "Creator not found" }), { status: 404 });

  const razorpay = new Razorpay({
    key_id: creator.razorpayId,       // public key
    key_secret: creator.razorpaySecret // secret used **only on server**
  });

  const order = await razorpay.orders.create({
    amount: amount * 100, // in paise
    currency: "INR",
    receipt: `rcpt_${Date.now()}`
  });

  return new Response(JSON.stringify({ order, key: creator.razorpayId }), { status: 200 });
}
