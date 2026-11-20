import { useEffect, useState } from "react";
import api, { errMsg } from "../api";
import { Button, Notice, StatusPill, rupees } from "../components/ui.jsx";

export default function Admin() {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [listings, setListings] = useState([]);
  const [requests, setRequests] = useState([]);
  const [error, setError] = useState("");

  const load = async () => {
    try {
      const [s, u, l, r] = await Promise.all([
        api.get("/admin/stats"), api.get("/admin/users"),
        api.get("/admin/listings"), api.get("/admin/requests"),
      ]);
      setStats(s.data); setUsers(u.data); setListings(l.data); setRequests(r.data);
    } catch (e) { setError(errMsg(e)); }
  };
  useEffect(() => { load(); }, []);

  const toggle = async (path) => {
    try { await api.patch(path); load(); } catch (e) { setError(errMsg(e)); }
  };

  const th = "px-3 py-2 text-left font-medium text-muted";
  const td = "px-3 py-2";
  const wrap = "overflow-x-auto rounded-lg border border-line bg-panel";

  return (
    <div className="space-y-10">
      <h1 className="font-display text-2xl font-bold">Admin dashboard</h1>
      <Notice>{error}</Notice>

      {stats && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[["Users", stats.users], ["Listings", stats.listings], ["Active listings", stats.active_listings], ["Requests", stats.requests]].map(([k, v]) => (
            <div key={k} className="rounded-lg border border-line bg-panel p-4">
              <p className="font-display text-3xl font-bold text-marigold">{v}</p>
              <p className="text-sm text-muted">{k}</p>
            </div>
          ))}
        </div>
      )}

      <section>
        <h2 className="mb-2 font-display text-lg font-bold">Users</h2>
        <div className={wrap}><table className="w-full text-sm">
          <thead><tr><th className={th}>Name</th><th className={th}>Email</th><th className={th}>Role</th><th className={th}>Status</th><th className={th}></th></tr></thead>
          <tbody>{users.map((u) => (
            <tr key={u.id} className="border-t border-line">
              <td className={td}>{u.name}</td><td className={td}>{u.email}</td><td className={td}>{u.role}</td>
              <td className={td}>{u.is_active ? "Active" : "Disabled"}</td>
              <td className={td}>{u.role !== "admin" && (
                <Button variant="ghost" onClick={() => toggle(`/admin/users/${u.id}/toggle`)}>{u.is_active ? "Disable" : "Enable"}</Button>
              )}</td>
            </tr>))}
          </tbody></table></div>
      </section>

      <section>
        <h2 className="mb-2 font-display text-lg font-bold">Listings</h2>
        <div className={wrap}><table className="w-full text-sm">
          <thead><tr><th className={th}>Title</th><th className={th}>Owner</th><th className={th}>City</th><th className={th}>Rent</th><th className={th}>Status</th><th className={th}></th></tr></thead>
          <tbody>{listings.map((l) => (
            <tr key={l.id} className="border-t border-line">
              <td className={td}>{l.title}</td><td className={td}>{l.owner_name}</td><td className={td}>{l.city}</td>
              <td className={td}>{rupees(l.rent)}</td><td className={td}>{l.is_active ? "Active" : "Disabled"}</td>
              <td className={td}><Button variant="ghost" onClick={() => toggle(`/admin/listings/${l.id}/toggle`)}>{l.is_active ? "Disable" : "Enable"}</Button></td>
            </tr>))}
          </tbody></table></div>
      </section>

      <section>
        <h2 className="mb-2 font-display text-lg font-bold">All requests</h2>
        <div className={wrap}><table className="w-full text-sm">
          <thead><tr><th className={th}>Seeker</th><th className={th}>Listing</th><th className={th}>Message</th><th className={th}>Status</th></tr></thead>
          <tbody>{requests.map((r) => (
            <tr key={r.id} className="border-t border-line">
              <td className={td}>{r.requester_name}</td><td className={td}>{r.listing_title}</td>
              <td className={`${td} max-w-xs truncate text-muted`}>{r.message}</td>
              <td className={td}><StatusPill status={r.status} /></td>
            </tr>))}
          </tbody></table></div>
      </section>
    </div>
  );
}
