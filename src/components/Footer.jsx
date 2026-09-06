import Link from "next/link";
import { Icon } from "@/components/icons";

function FooterItem({ href = "#", label }) {
  return (
    <Link href={href} className="text-sm muted hover:text-slate-900 hover:underline">
      {label}
    </Link>
  );
}

function MetaPill({ icon, title, value }) {
  return (
    <div className="flex items-center gap-2 rounded-xl border bg-white px-3 py-2"
         style={{ borderColor: "var(--border)" }}>
      <span className="text-slate-700"><Icon name={icon} className="h-4 w-4" /></span>
      <div className="text-xs">
        <div className="font-semibold text-slate-900">{title}</div>
        <div className="muted2">{value}</div>
      </div>
    </div>
  );
}

export default function Footer() {
  return (
    <footer className="bg-white border-t" style={{ borderColor: "var(--border)" }}>
      <div className="px-5 md:px-7 py-8">
        <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <div className="text-lg font-extrabold tracking-tight text-slate-900">
              Digital Workforce Analytics
            </div>
            <p className="text-sm muted mt-2 leading-relaxed">
              A KPI-driven performance platform for transparent approvals, audit-ready reporting,
              and department-level productivity monitoring.
            </p>

            <div className="mt-4 flex flex-wrap gap-2">
              <MetaPill icon="shield" title="Security" value="JWT + HttpOnly Cookies" />
              <MetaPill icon="db" title="Database" value="MongoDB Atlas" />
              <MetaPill icon="cloud" title="Deployment" value="Vercel Serverless" />
            </div>
          </div>

          <div>
            <div className="text-xs muted2 uppercase tracking-wider font-semibold">Modules</div>
            <div className="mt-3 space-y-2">
              <FooterItem label="KPI Management" />
              <FooterItem label="Work Submissions" />
              <FooterItem label="Approval Workflow" />
              <FooterItem label="Performance Reports" />
            </div>
          </div>

          <div>
            <div className="text-xs muted2 uppercase tracking-wider font-semibold">Compliance</div>
            <div className="mt-3 space-y-2">
              <FooterItem label="Audit Trail Logging" />
              <FooterItem label="Evidence-backed Submissions" />
              <FooterItem label="Export (CSV/PDF)" />
              <FooterItem label="Role-based Access Control" />
            </div>
          </div>

          <div>
            <div className="text-xs muted2 uppercase tracking-wider font-semibold">Support</div>
            <div className="mt-3 space-y-2">
              <FooterItem label="User Guide (Internal)" />
              <FooterItem label="Admin Setup" />
              <FooterItem label="Report Export Help" />
              <FooterItem label="Contact IT Helpdesk" />
            </div>
          </div>
        </div>

        <div className="mt-7 pt-5 border-t flex flex-col md:flex-row md:items-center md:justify-between gap-2"
             style={{ borderColor: "var(--border)" }}>
          <div className="text-xs muted">
            © {new Date().getFullYear()} Digital Workforce Analytics — Internal Governance Tool (Phase‑1)
          </div>
          <div className="text-xs muted2">
            Built for transparency, accountability & measurable evaluation standards.
          </div>
        </div>
      </div>
    </footer>
  );
}