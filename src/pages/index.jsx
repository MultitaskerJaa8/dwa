import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen grid place-items-center px-4">
      <div className="max-w-3xl w-full">
        <div className="card">
          <div className="text-xs text-white/60">Government-ready • KPI-driven • Audit-ready</div>
          <h1 className="text-3xl md:text-5xl font-black mt-2 leading-tight">
            Digital Workforce <span className="text-white/70">Performance Analytics</span>
          </h1>
          <p className="text-white/70 mt-4 text-base md:text-lg">
            Standardize workforce evaluation with KPI scoring, transparent approvals, and exportable reports.
          </p>

          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <Link className="btn btn-primary" href="/login">Login</Link>
            <Link className="btn btn-ghost" href="/register">Register (Employee)</Link>
          </div>

          <div className="mt-6 grid md:grid-cols-3 gap-3">
            <div className="card">
              <div className="font-bold">KPI Management</div>
              <div className="text-sm text-white/70 mt-2">Define targets, weightage, and cycles with department mapping.</div>
            </div>
            <div className="card">
              <div className="font-bold">Approval Workflow</div>
              <div className="text-sm text-white/70 mt-2">Supervisor verification for evidence-backed submissions.</div>
            </div>
            <div className="card">
              <div className="font-bold">Reports Export</div>
              <div className="text-sm text-white/70 mt-2">Download CSV/PDF reports for audits and appraisals.</div>
            </div>
          </div>

          <div className="mt-4 text-xs text-white/50">
            Tip: First time? Create Admin via <span className="kbd">POST /api/bootstrap/admin</span>
          </div>
        </div>
      </div>
    </div>
  );
}