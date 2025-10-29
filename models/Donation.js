import mongoose from "mongoose";

const DonationSchema = new mongoose.Schema({
  creator: { type: mongoose.Schema.Types.ObjectId, ref: "Creator", required: true },
  supporterName: { type: String, required: true },
  amount: { type: Number, required: true },
  message: { type: String, default: "" },
  paymentId: { type: String },
}, { timestamps: true });

export default mongoose.models.Donation || mongoose.model("Donation", DonationSchema);
