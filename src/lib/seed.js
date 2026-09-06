import bcrypt from "bcryptjs";
import Department from "@/models/Department";
import User from "@/models/User";
import KPI from "@/models/KPI";
import WorkLog from "@/models/WorkLog";

async function upsertDepartment({ name, code }) {
  let dep = await Department.findOne({ code });
  if (!dep) dep = await Department.create({ name, code });
  return dep;
}

async function upsertUser({ employeeId, name, email, role, password, departmentId, managerId, resetPasswords }) {
  const normalizedEmail = String(email).toLowerCase().trim();
  let u = await User.findOne({ email: normalizedEmail });

  const passwordHash = password ? await bcrypt.hash(String(password), 10) : null;

  if (!u) {
    if (!passwordHash) throw new Error(`Missing password for new user: ${normalizedEmail}`);
    u = await User.create({
      employeeId,
      name,
      email: normalizedEmail,
      role,
      status: "Active",
      passwordHash,
      department: departmentId || null,
      managerId: managerId || null
    });
  } else {
    u.employeeId = employeeId;
    u.name = name;
    u.role = role;
    u.department = departmentId || null;
    u.managerId = managerId || null;
    u.status = "Active";

    // KEY FIX: reset demo passwords so login never fails
    if (resetPasswords && passwordHash) {
      u.passwordHash = passwordHash;
    }
    await u.save();
  }

  return u;
}

async function upsertKPI({ title, departmentId, weightage, targetValue, category, description, cycle }) {
  let k = await KPI.findOne({ title, department: departmentId });
  if (!k) {
    k = await KPI.create({
      title,
      department: departmentId,
      weightage,
      targetValue,
      category,
      description,
      cycle,
      isActive: true
    });
  }
  return k;
}

export async function seedDemo({ resetPasswords = true } = {}) {
  const psd = await upsertDepartment({ name: "Public Services Department", code: "PSD" });

  const admin = await upsertUser({
    employeeId: "ADM001",
    name: "System Admin",
    email: "admin@gov.in",
    role: "Admin",
    password: "Admin@12345",
    departmentId: null,
    managerId: null,
    resetPasswords
  });

  const supervisor = await upsertUser({
    employeeId: "SUP001",
    name: "Supervisor One",
    email: "supervisor@gov.in",
    role: "Supervisor",
    password: "Supervisor@12345",
    departmentId: psd._id,
    managerId: null,
    resetPasswords
  });

  const employee = await upsertUser({
    employeeId: "EMP001",
    name: "Employee One",
    email: "employee1@gov.in",
    role: "Employee",
    password: "Employee@12345",
    departmentId: psd._id,
    managerId: supervisor._id,
    resetPasswords
  });

  const k1 = await upsertKPI({
    title: "SLA Compliance for Citizen Requests",
    departmentId: psd._id,
    weightage: 35,
    targetValue: 95,
    category: "Service Delivery",
    description: "Resolve citizen requests within approved SLA timeline.",
    cycle: "Monthly"
  });

  const k2 = await upsertKPI({
    title: "Task Completion Rate (Assigned)",
    departmentId: psd._id,
    weightage: 35,
    targetValue: 90,
    category: "Productivity",
    description: "Complete assigned tasks with quality evidence and timely updates.",
    cycle: "Monthly"
  });

  const k3 = await upsertKPI({
    title: "Attendance Compliance (Optional)",
    departmentId: psd._id,
    weightage: 30,
    targetValue: 96,
    category: "Compliance",
    description: "Maintain attendance compliance as per department policy.",
    cycle: "Monthly"
  });

  const now = new Date();
  const periodMonth = now.getMonth() + 1;
  const periodYear = now.getFullYear();

  const existing = await WorkLog.countDocuments({ employee: employee._id, periodMonth, periodYear });
  if (!existing) {
    await WorkLog.create([
      {
        employee: employee._id,
        kpi: k1._id,
        periodMonth,
        periodYear,
        taskTitle: "Resolved citizen requests within SLA",
        taskDetails: "Resolved and documented closures; verified via portal logs.",
        evidenceUrl: "https://example.com/evidence/slacompliance",
        status: "Approved",
        approvedScore: 86,
        supervisorRemarks: "Verified against portal logs.",
        reviewedBy: supervisor._id,
        reviewedAt: new Date()
      },
      {
        employee: employee._id,
        kpi: k2._id,
        periodMonth,
        periodYear,
        taskTitle: "Completed assigned tasks with evidence",
        taskDetails: "Weekly tasks completed; summary submitted with links.",
        evidenceUrl: "https://example.com/evidence/taskcompletion",
        status: "Pending",
        approvedScore: 0
      },
      {
        employee: employee._id,
        kpi: k3._id,
        periodMonth,
        periodYear,
        taskTitle: "Attendance maintained as per roster",
        taskDetails: "No unapproved leaves; reporting on time.",
        evidenceUrl: "https://example.com/evidence/attendance",
        status: "Approved",
        approvedScore: 92,
        supervisorRemarks: "Matched with register extract.",
        reviewedBy: supervisor._id,
        reviewedAt: new Date()
      }
    ]);
  }

  return {
    departments: ["PSD"],
    createdOrUpdated: {
      admin: admin.email,
      supervisor: supervisor.email,
      employee: employee.email
    },
    demoPasswords: {
      admin: "Admin@12345",
      supervisor: "Supervisor@12345",
      employee: "Employee@12345"
    }
  };
}
