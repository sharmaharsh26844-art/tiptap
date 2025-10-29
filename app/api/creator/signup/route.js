import dbConnect from "@/lib/mongodb";
import Creator from "@/models/Creator";

export async function POST(req) {
  try {
    await dbConnect();

    const formData = await req.formData();

    const name = formData.get("name");
    const email = formData.get("email");
    const password = formData.get("password");
    const bio = formData.get("bio");
    const profilePic = formData.get("profilePic");
    const coverPic = formData.get("coverPic");
    const razorpayId = formData.get("razorpayId");
    const razorpaySecret = formData.get("razorpaySecret");

    const existing = await Creator.findOne({ email });
    if (existing)
      return Response.json({ error: "Email already registered" }, { status: 400 });

    const creator = await Creator.create({
      name,
      email,
      password,
      bio,
      profilePic,
      coverPic,
      razorpayId,
      razorpaySecret,
    });

    return Response.json({ message: "Creator registered successfully", creator });
  } catch (err) {
    console.error("Signup error:", err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}
