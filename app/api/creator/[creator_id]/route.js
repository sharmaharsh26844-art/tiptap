import Creator from "@/models/Creator";
import dbConnect from "@/lib/mongodb";

// GET creator by ID
export async function GET(req, context) {
  try {
    await dbConnect();

    // Correct way to get params in App Router
    const { creator_id } = context.params;

    if (!creator_id) {
      return new Response(
        JSON.stringify({ error: "Missing creator ID" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const creator = await Creator.findById(creator_id);
    if (!creator) {
      return new Response(
        JSON.stringify({ error: "Creator not found" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ creator }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("GET creator error:", err);
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
