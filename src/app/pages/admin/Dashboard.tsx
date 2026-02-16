"use client";
import { useEffect, useState } from "react";
import { Calendar, Video, LogOut, Music } from "lucide-react";

export function AdminDashboard() {
  const [username, setUsername] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  async function checkAuth() {
    try {
      const res = await fetch("/api/auth/check");
      const data = await res.json() as { authenticated: boolean; username?: string };
      
      if (!data.authenticated) {
        window.location.href = "/admin/login";
        return;
      }
      
      setUsername(data.username || "Admin");
    } catch (error) {
      window.location.href = "/admin/login";
    } finally {
      setLoading(false);
    }
  }

  async function handleLogout() {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      localStorage.removeItem("admin_access");
      window.location.href = "/admin/login";
    } catch (error) {
      console.error("Logout failed", error);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-xl">Chargement...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-20">
      <div className="container max-w-6xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="font-display text-4xl font-bold mb-2">
              Administration <span className="text-primary">TriBa MonDo</span>
            </h1>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 rounded-full border border-red-500/30 bg-black/40 px-6 py-3 hover:bg-red-950/40 transition-all active:scale-95"
          >
            <LogOut className="h-5 w-5" />
            Déconnexion
          </button>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <a
            href="/admin/concerts"
            className="group rounded-2xl border border-red-500/30 bg-black/50 p-8 backdrop-blur-sm transition-all hover:border-primary hover:bg-red-950/40 hover:shadow-2xl hover:shadow-primary/20"
          >
            <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-red-950/50">
              <Calendar className="h-8 w-8 text-primary" />
            </div>
            <h2 className="font-display text-2xl font-bold mb-2 group-hover:text-primary transition-colors">
              Gestion des Concerts
            </h2>
            <p className="text-white/60">
              Ajouter, modifier ou supprimer les dates de concerts à venir.
            </p>
          </a>

          <a
            href="/admin/videos"
            className="group rounded-2xl border border-red-500/30 bg-black/50 p-8 backdrop-blur-sm transition-all hover:border-primary hover:bg-red-950/40 hover:shadow-2xl hover:shadow-primary/20"
          >
            <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-red-950/50">
              <Video className="h-8 w-8 text-primary" />
            </div>
            <h2 className="font-display text-2xl font-bold mb-2 group-hover:text-primary transition-colors">
              Gestion des Vidéos
            </h2>
            <p className="text-white/60">
              Gérer les vidéos YouTube affichées sur la page Musique.
            </p>
          </a>

          <a
            href="/admin/soundcloud"
            className="group rounded-2xl border border-red-500/30 bg-black/50 p-8 backdrop-blur-sm transition-all hover:border-primary hover:bg-red-950/40 hover:shadow-2xl hover:shadow-primary/20"
          >
            <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-red-950/50">
              <Music className="h-8 w-8 text-primary" />
            </div>
            <h2 className="font-display text-2xl font-bold mb-2 group-hover:text-primary transition-colors">
              Gestion SoundCloud
            </h2>
            <p className="text-white/60">
              Ajouter ou modifier les sons SoundCloud de la page Musique.
            </p>
          </a>
        </div>
      </div>
    </div>
  );
}
