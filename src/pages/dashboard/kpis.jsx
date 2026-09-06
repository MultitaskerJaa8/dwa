import { useEffect, useState } from "react";
import Protected from "@/components/Protected";
import Layout from "@/components/Layout";
import KPICard from "@/components/KPICard";
import { api } from "@/lib/apiClient";
import { useAuth } from "@/context/AuthContext";

export default function KPIsPage() {
  const { user } = useAuth();
  const [kpis, setKpis] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  // admin create form
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

  return (
    <Protected>
      <Layout>
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div>
            <h1 className="text-2xl font-black">{user?.role === "Admin" ? "KPI Management" : "My Department KPIs"}</h1>
            <p className="text-white/60 text-sm mt-1">Create, assign, and track KPI targets & weightage.</p>
          </div>
          <button className="btn btn-ghost" onClick={() => load().catch((e) => setErr(e.message))}>Refresh</button>
        </div>

        {err ? <div className="mt-3 text-sm text-red-300">{err}</div> : null}

        {user?.role === "Admin" && (
          <form
            className="card mt-4 space-y-3"
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
            <div className="font-bold">Create KPI</div>
            <div className="grid md:grid-cols-2 gap-3">
              <div>
                <div className="label">Title</div>
                <input className="input" value={title} onChange={(e) => setTitle(e.target.value)} />
              </div>
              <div>
                <div className="label">Department</div>
                <select className="input" value={departmentId} onChange={(e) => setDepartmentId(e.target.value)}>
                  {departments.map((d) => <option key={d._id} value={d._id}>{d.name} ({d.code})</option>)}
                </select>
              </div>
              <div>
                <div className="label">Category</div>
                <input className="input" value={category} onChange={(e) => setCategory(e.target.value)} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="label">Weightage %</div>
                  <input className="input" type="number" min="1" max="100" value={weightage} onChange={(e) => setWeightage(e.target.value)} />
                </div>
                <div>
                  <div className="label">Target</div>
                  <input className="input" type="number" value={targetValue} onChange={(e) => setTargetValue(e.target.value)} />
                </div>
              </div>
              <div>
                <div className="label">Cycle</div>
                <select className="input" value={cycle} onChange={(e) => setCycle(e.target.value)}>
                  <option>Monthly</option>
                  <option>Quarterly</option>
                  <option>Annual</option>
                </select>
              </div>
              <div>
                <div className="label">Description</div>
                <input className="input" value={description} onChange={(e) => setDescription(e.target.value)} />
              </div>
            </div>
            <button disabled={busy} className="btn btn-primary w-full">{busy ? "Creating..." : "Create KPI"}</button>
          </form>
        )}

        <div className="grid md:grid-cols-2 gap-3 mt-4">
          {kpis.map((k) => <KPICard key={k._id} kpi={k} />)}
          {!kpis.length && <div className="card text-white/70">No KPIs found.</div>}
        </div>
      </Layout>
    </Protected>
  );
}