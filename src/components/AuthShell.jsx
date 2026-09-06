import Image from "next/image";
import Link from "next/link";

export default function AuthShell({ title, subtitle, children, footerLink }) {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Left Brand Panel */}
          <div className="hidden lg:block card overflow-hidden">
            <div className="card-bd">
              <div className="flex items-center gap-3">
                <div
                  className="h-12 w-12 rounded-2xl overflow-hidden border bg-white grid place-items-center"
                  style={{ borderColor: "var(--border)" }}
                >
                  <Image src="/logo.svg" alt="Logo" width={44} height={44} />
                </div>
                <div>
                  <div className="text-lg font-extrabold tracking-tight text-slate-900">
                    {process.env.NEXT_PUBLIC_APP_NAME || "Digital Workforce Analytics"}
                  </div>
                  <div className="text-sm muted mt-1">
                    Transparency • Accountability • KPI Performance
                  </div>
                </div>
              </div>

              <div className="mt-8 space-y-4">
                <Feature title="KPI-based scoring" desc="Standardized weightage, targets and evaluation cycle." />
                <Feature title="Approval workflow" desc="Supervisor verification for evidence-backed submissions." />
                <Feature title="Audit-ready reports" desc="Download CSV/PDF for review & compliance." />
              </div>

              <div className="mt-10 text-xs muted2">
                Tip: Demo data add karne ke liye <span className="font-semibold">npm run seed</span>.
              </div>
            </div>
          </div>

          {/* Right Form Panel */}
          <div className="card overflow-hidden">
            <div className="card-hd">
              <h1 className="text-2xl font-black tracking-tight text-slate-900">{title}</h1>
              <p className="text-sm muted mt-1">{subtitle}</p>
            </div>

            <div className="card-bd">{children}</div>

            {footerLink ? (
              <div className="px-5 pb-5 text-xs muted">
                {footerLink}
              </div>
            ) : null}
          </div>
        </div>

        <div className="mt-6 text-center text-xs muted2">
          © {new Date().getFullYear()} Digital Workforce Analytics
        </div>
      </div>
    </div>
  );
}

function Feature({ title, desc }) {
  return (
    <div className="rounded-2xl border bg-white p-4" style={{ borderColor: "var(--border)" }}>
      <div className="font-bold text-slate-900">{title}</div>
      <div className="text-sm muted mt-1">{desc}</div>
    </div>
  );
}
