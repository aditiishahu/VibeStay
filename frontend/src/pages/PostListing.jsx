import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api, { errMsg } from "../api";
import { Button, Field, Notice, inputCls } from "../components/ui.jsx";

export default function PostListing() {
  const nav = useNavigate();
  const [f, setF] = useState({
    title: "", description: "", city: "", location: "", rent: "", amenities: "",
    available_for: "any", diet_preference: "any", sleep_schedule: "any",
  });
  const [error, setError] = useState("");
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const { data } = await api.post("/listings", { ...f, rent: Number(f.rent) });
      nav(`/listings/${data.id}`);
    } catch (err) {
      setError(errMsg(err));
    }
  };

  return (
    <form onSubmit={submit} className="mx-auto max-w-2xl space-y-4 rounded-lg border border-line bg-panel p-6">
      <h1 className="font-display text-2xl font-bold">Post a room</h1>
      <Notice>{error}</Notice>
      <Field label="Title"><input required className={inputCls} value={f.title} onChange={set("title")} placeholder="Single bed in 2BHK near Powai" /></Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="City"><input required className={inputCls} value={f.city} onChange={set("city")} /></Field>
        <Field label="Area or locality"><input required className={inputCls} value={f.location} onChange={set("location")} /></Field>
        <Field label="Rent per month (₹)"><input required type="number" min="1" className={inputCls} value={f.rent} onChange={set("rent")} /></Field>
        <Field label="Available for">
          <select className={inputCls} value={f.available_for} onChange={set("available_for")}>
            <option value="any">Anyone</option><option value="male">Boys</option><option value="female">Girls</option>
          </select>
        </Field>
        <Field label="Diet in the house">
          <select className={inputCls} value={f.diet_preference} onChange={set("diet_preference")}>
            <option value="any">No preference</option><option value="veg">Vegetarian</option><option value="non-veg">Non-vegetarian</option>
          </select>
        </Field>
        <Field label="Daily routine">
          <select className={inputCls} value={f.sleep_schedule} onChange={set("sleep_schedule")}>
            <option value="any">No preference</option><option value="early bird">Early bird</option><option value="night owl">Night owl</option>
          </select>
        </Field>
      </div>
      <Field label="Amenities (comma separated)"><input className={inputCls} value={f.amenities} onChange={set("amenities")} placeholder="WiFi, Laundry, Meals" /></Field>
      <Field label="Description and house rules"><textarea rows={4} className={inputCls} value={f.description} onChange={set("description")} /></Field>
      <Button type="submit">Publish listing</Button>
    </form>
  );
}
