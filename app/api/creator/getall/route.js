import dbConnect from "@/lib/mongodb";
import Creator from "@/models/Creator";

export async function GET() {
  try {
    await dbConnect();
    const creators = await Creator.find({}, "-password -razorpaySecret"); // exclude sensitive data
    return Response.json({ creators });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
