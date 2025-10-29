import dbConnect from "@/lib/mongodb";
import Supporter from "@/models/Supporter";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

export async function POST(req) {
  try {
    await dbConnect();
    const { email, password } = await req.json();

    if (!email?.trim() || !password) {
      return new Response(JSON.stringify({ error: "Email and password required" }), { status: 400 });
    }

    const supporter = await Supporter.findOne({ email: email.trim() });
    if (!supporter) return new Response(JSON.stringify({ error: "Supporter not found" }), { status: 404 });

    if (!supporter.password || supporter.password.trim() === "") {
      return new Response(JSON.stringify({ error: "Password not set for this supporter" }), { status: 400 });
    }

    const isMatch = await bcrypt.compare(password, supporter.password);
    if (!isMatch) return new Response(JSON.stringify({ error: "Invalid credentials" }), { status: 400 });

    const token = jwt.sign({ id: supporter._id, email: supporter.email }, JWT_SECRET, { expiresIn: "1d" });

    const { password: _, ...supporterData } = supporter.toObject();

    return new Response(JSON.stringify({ token, supporter: supporterData }), { status: 200 });
  } catch (err) {
    console.error("Login error:", err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
