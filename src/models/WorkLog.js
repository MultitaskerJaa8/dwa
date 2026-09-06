import mongoose from "mongoose";

const WorkLogSchema = new mongoose.Schema(
  {
    employee: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    kpi: { type: mongoose.Schema.Types.ObjectId, ref: "KPI", required: true },

    periodMonth: { type: Number, required: true }, // 1-12
    periodYear: { type: Number, required: true },

    taskTitle: { type: String, required: true },
    taskDetails: { type: String, required: true },
    evidenceUrl: { type: String, default: "" },

    status: { type: String, enum: ["Pending", "Approved", "Rejected"], default: "Pending", index: true },
    supervisorRemarks: { type: String, default: "" },
    approvedScore: { type: Number, default: 0, min: 0, max: 100 },

    reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    reviewedAt: { type: Date, default: null }
  },
  { timestamps: true }
);

export default mongoose.models.WorkLog || mongoose.model("WorkLog", WorkLogSchema);