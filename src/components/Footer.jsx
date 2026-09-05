export default function Footer() {
  return (
    <div className="px-5 py-5 border-t border-white/10">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <div className="text-sm font-semibold tracking-tight">
            Digital Workforce Analytics
          </div>
          <div className="text-xs text-white/60 mt-1">
            KPI-driven performance evaluation • Approval workflow • Audit-ready exports
          </div>
        </div>

        <div className="text-xs text-white/55">
          <div className="flex flex-wrap gap-x-4 gap-y-1">
            <span>Security: JWT + HttpOnly Cookies</span>
            <span>Database: MongoDB Atlas</span>
            <span>Deployment: Vercel Serverless</span>
          </div>
          <div className="mt-2 text-white/45">
            © {new Date().getFullYear()} — Internal Governance Tool (Phase-1)
          </div>
        </div>
      </div>
    </div>
  );
}
