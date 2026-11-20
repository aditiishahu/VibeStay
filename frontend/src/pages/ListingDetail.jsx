import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api, { errMsg } from "../api";
import { useAuth } from "../AuthContext.jsx";
import { Button, Field, Notice, Tag, inputCls, rupees, genderLabel } from "../components/ui.jsx";

export default function ListingDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const [l, setL] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [done, setDone] = useState("");

  useEffect(() => {
    api.get(`/listings/${id}`).then((r) => setL(r.data)).catch((e) => setError(errMsg(e)));
  }, [id]);

  const send = async (e) => {
    e.preventDefault();
    setError(""); setDone("");
    try {
      await api.post("/requests", { listing_id: Number(id), message });
      setDone("Request sent. The owner's contact details appear under Requests once they accept.");
      setMessage("");
    } catch (err) {
      setError(errMsg(err));
    }
  };

  if (!l) return <Notice>{error}</Notice>;
  const isOwner = user?.id === l.owner_id;

  return (
    <div className="mx-auto max-w-3xl">
      <Link to="/" className="text-sm text-muted hover:text-paper">Back to all rooms</Link>
      <h1 className="mt-3 font-display text-3xl font-bold">{l.title}</h1>
      <p className="mt-1 text-muted">{l.location}, {l.city} · listed by {l.owner_name}</p>
      <p className="mt-4 font-display text-3xl font-bold text-marigold">
        {rupees(l.rent)}<span className="text-sm font-normal text-muted"> per month</span>
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        <Tag>For {genderLabel[l.available_for]}</Tag>
        <Tag>Routine: {l.sleep_schedule}</Tag>
        <Tag>Diet: {l.diet_preference}</Tag>
      </div>
      {l.description && <p className="mt-6 max-w-prose leading-relaxed">{l.description}</p>}
      {l.amenities && (
        <div className="mt-6">
          <h2 className="font-display text-lg font-bold">Amenities</h2>
          <div className="mt-2 flex flex-wrap gap-2">
            {l.amenities.split(",").map((a) => <Tag key={a}>{a.trim()}</Tag>)}
          </div>
        </div>
      )}

      <section className="mt-10 rounded-lg border border-line bg-panel p-5">
        <h2 className="font-display text-lg font-bold">Interested in this room?</h2>
        <Notice>{error}</Notice>
        <Notice kind="ok">{done}</Notice>
        {!user ? (
          <p className="mt-2 text-sm text-muted">
            <Link to="/login" className="text-marigold">Log in</Link> or <Link to="/register" className="text-marigold">sign up</Link> to send a request.
          </p>
        ) : isOwner ? (
          <p className="mt-2 text-sm text-muted">This is your own listing.</p>
        ) : (
          <form onSubmit={send} className="mt-3 space-y-3">
            <Field label="Tell the owner about yourself">
              <textarea rows={4} className={inputCls} value={message} onChange={(e) => setMessage(e.target.value)}
                placeholder="Your course, daily routine, diet and move-in date" />
            </Field>
            <Button type="submit">Send request</Button>
          </form>
        )}
      </section>
    </div>
  );
}
