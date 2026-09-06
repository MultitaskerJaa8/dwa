import { useEffect, useMemo, useState } from "react";
import Protected from "@/components/Protected";
import Layout from "@/components/Layout";
import PageHeader from "@/components/PageHeader";
import EmptyState from "@/components/EmptyState";
import KPICard from "@/components/KPICard";
import { api } from "@/lib/apiClient";
import { useAuth } from "@/context/AuthContext";

export default function KPIsPage() {
  const { user } = useAuth();
  const [kpis, setKpis] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  const [q, setQ] = useState("");

  // admin create fields
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Service Delivery");
  const [description, setDescription] = useState("");
  const [departmentId, setDepartmentId] = useState("");
  const [weightage, setWeightage] = useState(20);
  const [targetValue, setTargetValue] = useState(100);
  const [cycle, setCycle] = useState("Monthly");

  async function load() {
    setErr("");
    const data = await api("/api/kpis");
    setKpis(data.kpis || []);
    setDepartments(data.departments || []);
    if (!departmentId && data.departments?.[0]?._id) setDepartmentId(data.departments[0]._id);
  }

  useEffect(() => {
    load().catch((e) => setErr(e.message));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return kpis;
    return kpis.filter((k) =>
      (k.title || "").toLowerCase().includes(s) ||
      (k.category || "").toLowerCase().includes(s) ||
      (k.department?.name || "").toLowerCase().includes(s) ||
      (k.department?.code || "").toLowerCase().includes(s)
    );
  }, [kpis, q]);

  return (
    <Protected>
      <Layout>
        <PageHeader
          title={user?.role === "Admin" ? "KPI Management" : "Department KPIs"}
          description="Define measurable KPIs with targets, weightage and evaluation cycle."
          right={
            <div className="flex items-center gap-2">
              <input
                className="input w-[240px] hidden sm:block"
                placeholder="Search KPI..."
                value={q}
                onChange={(e) => setQ(e.target.value)}
              />
              <button className="btn btn-ghost" onClick={() => load().catch((e) => setErr(e.message))}>
                Refresh
              </button>
            </div>
          }
        />

        <div className="mt-3 sm:hidden">
          <input className="input" placeholder="Search KPI..." value={q} onChange={(e) => setQ(e.target.value)} />
        </div>

        {err ? <div className="mt-3 text-sm text-red-600 font-semibold">{err}</div> : null}

        {user?.role === "Admin" ? (
          <div className="card mt-4 overflow-hidden">
            <div className="card-hd">
              <div className="font-extrabold tracking-tight text-slate-900">Create KPI</div>
              <div className="text-xs muted mt-1">Assign KPI to a department with measurable target and weightage.</div>
            </div>

            <form
              className="card-bd"
              onSubmit={async (e) => {
                e.preventDefault();
                setErr("");
                try {
                  setBusy(true);
                  await api("/api/kpis", {
                    method: "POST",
                    body: JSON.stringify({ title, category, description, departmentId, targetValue, weightage, cycle })
                  });
                  setTitle("");
                  setDescription("");
                  await load();
                } catch (e) {
                  setErr(e.message);
                } finally {
                  setBusy(false);
                }
              }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <div className="label">Title</div>
                  <input className="input mt-1" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g., SLA Compliance for Citizen Requests" />
                </div>

                <div>
                  <div className="label">Department</div>
                  <select className="input mt-1" value={departmentId} onChange={(e) => setDepartmentId(e.target.value)}>
                    {departments.map((d) => (
                      <option key={d._id} value={d._id}>
                        {d.name} ({d.code})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <div className="label">Category</div>
                  <input className="input mt-1" value={category} onChange={(e) => setCategory(e.target.value)} />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <div className="label">Weightage %</div>
                    <input className="input mt-1" type="number" min="1" max="100" value={weightage} onChange={(e) => setWeightage(e.target.value)} />
                  </div>
                  <div>
                    <div className="label">Target</div>
                    <input className="input mt-1" type="number" value={targetValue} onChange={(e) => setTargetValue(e.target.value)} />
                  </div>
                </div>

                <div>
                  <div className="label">Cycle</div>
                  <select className="input mt-1" value={cycle} onChange={(e) => setCycle(e.target.value)}>
                    <option>Monthly</option>
                    <option>Quarterly</option>
                    <option>Annual</option>
                  </select>
                </div>

                <div>
                  <div className="label">Description</div>
                  <input className="input mt-1" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Short measurable description..." />
                </div>
              </div>

              <button disabled={busy} className="btn btn-primary w-full mt-4">
                {busy ? "Creating..." : "Create KPI"}
              </button>
            </form>
          </div>
        ) : null}

        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
          {filtered.map((k) => <KPICard key={k._id} kpi={k} />)}
        </div>

        {!filtered.length ? (
          <div className="mt-4">
            <EmptyState
              title="No KPIs found"
              description="Search clear karein ya admin se department KPIs configure karwayein."
            />
          </div>
        ) : null}
      </Layout>
    </Protected>
  );
}
