import mongoose from "mongoose";

const KPISchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    category: { type: String, default: "General" },
    description: { type: String, default: "" },

    department: { type: mongoose.Schema.Types.ObjectId, ref: "Department", required: true },

    targetValue: { type: Number, default: 100 },
    weightage: { type: Number, required: true, min: 1, max: 100 },

    cycle: { type: String, enum: ["Monthly", "Quarterly", "Annual"], default: "Monthly" },

    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export default mongoose.models.KPI || mongoose.model("KPI", KPISchema);