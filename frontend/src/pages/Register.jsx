import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext.jsx";
import { errMsg } from "../api";
import { Button, Field, Notice, inputCls } from "../components/ui.jsx";

export default function Register() {
  const { register } = useAuth();
  const nav = useNavigate();
  const [f, setF] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await register(f.name, f.email, f.password);
      nav("/");
    } catch (err) {
      setError(errMsg(err));
    }
  };

  return (
    <form onSubmit={submit} className="mx-auto mt-10 max-w-sm space-y-4 rounded-lg border border-line bg-panel p-6">
      <h1 className="font-display text-2xl font-bold">Create your account</h1>
      <Notice>{error}</Notice>
      <Field label="Full name"><input required className={inputCls} value={f.name} onChange={set("name")} /></Field>
      <Field label="Email"><input type="email" required className={inputCls} value={f.email} onChange={set("email")} /></Field>
      <Field label="Password (at least 6 characters)"><input type="password" required minLength={6} className={inputCls} value={f.password} onChange={set("password")} /></Field>
      <Button type="submit" className="w-full">Sign up</Button>
      <p className="text-sm text-muted">Already have an account? <Link to="/login" className="text-marigold">Log in</Link></p>
    </form>
  );
}
