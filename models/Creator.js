import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const DonationSchema = new mongoose.Schema({
  supporterName: { type: String, required: true },
  message: { type: String, default: "" },
  amount: { type: Number, required: true },
  paymentId: { type: String, required: true },
  date: { type: Date, default: Date.now },
});

const CreatorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    bio: { type: String, default: "" },
    profilePic: { type: String, default: "" },
    coverPic: { type: String, default: "" },
    razorpayId: { type: String, default: "" },
    razorpaySecret: { type: String, default: "" },

    // 👇 NEW FIELD — stores all past donations permanently
    donations: [DonationSchema],
  },
  { timestamps: true }
);

// Hash password before saving
CreatorSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

export default mongoose.models.Creator || mongoose.model("Creator", CreatorSchema);
