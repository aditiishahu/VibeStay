import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext.jsx";
import Navbar from "./components/Navbar.jsx";
import Home from "./pages/Home.jsx";
import ListingDetail from "./pages/ListingDetail.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import PostListing from "./pages/PostListing.jsx";
import MyListings from "./pages/MyListings.jsx";
import Requests from "./pages/Requests.jsx";
import Admin from "./pages/Admin.jsx";

function Protected({ children, admin = false }) {
  const { user, loading } = useAuth();
  if (loading) return <p className="p-10 text-muted">Loading…</p>;
  if (!user) return <Navigate to="/login" replace />;
  if (admin && user.role !== "admin") return <Navigate to="/" replace />;
  return children;
}

export default function App() {
  return (
    <div className="min-h-screen bg-ink font-sans text-paper">
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 pb-20 pt-6">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/listings/:id" element={<ListingDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/post" element={<Protected><PostListing /></Protected>} />
          <Route path="/my-listings" element={<Protected><MyListings /></Protected>} />
          <Route path="/requests" element={<Protected><Requests /></Protected>} />
          <Route path="/admin" element={<Protected admin><Admin /></Protected>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}
