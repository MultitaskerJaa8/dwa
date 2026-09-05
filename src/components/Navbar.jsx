import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
      <div className="flex items-center gap-3">
        <div className="h-9 w-9 rounded-xl bg-white/10 grid place-items-center font-black">DW</div>
        <div>
          <div className="font-bold leading-tight">{process.env.NEXT_PUBLIC_APP_NAME || "Digital Workforce Analytics"}</div>
          <div className="text-xs text-white/60">KPI-driven Performance & Transparency</div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden sm:block text-right">
          <div className="text-sm font-semibold">{user?.name || "—"}</div>
          <div className="text-xs text-white/60">{user?.role || ""}</div>
        </div>
        <button className="btn btn-ghost" onClick={logout}>Logout</button>
      </div>
    </div>
  );
}