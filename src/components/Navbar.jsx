import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import { Icon } from "@/components/icons";

export default function Navbar({ onMenu }) {
  const { user, logout } = useAuth();

  return (
    <div className="bg-white border-b" style={{ borderColor: "var(--border)" }}>
      <div className="px-5 md:px-7 py-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            className="lg:hidden btn btn-ghost px-3"
            onClick={onMenu}
            aria-label="Open menu"
            type="button"
          >
            <Icon name="menu" />
          </button>

          <div className="h-11 w-11 rounded-2xl overflow-hidden border bg-white grid place-items-center"
               style={{ borderColor: "var(--border)" }}>
            <Image src="/logo.svg" alt="Logo" width={44} height={44} />
          </div>

          <div className="leading-tight">
            <div className="text-[15px] md:text-[16px] font-extrabold tracking-tight text-slate-900">
              {process.env.NEXT_PUBLIC_APP_NAME || "Digital Workforce Analytics"}
            </div>
            <div className="text-xs muted">
              Transparency • Accountability • KPI Analytics
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden md:block text-right">
            <div className="text-sm font-semibold text-slate-900">{user?.name || "—"}</div>
            <div className="text-xs muted">
              {user?.role || ""}{user?.employeeId ? ` • ${user.employeeId}` : ""}
            </div>
          </div>

          <button className="btn btn-ghost" onClick={logout}>Logout</button>
        </div>
      </div>
    </div>
  );
}