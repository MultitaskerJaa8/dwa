import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import AuthShell from "@/components/AuthShell";

export default function Login() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  return (
    <AuthShell
      title="Login"
      subtitle="Role-based access for Employee / Supervisor / Admin."
      footerLink={
        <>
          New employee?{" "}
          <Link className="text-blue-700 font-semibold underline" href="/register">
            Register
          </Link>
        </>
      }
    >
      <form
        className="space-y-3"
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
      </form>
    </AuthShell>
  );
}
