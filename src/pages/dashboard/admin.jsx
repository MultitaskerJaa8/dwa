import { useEffect, useState } from "react";
import Protected from "@/components/Protected";
import Layout from "@/components/Layout";
import { api } from "@/lib/apiClient";

export default function AdminPanel() {
  const [users, setUsers] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [err, setErr] = useState("");

  // create department
  const [depName, setDepName] = useState("");
  const [depCode, setDepCode] = useState("");

  async function load() {
    const data = await api("/api/users");
    setUsers(data.users || []);
    setDepartments(data.departments || []);
  }

  useEffect(() => {
    load().catch((e) => setErr(e.message));
  }, []);

  return (
    <Protected roles={["Admin"]}>
      <Layout>
        <h1 className="text-2xl font-black">Admin Panel</h1>
        <p className="text-white/60 text-sm mt-1">Manage departments, roles, and reporting structure.</p>

        {err ? <div className="mt-3 text-sm text-red-300">{err}</div> : null}

        <form
          className="card mt-4 space-y-3"
          onSubmit={async (e) => {
            e.preventDefault();
            setErr("");
            try {
              await api("/api/departments", {
                method: "POST",
                body: JSON.stringify({ name: depName, code: depCode })
              });
              setDepName("");
              setDepCode("");
              await load();
            } catch (e) {
              setErr(e.message);
            }
          }}
        >
          <div className="font-bold">Create Department</div>
          <div className="grid md:grid-cols-2 gap-3">
            <div>
              <div className="label">Name</div>
              <input className="input" value={depName} onChange={(e) => setDepName(e.target.value)} placeholder="Health Department" />
            </div>
            <div>
              <div className="label">Code</div>
              <input className="input" value={depCode} onChange={(e) => setDepCode(e.target.value)} placeholder="HEALTH" />
            </div>
          </div>
          <button className="btn btn-primary w-full">Create</button>
        </form>

        <div className="card mt-4 overflow-x-auto">
          <div className="font-bold mb-3">Users</div>
          <table className="min-w-[1000px] w-full text-sm">
            <thead>
              <tr className="text-white/70">
                <th className="text-left py-2">Name</th>
                <th className="text-left py-2">EmployeeId</th>
                <th className="text-left py-2">Email</th>
                <th className="text-left py-2">Role</th>
                <th className="text-left py-2">Department</th>
                <th className="text-left py-2">Status</th>
                <th className="text-left py-2">Update</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <Row key={u._id} u={u} departments={departments} onSaved={load} />
              ))}
              {!users.length && (
                <tr><td colSpan="7" className="py-6 text-center text-white/60">No users.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </Layout>
    </Protected>
  );
}

function Row({ u, departments, onSaved }) {
  const [role, setRole] = useState(u.role);
  const [departmentId, setDepartmentId] = useState(u.department?._id || "");
  const [status, setStatus] = useState(u.status || "Active");
  const [designation, setDesignation] = useState(u.designation || "");
  const [busy, setBusy] = useState(false);

  return (
    <tr className="border-t border-white/10">
      <td className="py-3 font-semibold">{u.name}</td>
      <td className="py-3">{u.employeeId}</td>
      <td className="py-3">{u.email}</td>
      <td className="py-3">
        <select className="input" value={role} onChange={(e) => setRole(e.target.value)}>
          <option>Employee</option>
          <option>Supervisor</option>
          <option>Admin</option>
        </select>
      </td>
      <td className="py-3">
        <select className="input" value={departmentId} onChange={(e) => setDepartmentId(e.target.value)}>
          <option value="">(Not assigned)</option>
          {departments.map((d) => <option key={d._id} value={d._id}>{d.name}</option>)}
        </select>
      </td>
      <td className="py-3">
        <select className="input" value={status} onChange={(e) => setStatus(e.target.value)}>
          <option>Active</option>
          <option>Inactive</option>
        </select>
      </td>
      <td className="py-3">
        <div className="flex gap-2">
          <input className="input" value={designation} onChange={(e) => setDesignation(e.target.value)} placeholder="Designation" />
          <button
            className="btn btn-ghost"
            disabled={busy}
            onClick={async () => {
              try {
                setBusy(true);
                await api("/api/users", {
                  method: "PATCH",
                  body: JSON.stringify({
                    userId: u._id,
                    role,
                    departmentId: departmentId || null,
                    status,
                    designation
                  })
                });
                await onSaved();
              } finally {
                setBusy(false);
              }
            }}
          >
            Save
          </button>
        </div>
      </td>
    </tr>
  );
}