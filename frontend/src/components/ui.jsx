// Small shared building blocks styled with Tailwind
export const inputCls =
  "w-full rounded-md border border-line bg-ink px-3 py-2 text-sm text-paper placeholder:text-muted focus:border-marigold focus:outline-none focus:ring-1 focus:ring-marigold";

export function Field({ label, children }) {
  return (
    <label className="block text-sm">
      <span className="mb-1 block text-muted">{label}</span>
      {children}
    </label>
  );
}

export function Button({ children, variant = "primary", className = "", ...rest }) {
  const styles = {
    primary: "bg-marigold text-ink hover:brightness-110",
    ghost: "border border-line text-paper hover:border-muted",
    ok: "bg-ok text-ink hover:brightness-110",
    danger: "border border-bad/60 text-bad hover:bg-bad/10",
  };
  return (
    <button
      {...rest}
      className={`rounded-md px-4 py-2 text-sm font-medium transition disabled:opacity-50 ${styles[variant]} ${className}`}
    >
      {children}
    </button>
  );
}

export function Notice({ kind = "error", children }) {
  if (!children) return null;
  const c = kind === "error" ? "border-bad/50 text-bad" : "border-ok/50 text-ok";
  return <p role="alert" className={`mb-4 rounded-md border px-3 py-2 text-sm ${c}`}>{children}</p>;
}

export function Tag({ children }) {
  return (
    <span className="rounded-full border border-line px-2.5 py-0.5 text-xs text-muted">{children}</span>
  );
}

export function StatusPill({ status }) {
  const c = {
    pending: "bg-marigold/15 text-marigold",
    accepted: "bg-ok/15 text-ok",
    rejected: "bg-bad/15 text-bad",
  }[status];
  return <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${c}`}>{status}</span>;
}

export const rupees = (n) => "₹" + Number(n).toLocaleString("en-IN");

export const genderLabel = { male: "Boys", female: "Girls", any: "Anyone" };
