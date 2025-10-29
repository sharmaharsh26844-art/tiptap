// app/api/creator/login/route.js
import Creator from "@/models/Creator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dbConnect from "@/lib/mongodb"; // ✅ Import DB connection helper

export async function POST(req) {
  try {
    // ✅ Make sure database is connected
    await dbConnect();

    const { email, password } = await req.json();
    const creator = await Creator.findOne({ email });

    if (!creator) {
      return new Response(JSON.stringify({ error: "User not found" }), { status: 404 });
    }

    const isMatch = await bcrypt.compare(password, creator.password);
    if (!isMatch) {
      return new Response(JSON.stringify({ error: "Invalid credentials" }), { status: 400 });
    }

    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET not set in environment variables");
    }

    const token = jwt.sign(
      { id: creator._id, email: creator.email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    return new Response(
      JSON.stringify({
        token,
        creator: {
          id: creator._id,
          name: creator.name,
          email: creator.email,
          bio: creator.bio,
          profilePic: creator.profilePic,
          coverPic: creator.coverPic,
          razorpayId: creator.razorpayId,
        },
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Login Error:", error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
