import { useEffect, useState } from "react";
import Protected from "@/components/Protected";
import Layout from "@/components/Layout";
import { api } from "@/lib/apiClient";

export default function AdminPanel() {
  const [users, setUsers] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [err, setErr] = useState("");

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
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div>
            <h1 className="text-2xl font-black tracking-tight text-slate-900">Admin Panel</h1>
            <p className="text-sm muted mt-1">Manage departments and user access.</p>
          </div>
          <button className="btn btn-ghost" onClick={() => load().catch((e) => setErr(e.message))}>
            Refresh
          </button>
        </div>

        {err ? <div className="mt-3 text-sm text-red-600 font-semibold">{err}</div> : null}

        <div className="card mt-4 overflow-hidden">
          <div className="card-hd">
            <div className="font-extrabold tracking-tight text-slate-900">Create Department</div>
            <div className="text-xs muted mt-1">Add a new department code for KPI mapping.</div>
          </div>

          <form
            className="card-bd"
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
            <div className="grid md:grid-cols-2 gap-3">
              <div>
                <div className="label">Name</div>
                <input className="input mt-1" value={depName} onChange={(e) => setDepName(e.target.value)} placeholder="Health Department" />
              </div>
              <div>
                <div className="label">Code</div>
                <input className="input mt-1" value={depCode} onChange={(e) => setDepCode(e.target.value)} placeholder="HEALTH" />
              </div>
            </div>
            <button className="btn btn-primary w-full mt-4">Create</button>
          </form>
        </div>

        {/* USERS */}
        <div className="card mt-4 overflow-hidden">
          <div className="card-hd">
            <div className="font-extrabold tracking-tight text-slate-900">Users</div>
            <div className="text-xs muted mt-1">Update roles, department and status.</div>
          </div>

          {/* Mobile cards */}
          <div className="card-bd grid gap-3 lg:hidden">
            {users.map((u) => (
              <UserCard key={u._id} u={u} departments={departments} onSaved={load} />
            ))}
            {!users.length ? <div className="muted text-center py-10">No users.</div> : null}
          </div>

          {/* Desktop table */}
          <div className="card-bd hidden lg:block overflow-x-auto">
            <table className="table min-w-[1200px]">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Role</th>
                  <th>Department</th>
                  <th>Status</th>
                  <th>Designation</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <UserRow key={u._id} u={u} departments={departments} onSaved={load} />
                ))}
                {!users.length ? (
                  <tr><td colSpan="6" className="py-10 text-center muted">No users.</td></tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </div>
      </Layout>
    </Protected>
  );
}

function UserCard({ u, departments, onSaved }) {
  const [role, setRole] = useState(u.role);
  const [departmentId, setDepartmentId] = useState(u.department?._id || "");
  const [status, setStatus] = useState(u.status || "Active");
  const [designation, setDesignation] = useState(u.designation || "");
  const [busy, setBusy] = useState(false);

  return (
    <div className="rounded-2xl border bg-white p-4" style={{ borderColor: "var(--border)" }}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="font-bold text-slate-900">{u.name}</div>
          <div className="text-xs muted2 wrap-anywhere">{u.email}</div>
          <div className="text-xs muted2">{u.employeeId}</div>
        </div>
        <span className="badge">{u.role}</span>
      </div>

      <div className="grid gap-3 mt-4">
        <div>
          <div className="label">Role</div>
          <select className="input mt-1" value={role} onChange={(e) => setRole(e.target.value)}>
            <option>Employee</option>
            <option>Supervisor</option>
            <option>Admin</option>
          </select>
        </div>

        <div>
          <div className="label">Department</div>
          <select className="input mt-1" value={departmentId} onChange={(e) => setDepartmentId(e.target.value)}>
            <option value="">(Not assigned)</option>
            {departments.map((d) => <option key={d._id} value={d._id}>{d.name}</option>)}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <div className="label">Status</div>
            <select className="input mt-1" value={status} onChange={(e) => setStatus(e.target.value)}>
              <option>Active</option>
              <option>Inactive</option>
            </select>
          </div>
          <div>
            <div className="label">Designation</div>
            <input className="input mt-1" value={designation} onChange={(e) => setDesignation(e.target.value)} placeholder="Designation" />
          </div>
        </div>

        <button
          className="btn btn-primary"
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
          {busy ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
}

function UserRow({ u, departments, onSaved }) {
  const [role, setRole] = useState(u.role);
  const [departmentId, setDepartmentId] = useState(u.department?._id || "");
  const [status, setStatus] = useState(u.status || "Active");
  const [designation, setDesignation] = useState(u.designation || "");
  const [busy, setBusy] = useState(false);

  return (
    <tr>
      <td>
        <div className="font-semibold text-slate-900">{u.name}</div>
        <div className="text-xs muted2">{u.employeeId}</div>
        <div className="text-xs muted2 wrap-anywhere">{u.email}</div>
      </td>

      <td>
        <select className="input" value={role} onChange={(e) => setRole(e.target.value)}>
          <option>Employee</option>
          <option>Supervisor</option>
          <option>Admin</option>
        </select>
      </td>

      <td>
        <select className="input" value={departmentId} onChange={(e) => setDepartmentId(e.target.value)}>
          <option value="">(Not assigned)</option>
          {departments.map((d) => <option key={d._id} value={d._id}>{d.name}</option>)}
        </select>
      </td>

      <td>
        <select className="input" value={status} onChange={(e) => setStatus(e.target.value)}>
          <option>Active</option>
          <option>Inactive</option>
        </select>
      </td>

      <td>
        <input className="input" value={designation} onChange={(e) => setDesignation(e.target.value)} placeholder="Designation" />
      </td>

      <td>
        <button
          className="btn btn-primary"
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
          {busy ? "Saving..." : "Save"}
        </button>
      </td>
    </tr>
  );
}
