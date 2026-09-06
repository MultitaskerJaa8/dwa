import { useState } from "react";
import { useRouter } from "next/router";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";

export default function Register() {
  const router = useRouter();
  const { register } = useAuth();

  const [employeeId, setEmployeeId] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  return (
    <div className="min-h-screen grid place-items-center px-4">
      <div className="w-full max-w-md card overflow-hidden">
        <div className="card-hd">
          <h1 className="text-2xl font-black tracking-tight text-slate-900">Employee Register</h1>
          <p className="text-sm muted mt-1">Default role: Employee (Admin assigns department & supervisor)</p>
        </div>

        <form
          className="card-bd space-y-3"
          onSubmit={async (e) => {
            e.preventDefault();
            setErr("");
            try {
              setBusy(true);
              await register({ employeeId, name, email, password });
              router.push("/dashboard");
            } catch (e) {
              setErr(e.message);
            } finally {
              setBusy(false);
            }
          }}
        >
          <div>
            <div className="label">Employee ID</div>
            <input className="input mt-1" value={employeeId} onChange={(e) => setEmployeeId(e.target.value)} placeholder="EMP001" />
          </div>

          <div>
            <div className="label">Full Name</div>
            <input className="input mt-1" value={name} onChange={(e) => setName(e.target.value)} placeholder="Full name" />
          </div>

          <div>
            <div className="label">Email</div>
            <input className="input mt-1" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="employee@gov.in" />
          </div>

          <div>
            <div className="label">Password</div>
            <input className="input mt-1" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Min 6 chars" />
          </div>

          {err ? <div className="text-sm text-red-600 font-semibold">{err}</div> : null}

          <button className="btn btn-primary w-full" disabled={busy}>
            {busy ? "Creating..." : "Create Account"}
          </button>

          <div className="text-xs muted">
            Already have account? <Link className="text-blue-700 font-semibold underline" href="/login">Login</Link>
          </div>
        </form>
      </div>
    </div>
  );
}