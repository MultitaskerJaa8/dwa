import { useState } from "react";
import { useRouter } from "next/router";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";

export default function Login() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  return (
    <div className="min-h-screen grid place-items-center px-4">
      <div className="w-full max-w-md card overflow-hidden">
        <div className="card-hd">
          <h1 className="text-2xl font-black tracking-tight text-slate-900">Login</h1>
          <p className="text-sm muted mt-1">Secure, role-based access (Employee / Supervisor / Admin)</p>
        </div>

        <form
          className="card-bd space-y-3"
          onSubmit={async (e) => {
            e.preventDefault();
            setErr("");
            try {
              setBusy(true);
              await login(email, password);
              router.push("/dashboard");
            } catch (e) {
              setErr(e.message);
            } finally {
              setBusy(false);
            }
          }}
        >
          <div>
            <div className="label">Email</div>
            <input className="input mt-1" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@gov.in" />
          </div>

          <div>
            <div className="label">Password</div>
            <input className="input mt-1" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
          </div>

          {err ? <div className="text-sm text-red-600 font-semibold">{err}</div> : null}

          <button className="btn btn-primary w-full" disabled={busy}>
            {busy ? "Signing in..." : "Sign In"}
          </button>

          <div className="text-xs muted">
            New employee? <Link className="text-blue-700 font-semibold underline" href="/register">Register</Link>
          </div>
        </form>
      </div>
    </div>
  );
}