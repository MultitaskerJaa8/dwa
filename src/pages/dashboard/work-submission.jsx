import { useEffect, useState } from "react";
import Protected from "@/components/Protected";
import Layout from "@/components/Layout";
import WorkLogForm from "@/components/WorkLogForm";
import { api } from "@/lib/apiClient";

export default function WorkSubmission() {
  const [kpis, setKpis] = useState([]);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  async function load() {
    const data = await api("/api/kpis");
    setKpis(data.kpis || []);
  }

  useEffect(() => {
    load().catch((e) => setErr(e.message));
  }, []);

  return (
    <Protected>
      <Layout>
        <h1 className="text-2xl font-black">Work Submission</h1>
        <p className="text-white/60 text-sm mt-1">Submit KPI work log with evidence for supervisor review.</p>

        {err ? <div className="mt-3 text-sm text-red-300">{err}</div> : null}
        {msg ? <div className="mt-3 text-sm text-green-300">{msg}</div> : null}

        <div className="mt-4">
          {kpis.length ? (
            <WorkLogForm
              kpis={kpis}
              busy={busy}
              onSubmit={async (payload) => {
                setErr("");
                setMsg("");
                try {
                  setBusy(true);
                  await api("/api/worklogs", { method: "POST", body: JSON.stringify(payload) });
                  setMsg("Submitted successfully. Status: Pending approval.");
                } catch (e) {
                  setErr(e.message);
                } finally {
                  setBusy(false);
                }
              }}
            />
          ) : (
            <div className="card text-white/70">No KPIs available for submission. Contact Admin.</div>
          )}
        </div>
      </Layout>
    </Protected>
  );
}