import Protected from "@/components/Protected";
import Layout from "@/components/Layout";
import { useAuth } from "@/context/AuthContext";

export default function Profile() {
  const { user } = useAuth();

  return (
    <Protected>
      <Layout>
        <h1 className="text-2xl font-black">Profile</h1>
        <p className="text-white/60 text-sm mt-1">Your account and department details.</p>

        <div className="grid md:grid-cols-2 gap-3 mt-4">
          <div className="card">
            <div className="text-xs text-white/60">Employee ID</div>
            <div className="text-lg font-bold mt-1">{user?.employeeId}</div>
          </div>
          <div className="card">
            <div className="text-xs text-white/60">Role</div>
            <div className="text-lg font-bold mt-1">{user?.role}</div>
          </div>
          <div className="card">
            <div className="text-xs text-white/60">Email</div>
            <div className="text-lg font-bold mt-1">{user?.email}</div>
          </div>
          <div className="card">
            <div className="text-xs text-white/60">Department</div>
            <div className="text-lg font-bold mt-1">{user?.department?.name || "Not assigned"}</div>
            <div className="text-xs text-white/50 mt-1">{user?.department?.code || ""}</div>
          </div>
        </div>
      </Layout>
    </Protected>
  );
}