import Link from "next/link";
import { useRouter } from "next/router";
import clsx from "clsx";
import { useAuth } from "@/context/AuthContext";
import { Icon } from "@/components/icons";

function Item({ href, label, icon, onNavigate }) {
  const router = useRouter();
  const active = router.pathname === href;

  return (
    <Link
      href={href}
      onClick={() => onNavigate?.()}
      className={clsx(
        "flex items-center gap-3 rounded-xl px-3 py-2 border transition",
        active
          ? "bg-blue-50 border-blue-200"
          : "bg-white border-transparent hover:bg-slate-50 hover:border-slate-200"
      )}
    >
      <div className={clsx("p-2 rounded-lg border", active ? "bg-white border-blue-200 text-blue-700" : "bg-slate-50 border-slate-200 text-slate-700")}>
        <Icon name={icon} className="h-5 w-5" />
      </div>

      <div className="flex-1">
        <div className={clsx("text-sm font-semibold", active ? "text-blue-800" : "text-slate-800")}>
          {label}
        </div>
        <div className="text-xs muted2">
          {active ? "Currently viewing" : "Open module"}
        </div>
      </div>

      {active ? <span className="badge">Active</span> : null}
    </Link>
  );
}

export default function Sidebar({ onNavigate }) {
  const { user } = useAuth();

  return (
    <div className="p-4 md:p-5 h-full overflow-auto">
      <div className="mb-4">
        <div className="text-xs muted2 uppercase tracking-wider font-semibold">Navigation</div>
      </div>

      <div className="space-y-2">
        <Item href="/dashboard" label="Dashboard" icon="dashboard" onNavigate={onNavigate} />
        <Item href="/dashboard/kpis" label={user?.role === "Admin" ? "KPI Management" : "My KPIs"} icon="kpi" onNavigate={onNavigate} />
        <Item href="/dashboard/work-submission" label="Work Submission" icon="submit" onNavigate={onNavigate} />
        {(user?.role === "Supervisor" || user?.role === "Admin") && (
          <Item href="/dashboard/approvals" label="Approvals" icon="approve" onNavigate={onNavigate} />
        )}
        <Item href="/dashboard/reports" label="Performance Reports" icon="report" onNavigate={onNavigate} />
        <Item href="/dashboard/profile" label="Profile" icon="profile" onNavigate={onNavigate} />
        {user?.role === "Admin" && <Item href="/dashboard/admin" label="Admin Panel" icon="admin" onNavigate={onNavigate} />}
      </div>

      <div className="mt-6 border-t pt-4" style={{ borderColor: "var(--border)" }}>
        <div className="text-xs muted2 uppercase tracking-wider font-semibold">Help & Tips</div>
        <div className="mt-2 text-xs muted leading-relaxed">
          Use <b>Admin Panel</b> to assign department & supervisor. Submit work logs with evidence URL for audit-ready approvals.
        </div>
      </div>
    </div>
  );
}