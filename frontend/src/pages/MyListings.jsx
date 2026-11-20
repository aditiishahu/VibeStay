import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api, { errMsg } from "../api";
import ListingCard from "../components/ListingCard.jsx";
import { Button, Notice } from "../components/ui.jsx";

export default function MyListings() {
  const [rows, setRows] = useState([]);
  const [error, setError] = useState("");

  const load = () => api.get("/listings/mine").then((r) => setRows(r.data)).catch((e) => setError(errMsg(e)));
  useEffect(() => { load(); }, []);

  const toggle = async (id) => {
    try { await api.patch(`/listings/${id}/toggle`); load(); } catch (e) { setError(errMsg(e)); }
  };

  return (
    <div>
      <h1 className="mb-4 font-display text-2xl font-bold">My listings</h1>
      <Notice>{error}</Notice>
      {rows.length === 0 ? (
        <p className="rounded-lg border border-dashed border-line p-10 text-center text-muted">
          You have not posted a room yet. <Link to="/post" className="text-marigold">Post your first room</Link>.
        </p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {rows.map((l) => (
            <ListingCard key={l.id} l={l} footer={
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted">{l.is_active ? "Visible to seekers" : "Hidden"}</span>
                <Button variant="ghost" onClick={() => toggle(l.id)}>{l.is_active ? "Hide listing" : "Show listing"}</Button>
              </div>
            } />
          ))}
        </div>
      )}
    </div>
  );
}
