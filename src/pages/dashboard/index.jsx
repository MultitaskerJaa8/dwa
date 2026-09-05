import Protected from "@/components/Protected";
import Layout from "@/components/Layout";
import StatCard from "@/components/StatCard";
import PerformanceChart from "@/components/PerformanceChart";
import { useAuth } from "@/context/AuthContext";

export default function Dashboard() {
  const { user } = useAuth();

  // demo chart values (UI). Real trend can be added via report API loop.
  const labels = ["W1", "W2", "W3", "W4"];
  const data = [70, 78, 82, 88];

  return (
    <Protected>
      <Layout>
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div>
            <h1 className="text-2xl font-black">Dashboard</h1>
            <p className="text-white/60 text-sm mt-1">
              Welcome, <span className="text-white/80 font-semibold">{user?.name}</span> — role: {user?.role}
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-3 mt-4">
          <StatCard label="Evaluation Cycle" value="Monthly" hint="Configurable in KPI settings" />
          <StatCard label="Transparency" value="Audit Logs" hint="All critical actions are logged" />
          <StatCard label="Exports" value="CSV/PDF" hint="Reports are downloadable for audits" />
        </div>

        <div className="grid lg:grid-cols-2 gap-3 mt-4">
          <PerformanceChart labels={labels} data={data} />
          <div className="card">
            <div className="font-bold">Quick Actions</div>
            <div className="text-white/70 text-sm mt-2">
              • Submit your monthly work log with evidence URL<br/>
              • Supervisor approves with score (0–100)<br/>
              • Download reports for appraisal cycle
            </div>
          </div>
        </div>
      </Layout>
    </Protected>
  );
}