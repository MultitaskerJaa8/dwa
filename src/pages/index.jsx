import Image from "next/image";
import Link from "next/link";

function Pill({ text }) {
  return (
    <span className="inline-flex items-center rounded-full border bg-white px-3 py-1 text-xs font-semibold text-slate-700"
      style={{ borderColor: "var(--border)" }}>
      {text}
    </span>
  );
}

function FeatureCard({ title, desc }) {
  return (
    <div className="card">
      <div className="card-bd">
        <div className="text-base font-extrabold tracking-tight text-slate-900">{title}</div>
        <div className="text-sm muted mt-2 leading-relaxed">{desc}</div>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top bar */}
      <header className="bg-white border-b" style={{ borderColor: "var(--border)" }}>
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-2xl overflow-hidden border bg-white grid place-items-center"
              style={{ borderColor: "var(--border)" }}>
              <Image src="/logo.svg" alt="Logo" width={44} height={44} />
            </div>
            <div className="leading-tight">
              <div className="text-[15px] md:text-[16px] font-extrabold tracking-tight text-slate-900">
                {process.env.NEXT_PUBLIC_APP_NAME || "Digital Workforce Analytics"}
              </div>
              <div className="text-xs muted">Transparency • Accountability • KPI Analytics</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link className="btn btn-ghost" href="/login">Login</Link>
            <Link className="btn btn-primary hidden sm:inline-flex" href="/register">Register (Employee)</Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 py-10 md:py-14">
        <div className="grid lg:grid-cols-2 gap-6 items-center">
          <div>
            <div className="flex flex-wrap gap-2">
              <Pill text="Gov-friendly Workflow" />
              <Pill text="Evidence-based Evaluation" />
              <Pill text="Audit-ready Exports" />
              <Pill text="Vercel + MongoDB Atlas" />
            </div>

            <h1 className="mt-4 text-4xl md:text-6xl font-black tracking-tight text-slate-900 leading-[1.05]">
              Digital Workforce <span className="text-blue-700">Performance</span> Analytics Platform
            </h1>

            <p className="mt-4 text-base md:text-lg muted leading-relaxed max-w-2xl">
              A KPI-driven system to submit work logs with evidence, run supervisor approvals, and generate exportable performance reports.
              Designed for transparency, standardization and governance compliance.
            </p>

            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <Link className="btn btn-primary" href="/login">Go to Dashboard</Link>
              <Link className="btn btn-ghost" href="/register">Create Employee Account</Link>
            </div>

            <div className="mt-5 text-xs muted2">
              Tip: Demo setup ke liye <b>npm run seed</b> (Admin/Employee/Supervisor accounts auto-create).
            </div>
          </div>

          {/* Right card */}
          <div className="card overflow-hidden">
            <div className="card-hd">
              <div className="font-extrabold tracking-tight text-slate-900">Platform Highlights</div>
              <div className="text-xs muted mt-1">What you can do in Phase‑1</div>
            </div>
            <div className="card-bd grid gap-3">
              <div className="rounded-2xl border bg-white p-4" style={{ borderColor: "var(--border)" }}>
                <div className="font-bold text-slate-900">KPI Management</div>
                <div className="text-sm muted mt-1">Create KPIs with weightage, target and monthly/quarterly cycle mapped to departments.</div>
              </div>

              <div className="rounded-2xl border bg-white p-4" style={{ borderColor: "var(--border)" }}>
                <div className="font-bold text-slate-900">Work Management</div>
                <div className="text-sm muted mt-1">Employees submit work logs with evidence URLs and track approval status.</div>
              </div>

              <div className="rounded-2xl border bg-white p-4" style={{ borderColor: "var(--border)" }}>
                <div className="font-bold text-slate-900">Approvals + Scoring</div>
                <div className="text-sm muted mt-1">Supervisors approve/reject with remarks and score (0–100) for transparent evaluation.</div>
              </div>

              <div className="rounded-2xl border bg-white p-4" style={{ borderColor: "var(--border)" }}>
                <div className="font-bold text-slate-900">Reports Export</div>
                <div className="text-sm muted mt-1">Download CSV/PDF performance report for appraisal and audit documentation.</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Modules */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 pb-12">
        <div className="flex items-end justify-between gap-3 flex-wrap">
          <div>
            <div className="text-xs muted2 uppercase tracking-wider font-semibold">Modules</div>
            <h2 className="text-2xl md:text-3xl font-black tracking-tight text-slate-900 mt-1">
              Role-based pages (Employee / Supervisor / Admin)
            </h2>
          </div>
        </div>

        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-3 mt-4">
          <FeatureCard title="Dashboard" desc="Live KPIs, approvals and trend analytics with role-based scope (individual/team/org)." />
          <FeatureCard title="KPI Management" desc="Department KPI catalog with measurable targets and weightage based scoring." />
          <FeatureCard title="Work Submissions" desc="Evidence-backed submissions with time period selection and status tracking." />
          <FeatureCard title="Approvals Workflow" desc="Supervisor review queue with approve/reject, score and remarks." />
          <FeatureCard title="Performance Reports" desc="Monthly report generation and exports (CSV/PDF) for audits." />
          <FeatureCard title="Admin Panel" desc="Department creation, user role/department mapping and operational setup." />
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t" style={{ borderColor: "var(--border)" }}>
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div>
              <div className="font-extrabold tracking-tight text-slate-900">Digital Workforce Analytics</div>
              <div className="text-sm muted mt-1">KPI-driven evaluation • Approvals • Audit-ready exports</div>
            </div>
            <div className="text-xs muted2">
              © {new Date().getFullYear()} • Deployed on Vercel • MongoDB Atlas
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
