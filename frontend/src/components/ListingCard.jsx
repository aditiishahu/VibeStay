import { Link } from "react-router-dom";
import { Tag, rupees, genderLabel } from "./ui.jsx";

export default function ListingCard({ l, footer }) {
  return (
    <article className={`flex flex-col rounded-lg border border-line bg-panel p-5 ${l.is_active ? "" : "opacity-60"}`}>
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-display text-lg font-bold leading-snug">
          <Link to={`/listings/${l.id}`} className="hover:text-marigold">{l.title}</Link>
        </h3>
        <p className="shrink-0 font-display text-lg font-bold text-marigold">
          {rupees(l.rent)}<span className="text-xs font-normal text-muted">/mo</span>
        </p>
      </div>
      <p className="mt-1 text-sm text-muted">{l.location}, {l.city}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        <Tag>For {genderLabel[l.available_for]}</Tag>
        {l.sleep_schedule !== "any" && <Tag>{l.sleep_schedule}</Tag>}
        {l.diet_preference !== "any" && <Tag>{l.diet_preference}</Tag>}
      </div>
      {footer && <div className="mt-4 border-t border-line pt-4">{footer}</div>}
    </article>
  );
}
