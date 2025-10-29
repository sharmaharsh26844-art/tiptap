import bcrypt from "bcryptjs";
import dbConnect from "@/lib/mongodb";
import Supporter from "@/models/Supporter";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

export async function POST(req) {
  try {
    await dbConnect();

    const { name, email, password, profilePic } = await req.json();

    if (!name || !email || !password) {
      return new Response(
        JSON.stringify({ error: "Name, email, and password are required" }),
        { status: 400 }
      );
    }

    const existing = await Supporter.findOne({ email: email.trim() });
    if (existing) {
      return new Response(JSON.stringify({ error: "Supporter already exists" }), { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const supporter = new Supporter({
      name,
      email: email.trim(),
      password: hashedPassword,
      profilePic: profilePic || "",
      donations: [],
    });

    await supporter.save();

    const token = jwt.sign(
      { id: supporter._id, email: supporter.email },
      JWT_SECRET,
      { expiresIn: "1d" }
    );

    const { password: _, ...supporterData } = supporter.toObject();

    return new Response(
      JSON.stringify({ message: "Signup successful", token, supporter: supporterData }),
      { status: 201 }
    );
  } catch (err) {
    console.error("Signup error:", err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
