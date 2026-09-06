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
      <div className="max-w-md w-full card">
        <h1 className="text-2xl font-black">Login</h1>
        <p className="text-white/60 text-sm mt-2">Secure, role-based access (Employee / Supervisor / Admin)</p>

        <form
          className="mt-5 space-y-3"
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
            <input className="input" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@gov.in" />
          </div>
          <div>
            <div className="label">Password</div>
            <input className="input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
          </div>

          {err ? <div className="text-sm text-red-300">{err}</div> : null}

          <button className="btn btn-primary w-full" disabled={busy}>
            {busy ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div className="text-xs text-white/60 mt-4">
          New employee? <Link className="underline" href="/register">Register</Link>
        </div>
      </div>
    </div>
  );
}