import dbConnect from "@/lib/mongodb";
import Creator from "@/models/Creator";
import Donation from "@/models/Donation";

// ✅ GET all donations for a creator
export async function GET(req, { params }) {
  try {
    await dbConnect();
    const { creator_id } = params;

    if (!creator_id) {
      return new Response(JSON.stringify({ error: "Missing creator ID" }), { status: 400 });
    }

    // Find all donations linked to this creator
    const donations = await Donation.find({ creator: creator_id }).sort({ createdAt: -1 });

    return new Response(JSON.stringify({ donations }), { status: 200 });
  } catch (err) {
    console.error("GET donations error:", err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}

// ✅ POST new donation
export async function POST(req, { params }) {
  try {
    await dbConnect();
    const { creator_id } = params;
    const { supporterName, message, amount, paymentId } = await req.json();

    if (!supporterName || !amount || !paymentId) {
      return new Response(JSON.stringify({ error: "Missing fields" }), { status: 400 });
    }

    const creator = await Creator.findById(creator_id);
    if (!creator) {
      return new Response(JSON.stringify({ error: "Creator not found" }), { status: 404 });
    }

    const donation = await Donation.create({
      creator: creator_id,
      supporterName,
      message,
      amount,
      paymentId,
    });

    return new Response(JSON.stringify({ success: true, donation }), { status: 200 });
  } catch (err) {
    console.error("POST donations error:", err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
