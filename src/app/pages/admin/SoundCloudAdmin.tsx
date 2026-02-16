"use client";
import { useState, useEffect } from "react";
import type { SoundCloudTrack } from "@/types/database";
import { Trash2, Edit, Plus, X, Save, ChevronLeft, Music } from "lucide-react";

export function SoundCloudAdmin() {
  const [tracks, setTracks] = useState<SoundCloudTrack[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<Partial<SoundCloudTrack>>({});

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
      fetchTracks();
    } catch {
      window.location.href = "/admin/login";
    }
  }

  async function fetchTracks() {
    try {
      const res = await fetch("/api/soundcloud");
      const data = await res.json() as { success: boolean; data: SoundCloudTrack[] };
      if (data.success) {
        setTracks(data.data.sort((a, b) => a.order_index - b.order_index));
      }
    } catch (error) {
      console.error("Failed to fetch tracks", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    const method = editing !== null ? "PUT" : "POST";
    const url = editing !== null ? `/api/soundcloud/${editing}` : "/api/soundcloud";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        await fetchTracks();
        setForm({});
        setEditing(null);
        setShowForm(false);
      }
    } catch (error) {
      console.error("Failed to save track", error);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce morceau ?")) return;

    try {
      await fetch(`/api/soundcloud/${id}`, { method: "DELETE" });
      await fetchTracks();
    } catch (error) {
      console.error("Failed to delete track", error);
    }
  }

  function handleEdit(track: SoundCloudTrack) {
    setForm(track);
    setEditing(track.id!);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function handleNew() {
    setForm({ order_index: tracks.length + 1 });
    setEditing(null);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-display text-4xl font-bold">
            Gestion <span className="text-primary">SoundCloud</span>
          </h1>
          <button
            onClick={handleNew}
            className="flex items-center gap-2 rounded-full bg-primary px-6 py-3 font-semibold hover:bg-primary-dark transition-all active:scale-95"
          >
            <Plus className="h-5 w-5" />
            Ajouter un son
          </button>
        </div>

        {showForm && (
          <div className="mb-8 rounded-2xl border border-red-500/30 bg-black/50 p-6 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-2xl font-bold">
                {editing !== null ? "Modifier" : "Nouveau"} Morceau
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
                <label className="block text-sm font-medium mb-2">Titre</label>
                <input
                  type="text"
                  value={form.title || ""}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full rounded-lg border border-red-500/30 bg-black/40 px-4 py-3 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  placeholder="Ex: ETerNiTaTis 3.0"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Lien SoundCloud</label>
                <input
                  type="text"
                  value={form.url || ""}
                  onChange={(e) => setForm({ ...form, url: e.target.value })}
                  className="w-full rounded-lg border border-red-500/30 bg-black/40 px-4 py-3 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  placeholder="https://soundcloud.com/..."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <textarea
                  value={form.description || ""}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full rounded-lg border border-red-500/30 bg-black/40 px-4 py-3 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  rows={3}
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

        <div className="grid gap-6">
          {tracks.length === 0 ? (
            <div className="rounded-2xl border border-red-500/30 bg-black/50 p-12 text-center backdrop-blur-sm">
              <p className="text-white/50">Aucun morceau pour le moment.</p>
            </div>
          ) : (
            tracks.map((track) => (
              <div
                key={track.id}
                className="group flex flex-col overflow-hidden rounded-2xl border border-red-500/30 bg-black/50 backdrop-blur-sm transition-all hover:border-primary hover:bg-red-950/40"
              >
                <div className="flex flex-col md:flex-row p-6 gap-6">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-white/40">#{track.order_index}</span>
                    </div>
                    <h3 className="font-display text-xl font-semibold mb-2">{track.title}</h3>
                    {track.description && (
                      <p className="text-sm text-white/50 mb-4">{track.description}</p>
                    )}
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(track)}
                        className="rounded-full border border-red-500/30 bg-black/40 px-4 py-2 hover:bg-red-950/40 transition-colors flex items-center gap-2 text-sm"
                      >
                        <Edit className="h-4 w-4" />
                        Modifier
                      </button>
                      <button
                        onClick={() => handleDelete(track.id!)}
                        className="rounded-full border border-red-500/30 bg-black/40 px-4 py-2 hover:bg-red-950/40 transition-colors flex items-center gap-2 text-sm"
                      >
                        <Trash2 className="h-4 w-4" />
                        Supprimer
                      </button>
                    </div>
                  </div>
                  <div className="w-full md:w-1/2">
                    <iframe
                      width="100%"
                      height="120"
                      scrolling="no"
                      frameBorder="no"
                      allow="autoplay"
                      src={`https://w.soundcloud.com/player/?url=${encodeURIComponent(track.url)}&color=%23dc2626&auto_play=false&hide_related=true&show_comments=false&show_user=true&show_reposts=false&show_teaser=false&visual=true`}
                    />
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
