"use client";
import { useState, useEffect } from "react";
import type { YouTubeVideo } from "@/types/database";
import { Trash2, Edit, Plus, X, Save, ChevronLeft, LogOut } from "lucide-react";

export function VideosAdmin() {
  const [videos, setVideos] = useState<YouTubeVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<Partial<YouTubeVideo>>({});

  useEffect(() => {
    checkAuth();
  }, []);

  async function checkAuth() {
    try {
      const res = await fetch("/api/auth/check");
      const data = await res.json() as { authenticated: boolean };
      if (!data.authenticated) {
        window.location.href = "/admin/login";
        return;
      }
      fetchVideos();
    } catch {
      window.location.href = "/admin/login";
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

  async function fetchVideos() {
    try {
      const res = await fetch("/api/videos");
      const data = await res.json() as { success: boolean; data: YouTubeVideo[] };
      if (data.success) {
        setVideos(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch videos", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    const method = editing !== null ? "PUT" : "POST";
    const url = editing !== null ? `/api/videos/${editing}` : "/api/videos";

    let youtube_id = form.youtube_id;
    if (youtube_id && (youtube_id.includes("youtube.com") || youtube_id.includes("youtu.be"))) {
      try {
        const urlObj = new URL(youtube_id);
        if (youtube_id.includes("youtu.be")) {
          youtube_id = urlObj.pathname.slice(1);
        } else {
          youtube_id = urlObj.searchParams.get("v") || youtube_id;
        }
      } catch (e) {
        console.error("Invalid URL", e);
      }
    }

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, youtube_id }),
      });

      if (res.ok) {
        await fetchVideos();
        setForm({});
        setEditing(null);
        setShowForm(false);
      }
    } catch (error) {
      console.error("Failed to save video", error);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cette vidéo ?")) return;

    try {
      await fetch(`/api/videos/${id}`, { method: "DELETE" });
      await fetchVideos();
    } catch (error) {
      console.error("Failed to delete video", error);
    }
  }

  function handleEdit(video: YouTubeVideo) {
    setForm(video);
    setEditing(video.id!);
    setShowForm(true);
  }

  function handleNew() {
    setForm({ order_index: videos.length + 1 });
    setEditing(null);
    setShowForm(true);
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
        <div className="mb-6">
          <a
            href="/admin"
            className="inline-flex items-center gap-2 text-white/50 hover:text-primary transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
            Retour au Dashboard
          </a>
        </div>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
          <h1 className="font-display text-3xl sm:text-4xl font-bold">
            Gestion des <span className="text-primary">Vidéos</span>
          </h1>
          <div className="flex items-center gap-3 sm:gap-4">
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 rounded-full border border-red-500/30 bg-black/40 px-4 py-2.5 sm:px-6 sm:py-3 hover:bg-red-950/40 transition-all active:scale-95 text-sm sm:text-base"
            >
              <LogOut className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="hidden xs:inline">Déconnexion</span>
            </button>
            <button
              onClick={handleNew}
              className="flex items-center gap-2 rounded-full bg-primary px-4 py-2.5 sm:px-6 sm:py-3 font-semibold hover:bg-primary-dark transition-all active:scale-95 text-sm sm:text-base"
            >
              <Plus className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="hidden xs:inline">Nouvelle Vidéo</span>
              <span className="xs:hidden">Nouvelle</span>
            </button>
          </div>
        </div>

        {showForm && (
          <div className="mb-8 rounded-2xl border border-red-500/30 bg-black/50 p-4 sm:p-6 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-xl sm:text-2xl font-bold">
                {editing !== null ? "Modifier" : "Nouvelle"} Vidéo
              </h2>
              <button
                onClick={() => {
                  setShowForm(false);
                  setForm({});
                  setEditing(null);
                }}
                className="text-white/50 hover:text-white"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Lien YouTube</label>
                <input
                  type="text"
                  value={form.youtube_id || ""}
                  onChange={(e) => setForm({ ...form, youtube_id: e.target.value })}
                  className="w-full rounded-lg border border-red-500/30 bg-black/40 px-4 py-3 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  placeholder="https://www.youtube.com/watch?v=..."
                  required
                />
                <p className="mt-1 text-xs text-white/40">
                  Collez le lien complet de la vidéo YouTube.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Titre</label>
                <input
                  type="text"
                  value={form.title || ""}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full rounded-lg border border-red-500/30 bg-black/40 px-4 py-3 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Type</label>
                <input
                  type="text"
                  value={form.type || ""}
                  onChange={(e) => setForm({ ...form, type: e.target.value })}
                  className="w-full rounded-lg border border-red-500/30 bg-black/40 px-4 py-3 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  placeholder="Live recording — Mai 2024"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <textarea
                  value={form.description || ""}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full rounded-lg border border-red-500/30 bg-black/40 px-4 py-3 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  rows={4}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Ordre d'affichage</label>
                <input
                  type="number"
                  value={form.order_index || 1}
                  onChange={(e) => setForm({ ...form, order_index: parseInt(e.target.value) })}
                  className="w-full rounded-lg border border-red-500/30 bg-black/40 px-4 py-3 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  min="1"
                />
              </div>

              <button
                onClick={handleSave}
                className="flex items-center gap-2 rounded-full bg-primary px-6 py-3 font-semibold hover:bg-primary-dark transition-all active:scale-95"
              >
                <Save className="h-5 w-5" />
                Enregistrer
              </button>
            </div>
          </div>
        )}

        <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
          {videos.length === 0 ? (
            <div className="col-span-2 rounded-2xl border border-red-500/30 bg-black/50 p-12 text-center backdrop-blur-sm">
              <p className="text-white/50">Aucune vidéo pour le moment.</p>
            </div>
          ) : (
            videos.map((video) => (
              <div
                key={video.id}
                className="group flex flex-col overflow-hidden rounded-2xl border border-red-500/30 bg-black/50 backdrop-blur-sm transition-all hover:border-primary hover:bg-red-950/40"
              >
                <div className="overflow-hidden aspect-video bg-black">
                  <iframe
                    src={`https://www.youtube.com/embed/${video.youtube_id}`}
                    title={video.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="h-full w-full"
                  />
                </div>
                <div className="flex flex-1 flex-col p-3 sm:p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium uppercase tracking-wider text-primary">
                      {video.type}
                    </span>
                    <span className="text-xs text-white/40">#{video.order_index}</span>
                  </div>
                  <h3 className="font-display text-lg font-semibold mb-2">{video.title}</h3>
                  {video.description && (
                    <p className="text-sm text-white/50 mb-4">{video.description}</p>
                  )}
                  <div className="mt-auto flex gap-2 pt-2">
                    <button
                      onClick={() => handleEdit(video)}
                      className="flex-1 rounded-full border border-red-500/30 bg-black/40 py-2 hover:bg-red-950/40 transition-colors flex items-center justify-center gap-2"
                    >
                      <Edit className="h-4 w-4" />
                      <span className="text-sm">Modifier</span>
                    </button>
                    <button
                      onClick={() => handleDelete(video.id!)}
                      className="flex-1 rounded-full border border-red-500/30 bg-black/40 py-2 hover:bg-red-950/40 transition-colors flex items-center justify-center gap-2"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="text-sm">Supprimer</span>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
