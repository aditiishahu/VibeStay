import { useEffect, useState } from "react";
import api, { errMsg } from "../api";
import ListingCard from "../components/ListingCard.jsx";
import { Field, Button, Notice, inputCls } from "../components/ui.jsx";

const empty = { city: "", locality: "", min_rent: "", max_rent: "", available_for: "", diet: "", sleep: "" };

export default function Home() {
  const [f, setF] = useState(empty);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const search = async (filters = f) => {
    setLoading(true);
    setError("");
    const params = Object.fromEntries(Object.entries(filters).filter(([, v]) => v !== ""));
    try {
      const { data } = await api.get("/listings", { params });
      setRows(data);
    } catch (e) {
      setError(errMsg(e));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { search(empty); }, []);
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  return (
    <div>
      <section className="py-8">
        <h1 className="max-w-2xl font-display text-4xl font-bold leading-tight sm:text-5xl">
          Find a room, and a roommate whose routine matches yours.
        </h1>
        <p className="mt-3 max-w-xl text-muted">
          Filter by budget, area and lifestyle. Send a request straight to the owner, with no broker in between.
        </p>
      </section>

      <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
        <form
          onSubmit={(e) => { e.preventDefault(); search(); }}
          className="h-fit space-y-4 rounded-lg border border-line bg-panel p-5 lg:sticky lg:top-20"
        >
          <Field label="City"><input className={inputCls} value={f.city} onChange={set("city")} placeholder="Mumbai" /></Field>
          <Field label="Area or locality"><input className={inputCls} value={f.locality} onChange={set("locality")} placeholder="Powai" /></Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Min rent"><input type="number" min="0" className={inputCls} value={f.min_rent} onChange={set("min_rent")} /></Field>
            <Field label="Max rent"><input type="number" min="0" className={inputCls} value={f.max_rent} onChange={set("max_rent")} /></Field>
          </div>
          <Field label="I am looking as">
            <select className={inputCls} value={f.available_for} onChange={set("available_for")}>
              <option value="">Any</option><option value="male">Boy</option><option value="female">Girl</option>
            </select>
          </Field>
          <Field label="Diet">
            <select className={inputCls} value={f.diet} onChange={set("diet")}>
              <option value="">Any</option><option value="veg">Vegetarian</option><option value="non-veg">Non-vegetarian</option>
            </select>
          </Field>
          <Field label="Daily routine">
            <select className={inputCls} value={f.sleep} onChange={set("sleep")}>
              <option value="">Any</option><option value="early bird">Early bird</option><option value="night owl">Night owl</option>
            </select>
          </Field>
          <div className="flex gap-2">
            <Button type="submit" className="flex-1">Search</Button>
            <Button type="button" variant="ghost" onClick={() => { setF(empty); search(empty); }}>Reset</Button>
          </div>
        </form>

        <section>
          <Notice>{error}</Notice>
          {loading ? (
            <p className="text-muted">Loading rooms…</p>
          ) : rows.length === 0 ? (
            <p className="rounded-lg border border-dashed border-line p-10 text-center text-muted">
              No rooms match these filters. Try a wider budget or clear a filter.
            </p>
          ) : (
            <>
              <p className="mb-3 text-sm text-muted">{rows.length} room{rows.length > 1 ? "s" : ""} found</p>
              <div className="grid gap-4 md:grid-cols-2">
                {rows.map((l) => <ListingCard key={l.id} l={l} />)}
              </div>
            </>
          )}
        </section>
      </div>
    </div>
  );
}
