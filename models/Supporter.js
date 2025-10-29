import mongoose from "mongoose";

const donationSchema = new mongoose.Schema({
  creatorId: { type: mongoose.Schema.Types.ObjectId, ref: "Creator" },
  amount: Number,
  message: String,
  paymentId: String,
  date: { type: Date, default: Date.now },
});

const supporterSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String }, // hashed password
  mustChangePassword: { type: Boolean, default: false }, // for temp passwords
  profilePic: { type: String, default: "" },
  donations: [donationSchema],
});

export default mongoose.models.Supporter || mongoose.model("Supporter", supporterSchema);
