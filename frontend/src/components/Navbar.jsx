import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext.jsx";

const link = ({ isActive }) =>
  `rounded-md px-3 py-1.5 text-sm transition ${
    isActive ? "bg-panel text-marigold" : "text-muted hover:text-paper"
  }`;

export default function Navbar() {
  const { user, logout } = useAuth();
  const nav = useNavigate();

  return (
    <header className="sticky top-0 z-20 border-b border-line bg-ink/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-2 px-4 py-3">
        <Link to="/" className="mr-4 font-display text-xl font-bold tracking-tight">
          Vibe<span className="text-marigold">Stay</span>
        </Link>
        <nav className="flex flex-1 flex-wrap items-center gap-1">
          <NavLink to="/" end className={link}>Find a room</NavLink>
          {user && <NavLink to="/post" className={link}>Post a room</NavLink>}
          {user && <NavLink to="/my-listings" className={link}>My listings</NavLink>}
          {user && <NavLink to="/requests" className={link}>Requests</NavLink>}
          {user?.role === "admin" && <NavLink to="/admin" className={link}>Admin</NavLink>}
        </nav>
        {user ? (
          <div className="flex items-center gap-3 text-sm">
            <span className="text-muted">{user.name}</span>
            <button
              onClick={() => { logout(); nav("/"); }}
              className="rounded-md border border-line px-3 py-1.5 text-muted hover:text-paper"
            >
              Log out
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-sm">
            <Link to="/login" className="px-3 py-1.5 text-muted hover:text-paper">Log in</Link>
            <Link to="/register" className="rounded-md bg-marigold px-3 py-1.5 font-medium text-ink hover:brightness-110">
              Sign up
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
