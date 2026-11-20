import { useEffect, useState } from "react";
import api, { errMsg } from "../api";
import { Button, Notice, StatusPill } from "../components/ui.jsx";

export default function Requests() {
  const [tab, setTab] = useState("received");
  const [rows, setRows] = useState([]);
  const [error, setError] = useState("");

  const load = () =>
    api.get(`/requests/${tab}`).then((r) => setRows(r.data)).catch((e) => setError(errMsg(e)));
  useEffect(() => { setRows([]); load(); }, [tab]);

  const decide = async (id, status) => {
    try { await api.patch(`/requests/${id}`, { status }); load(); } catch (e) { setError(errMsg(e)); }
  };

  const tabCls = (t) =>
    `rounded-md px-4 py-1.5 text-sm ${tab === t ? "bg-panel text-marigold" : "text-muted hover:text-paper"}`;

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="mb-4 font-display text-2xl font-bold">Requests</h1>
      <div className="mb-4 flex gap-1">
        <button className={tabCls("received")} onClick={() => setTab("received")}>For my rooms</button>
        <button className={tabCls("sent")} onClick={() => setTab("sent")}>Sent by me</button>
      </div>
      <Notice>{error}</Notice>
      {rows.length === 0 ? (
        <p className="rounded-lg border border-dashed border-line p-10 text-center text-muted">
          {tab === "received" ? "No one has requested your rooms yet." : "You have not sent any requests yet."}
        </p>
      ) : (
        <ul className="space-y-3">
          {rows.map((r) => (
            <li key={r.id} className="rounded-lg border border-line bg-panel p-5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="font-medium">
                  {tab === "received" ? `${r.requester_name} wants` : "You asked about"} {r.listing_title}
                </p>
                <StatusPill status={r.status} />
              </div>
              {r.message && <p className="mt-2 text-sm text-muted">“{r.message}”</p>}
              {r.contact_email && (
                <p className="mt-3 text-sm text-ok">Contact: {r.contact_email}</p>
              )}
              {tab === "received" && r.status === "pending" && (
                <div className="mt-4 flex gap-2">
                  <Button variant="ok" onClick={() => decide(r.id, "accepted")}>Accept</Button>
                  <Button variant="danger" onClick={() => decide(r.id, "rejected")}>Decline</Button>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
