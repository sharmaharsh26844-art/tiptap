import dbConnect from "@/lib/mongodb";
import Donation from "@/models/Donation";
import Supporter from "@/models/Supporter"; // ✅ add this

export async function POST(req) {
  try {
    const { creatorId, supporterId, supporterName, message, amount } = await req.json();

    if (!creatorId || !supporterName || !amount) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    await dbConnect();

    // ✅ Save donation in the main Donation collection
    const donation = await Donation.create({
      creatorId,
      supporterName,
      message: message || "",
      amount,
      date: new Date(),
    });

    // ✅ Also add donation entry to the supporter’s record
    if (supporterId) {
      const supporter = await Supporter.findById(supporterId);
      if (supporter) {
        supporter.donations.push({
          creatorId,
          amount,
          message,
          date: new Date(),
        });
        await supporter.save();
      }
    }

    return new Response(
      JSON.stringify({ success: true, donation }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );

  } catch (err) {
    console.error("Save donation error:", err);
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
