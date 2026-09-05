import Link from "next/link";
import { useRouter } from "next/router";
import { useAuth } from "@/context/AuthContext";
import clsx from "clsx";

function Item({ href, label }) {
  const router = useRouter();
  const active = router.pathname === href;
  return (
    <Link
      href={href}
      className={clsx(
        "block rounded-xl px-3 py-2 border border-transparent hover:border-white/15 hover:bg-white/5",
        active && "bg-white/10 border-white/15"
      )}
    >
      <div className="text-sm font-semibold">{label}</div>
    </Link>
  );
}

export default function Sidebar() {
  const { user } = useAuth();

  return (
    <div className="p-3 space-y-2">
      <Item href="/dashboard" label="Dashboard" />
      <Item href="/dashboard/kpis" label={user?.role === "Admin" ? "KPI Management" : "My KPIs"} />
      <Item href="/dashboard/work-submission" label="Work Submission" />
      {(user?.role === "Supervisor" || user?.role === "Admin") && <Item href="/dashboard/approvals" label="Approvals" />}
      <Item href="/dashboard/reports" label="Performance Reports" />
      <Item href="/dashboard/profile" label="Profile" />
      {user?.role === "Admin" && <Item href="/dashboard/admin" label="Admin Panel" />}
    </div>
  );
}