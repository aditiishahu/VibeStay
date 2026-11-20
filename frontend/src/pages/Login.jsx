import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext.jsx";
import { errMsg } from "../api";
import { Button, Field, Notice, inputCls } from "../components/ui.jsx";

export default function Login() {
  const { login } = useAuth();
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const u = await login(email, password);
      nav(u.role === "admin" ? "/admin" : "/");
    } catch (err) {
      setError(errMsg(err));
    }
  };

  return (
    <form onSubmit={submit} className="mx-auto mt-10 max-w-sm space-y-4 rounded-lg border border-line bg-panel p-6">
      <h1 className="font-display text-2xl font-bold">Log in</h1>
      <Notice>{error}</Notice>
      <Field label="Email"><input type="email" required className={inputCls} value={email} onChange={(e) => setEmail(e.target.value)} /></Field>
      <Field label="Password"><input type="password" required className={inputCls} value={password} onChange={(e) => setPassword(e.target.value)} /></Field>
      <Button type="submit" className="w-full">Log in</Button>
      <p className="text-sm text-muted">New here? <Link to="/register" className="text-marigold">Create an account</Link></p>
    </form>
  );
}
