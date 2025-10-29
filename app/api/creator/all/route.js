import dbConnect from "@/lib/mongodb";
import Creator from "@/models/Creator";

export async function GET() {
  try {
    await dbConnect();
    const creators = await Creator.find({}, "name bio profilePic coverPic _id").lean(); // select fields you need

    return Response.json({ creators });
  } catch (err) {
    console.error("Error fetching creators:", err);
    return Response.json({ error: "Failed to fetch creators" }, { status: 500 });
  }
}
