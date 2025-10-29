import dbConnect from "@/lib/mongodb";
import Supporter from "@/models/Supporter";

/** ✅ Fetch all donations for a supporter */
export async function GET(req, context) {
  try {
    await dbConnect();

    const { supporter_id } = await context.params;

    if (!supporter_id) {
      return new Response(
        JSON.stringify({ error: "Supporter ID is required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const supporter = await Supporter.findById(supporter_id)
      .populate("donations.creatorId", "name profilePic")
      .lean();

    if (!supporter) {
      return new Response(
        JSON.stringify({ error: "Supporter not found" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    const donations = supporter.donations || [];

    return new Response(JSON.stringify({ donations }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("GET supporter donations error:", err);
    return new Response(
      JSON.stringify({ error: err.message || "Internal Server Error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

/** ✅ Save new donation for supporter */
export async function POST(req, context) {
  try {
    await dbConnect();

    const { supporter_id } = await context.params;
    const { creatorId, creatorName, message, amount, paymentId } =
      await req.json();

    if (!supporter_id || !creatorId || !amount) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const supporter = await Supporter.findById(supporter_id);
    if (!supporter) {
      return new Response(
        JSON.stringify({ error: "Supporter not found" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    supporter.donations.push({
      creatorId,
      creatorName,
      amount,
      message,
      paymentId,
      date: new Date(),
    });

    await supporter.save();

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("POST supporter donation error:", err);
    return new Response(
      JSON.stringify({ error: err.message || "Internal Server Error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
