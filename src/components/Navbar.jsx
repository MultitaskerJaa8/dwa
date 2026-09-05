import Image from "next/image";
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <div className="px-5 py-4 border-b border-white/10">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-2xl overflow-hidden border border-white/15 bg-white/5 grid place-items-center">
            <Image src="/logo.svg" alt="Logo" width={40} height={40} />
          </div>
          <div className="leading-tight">
            <div className="font-extrabold tracking-tight">
              {process.env.NEXT_PUBLIC_APP_NAME || "Digital Workforce Analytics"}
            </div>
            <div className="text-xs text-white/60">
              Transparency • Accountability • KPI Analytics
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:block text-right">
            <div className="text-sm font-semibold">{user?.name || "—"}</div>
            <div className="text-xs text-white/60">
              {user?.role || ""}{user?.employeeId ? ` • ${user.employeeId}` : ""}
            </div>
          </div>
          <button className="btn btn-ghost" onClick={logout}>Logout</button>
        </div>
      </div>
    </div>
  );
}
