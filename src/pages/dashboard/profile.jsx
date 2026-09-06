import Protected from "@/components/Protected";
import Layout from "@/components/Layout";
import PageHeader from "@/components/PageHeader";
import { useAuth } from "@/context/AuthContext";

function InfoCard({ label, value, hint }) {
  return (
    <div className="card">
      <div className="card-bd">
        <div className="text-xs muted2 uppercase tracking-wider font-semibold">{label}</div>
        <div className="mt-2 text-lg md:text-xl font-extrabold text-slate-900 wrap-anywhere">
          {value || "—"}
        </div>
        {hint ? <div className="text-xs muted mt-2">{hint}</div> : null}
      </div>
    </div>
  );
}

export default function Profile() {
  const { user } = useAuth();

  return (
    <Protected>
      <Layout>
        <PageHeader
          title="Profile"
          description="Your account identity, access role and department mapping."
        />

        {!user?.department ? (
          <div className="mt-4 rounded-2xl border bg-amber-50 p-4" style={{ borderColor: "rgba(217,119,6,.25)" }}>
            <div className="font-bold text-slate-900">Department not assigned</div>
            <div className="text-sm text-slate-700 mt-1">
              Admin ko boliye: Department assign karein, tabhi aapko department KPIs aur proper work submission options milenge.
            </div>
          </div>
        ) : null}

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 mt-4">
          <InfoCard label="Employee ID" value={user?.employeeId} />
          <InfoCard label="Role" value={user?.role} hint="Role-based access control enabled" />
          <InfoCard label="Email" value={user?.email} />
          <InfoCard
            label="Department"
            value={user?.department?.name || "Not assigned"}
            hint={user?.department?.code ? `Code: ${user.department.code}` : ""}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 mt-4">
          <div className="card">
            <div className="card-hd">
              <div className="font-extrabold tracking-tight text-slate-900">Security</div>
              <div className="text-xs muted mt-1">Session handled using HttpOnly cookie + JWT.</div>
            </div>
            <div className="card-bd text-sm muted leading-relaxed">
              • Cookies are not accessible to JS (reduces XSS token theft).<br />
              • Server validates role for admin/supervisor routes.<br />
              • Audit-ready actions available via exports & logs (Phase‑1).
            </div>
          </div>

          <div className="card">
            <div className="card-hd">
              <div className="font-extrabold tracking-tight text-slate-900">Usage Tips</div>
              <div className="text-xs muted mt-1">Quick checklist for smooth evaluation cycle.</div>
            </div>
            <div className="card-bd text-sm muted leading-relaxed">
              1) Submit work logs monthly with evidence URL.<br />
              2) Supervisor approves/rejects with remarks + score (0–100).<br />
              3) Download CSV/PDF from Reports for appraisal documentation.
            </div>
          </div>
        </div>
      </Layout>
    </Protected>
  );
}
