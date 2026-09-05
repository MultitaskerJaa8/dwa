import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    employeeId: { type: String, required: true, index: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, index: true },
    passwordHash: { type: String, required: true },

    department: { type: mongoose.Schema.Types.ObjectId, ref: "Department", default: null },
    designation: { type: String, default: "" },

    managerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },

    role: {
      type: String,
      enum: ["Employee", "Supervisor", "Admin"],
      default: "Employee",
      index: true
    },

    status: { type: String, enum: ["Active", "Inactive"], default: "Active" }
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model("User", UserSchema);