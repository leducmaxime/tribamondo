"use client";
import { useState } from "react";

export function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json() as { success?: boolean; error?: string };

      if (data.success) {
        localStorage.setItem("admin_access", "true");
        window.location.href = "/admin";
      } else {
        setError(data.error || "Login failed");
      }
    } catch (err) {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center py-20">
      <div className="w-full max-w-md rounded-2xl border border-red-500/30 bg-black/50 p-6 sm:p-8 backdrop-blur-sm mx-4 sm:mx-auto">
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-center mb-6 sm:mb-8">
          Admin <span className="text-primary">Login</span>
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Utilisateur</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full rounded-lg border border-red-500/30 bg-black/40 px-4 py-3 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Mot de passe</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-red-500/30 bg-black/40 px-4 py-3 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              required
            />
          </div>

          {error && (
            <div className="rounded-lg border border-red-500 bg-red-950/30 px-4 py-3 text-red-400 text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-primary py-3 font-semibold hover:bg-primary-dark disabled:opacity-50 transition-all active:scale-[0.98]"
          >
            {loading ? "Connexion..." : "Se connecter"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-white/50">
          Accès restreint aux administrateurs.
        </p>
      </div>
    </div>
  );
}
