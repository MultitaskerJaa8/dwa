import { useEffect, useState } from "react";
import Protected from "@/components/Protected";
import Layout from "@/components/Layout";
import ApprovalTable from "@/components/ApprovalTable";
import { api } from "@/lib/apiClient";

export default function Approvals() {
  const [pending, setPending] = useState([]);
  const [err, setErr] = useState("");

  async function load() {
    const data = await api("/api/worklogs/pending");
    setPending(data.pending || []);
  }

  useEffect(() => {
    load().catch((e) => setErr(e.message));
  }, []);

  return (
    <Protected roles={["Supervisor", "Admin"]}>
      <Layout>
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div>
            <h1 className="text-2xl font-black">Approvals</h1>
            <p className="text-white/60 text-sm mt-1">Verify evidence, approve/reject, assign score.</p>
          </div>
          <button className="btn btn-ghost" onClick={() => load().catch((e) => setErr(e.message))}>Refresh</button>
        </div>

        {err ? <div className="mt-3 text-sm text-red-300">{err}</div> : null}

        <div className="mt-4">
          <ApprovalTable
            rows={pending}
            onReview={async (id, payload) => {
              await api(`/api/worklogs/${id}/review`, {
                method: "POST",
                body: JSON.stringify(payload)
              });
              await load();
            }}
          />
        </div>
      </Layout>
    </Protected>
  );
}