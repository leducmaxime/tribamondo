"use client";
import { useState, useEffect } from "react";
import type { Concert } from "@/types/database";
import { Trash2, Edit, Plus, X, Save, ChevronLeft, Upload, Image as ImageIcon, Calendar, LogOut } from "lucide-react";

function ConcertRow({ concert, onEdit, onDelete, isPast }: { concert: Concert; onEdit: (c: Concert) => void; onDelete: (id: number) => void; isPast?: boolean }) {
  return (
    <div
      className={`rounded-2xl border overflow-hidden backdrop-blur-sm transition-all ${
        isPast 
          ? "border-white/5 bg-white/[0.01] opacity-60" 
          : "border-red-500/30 bg-black/50 hover:border-primary hover:bg-red-950/40 shadow-lg shadow-primary/5"
      }`}
    >
      {concert.image_url && (
        <div className={`sm:hidden h-44 w-full overflow-hidden ${isPast ? "grayscale" : ""}`}>
          <img src={concert.image_url} alt="" className="h-full w-full object-cover" />
        </div>
      )}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between p-4 sm:p-6">
        {concert.image_url && (
          <div className={`hidden sm:block sm:mr-6 sm:h-24 sm:w-24 shrink-0 overflow-hidden rounded-lg border ${isPast ? "border-white/10 grayscale" : "border-red-500/20"}`}>
            <img src={concert.image_url} alt="" className="h-full w-full object-cover" />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 sm:gap-4 mb-2">
            <span className={`text-sm font-bold ${isPast ? "text-white/40" : "text-primary"}`}>
              {concert.date}
            </span>
            <span className="text-xs text-white/30 uppercase tracking-widest">
              {concert.dayOfWeek} • {concert.time}
            </span>
          </div>
          <h3 className={`font-display text-xl sm:text-2xl font-bold mb-2 ${isPast ? "text-white/50" : "text-white"}`}>{concert.title}</h3>
          <p className="text-white/70 mb-1 font-medium text-sm sm:text-base">{concert.venue}</p>
          <p className="text-xs text-white/40 italic mb-3">{concert.address}</p>
          {concert.description && (
            <p className="text-sm text-white/50 line-clamp-2 mb-3">{concert.description}</p>
          )}
          <div className="flex items-center gap-4">
            <span className={`text-xs font-bold uppercase ${isPast ? "text-white/30" : "text-primary/80"}`}>{concert.price}</span>
            {concert.ticket_url && (
              <a
                href={concert.ticket_url}
                target="_blank"
                rel="noopener noreferrer"
                className={`text-xs hover:underline ${isPast ? "text-white/20" : "text-primary"}`}
              >
                Lien Billetterie ↗
              </a>
            )}
          </div>
        </div>

        <div className="flex gap-2 self-end sm:self-start">
          <button
            onClick={() => onEdit(concert)}
            className={`rounded-full border p-2.5 sm:p-3 transition-colors ${
              isPast ? "border-white/5 bg-white/5 hover:bg-white/10 text-white/30" : "border-red-500/30 bg-black/40 hover:bg-red-950/40 text-white"
            }`}
          >
            <Edit className="h-4 w-4 sm:h-5 sm:w-5" />
          </button>
          <button
            onClick={() => onDelete(concert.id!)}
            className={`rounded-full border p-2.5 sm:p-3 transition-colors ${
              isPast ? "border-white/5 bg-white/5 hover:bg-white/10 text-white/30" : "border-red-500/30 bg-black/40 hover:bg-red-950/40 text-white"
            }`}
          >
            <Trash2 className="h-4 w-4 sm:h-5 sm:w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

export function ConcertsAdmin() {
  const [concerts, setConcerts] = useState<Concert[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<Partial<Concert>>({});
  const [nowTime, setNowTime] = useState(0);

  useEffect(() => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    setNowTime(now.getTime());
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
      fetchConcerts();
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

  async function fetchConcerts() {
    try {
      const res = await fetch("/api/concerts");
      const data = await res.json() as { success: boolean; data: Concert[] };
      if (data.success) {
        const now = new Date();
        now.setHours(0, 0, 0, 0);
        const nowTime = now.getTime();

        const parseDate = (dateStr: string) => {
          if (dateStr.includes('/')) {
            const [d, m, y] = dateStr.split('/').map(Number);
            return new Date(y, m - 1, d);
          }
          const months: Record<string, number> = {
            'Jan': 0, 'Fév': 1, 'Mar': 2, 'Avr': 3, 'Mai': 4, 'Juin': 5,
            'Juil': 6, 'Août': 7, 'Sept': 8, 'Oct': 9, 'Nov': 10, 'Déc': 11
          };
          const parts = dateStr.split(' ');
          if (parts.length === 3) {
            const d = parseInt(parts[0]);
            const m = months[parts[1]] || 0;
            const y = parseInt(parts[2]);
            return new Date(y, m, d);
          }
          return new Date(0);
        };

        const filteredConcerts = data.data.map(c => ({
          ...c,
          _timestamp: parseDate(c.date).getTime()
        }));

        const sorted = filteredConcerts.sort((a, b) => {
          const isPastA = a._timestamp < nowTime;
          const isPastB = b._timestamp < nowTime;

          if (!isPastA && isPastB) return -1;
          if (isPastA && !isPastB) return 1;

          if (!isPastA && !isPastB) return a._timestamp - b._timestamp;
          
          return b._timestamp - a._timestamp;
        });

        setConcerts(sorted);
      }
    } catch (error) {
      console.error("Failed to fetch concerts", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    const method = editing !== null ? "PUT" : "POST";
    const url = editing !== null ? `/api/concerts/${editing}` : "/api/concerts";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        await fetchConcerts();
        setForm({});
        setEditing(null);
        setShowForm(false);
      }
    } catch (error) {
      console.error("Failed to save concert", error);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce concert ?")) return;

    try {
      await fetch(`/api/concerts/${id}`, { method: "DELETE" });
      await fetchConcerts();
    } catch (error) {
      console.error("Failed to delete concert", error);
    }
  }

  function handleEdit(concert: Concert) {
    setForm(concert);
    setEditing(concert.id!);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function handleNew() {
    setForm({});
    setEditing(null);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json() as { success: boolean; url: string; error?: string };
      if (data.success) {
        setForm({ ...form, image_url: data.url });
      } else {
        alert("Erreur lors de l'upload: " + data.error);
      }
    } catch (error) {
      console.error("Upload failed", error);
      alert("Erreur réseau lors de l'upload");
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
            Gestion des <span className="text-primary">Concerts</span>
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
              <span className="hidden xs:inline">Nouveau Concert</span>
              <span className="xs:hidden">Nouveau</span>
            </button>
          </div>
        </div>

        {showForm && (
            <div className="mb-8 rounded-2xl border border-red-500/30 bg-black/50 p-4 sm:p-6 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-2xl font-bold">
                {editing !== null ? "Modifier" : "Nouveau"} Concert
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

            <div className="flex flex-col gap-6 lg:flex-row">
              {/* Left Column - Essential Info */}
              <div className="flex-1 space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-white/80">Titre</label>
                  <input
                    type="text"
                    value={form.title || ""}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    className="w-full rounded-lg border border-red-500/30 bg-black/40 px-4 py-3 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                    placeholder="Concert au Conservatoire"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 xs:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-white/80">Date</label>
                    <input
                      type="date"
                      value={form.date && form.date.includes('/') ? form.date.split('/').reverse().join('-') : form.date || ""}
                      onChange={(e) => {
                        const dateVal = e.target.value;
                        if (dateVal) {
                          const [y, m, d] = dateVal.split('-');
                          setForm({ ...form, date: `${d}/${m}/${y}` });
                        } else {
                          setForm({ ...form, date: "" });
                        }
                      }}
                      className="w-full rounded-lg border border-red-500/30 bg-black/40 px-4 py-3 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 [color-scheme:dark]"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 text-white/80">Heure</label>
                    <input
                      type="text"
                      value={form.time || ""}
                      onChange={(e) => setForm({ ...form, time: e.target.value })}
                      className="w-full rounded-lg border border-red-500/30 bg-black/40 px-4 py-3 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                      placeholder="17h00"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 xs:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-white/80">Jour</label>
                    <input
                      type="text"
                      value={form.dayOfWeek || ""}
                      onChange={(e) => setForm({ ...form, dayOfWeek: e.target.value })}
                      className="w-full rounded-lg border border-red-500/30 bg-black/40 px-4 py-3 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                      placeholder="Dimanche"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 text-white/80">Prix</label>
                    <input
                      type="text"
                      value={form.price || ""}
                      onChange={(e) => setForm({ ...form, price: e.target.value })}
                      className="w-full rounded-lg border border-red-500/30 bg-black/40 px-4 py-3 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                      placeholder="Entrée libre"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-white/80">Lieu (Nom)</label>
                  <input
                    type="text"
                    value={form.venue || ""}
                    onChange={(e) => setForm({ ...form, venue: e.target.value })}
                    className="w-full rounded-lg border border-red-500/30 bg-black/40 px-4 py-3 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                    placeholder="Conservatoire Olivier Messiaen"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-white/80">Adresse complète</label>
                  <input
                    type="text"
                    value={form.address || ""}
                    onChange={(e) => setForm({ ...form, address: e.target.value })}
                    className="w-full rounded-lg border border-red-500/30 bg-black/40 px-4 py-3 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                    placeholder="4 Rue Proudhon, 94500 Champigny-sur-Marne"
                  />
                </div>
              </div>

              {/* Right Column - Media & Booking */}
              <div className="flex-1 space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-white/80">Image du concert</label>
                  <div className="flex items-center gap-4 p-4 rounded-xl border border-dashed border-red-500/30 bg-black/20">
                    {form.image_url ? (
                      <div className="relative h-32 w-full overflow-hidden rounded-lg border border-primary/30 group">
                        <img src={form.image_url} alt="" className="h-full w-full object-cover" />
                        <button
                          onClick={() => setForm({ ...form, image_url: undefined })}
                          className="absolute right-2 top-2 rounded-full bg-black/80 p-1.5 text-white hover:bg-primary transition-colors"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ) : (
                      <label className="flex h-32 w-full cursor-pointer flex-col items-center justify-center rounded-lg hover:bg-red-950/10 transition-all">
                        <div className="rounded-full bg-primary/10 p-3 mb-2">
                          <ImageIcon className="h-6 w-6 text-primary" />
                        </div>
                        <span className="text-sm font-medium text-white/60">Ajouter une image</span>
                        <span className="text-xs text-white/30 mt-1">JPG, PNG (Max 5Mo)</span>
                        <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} />
                      </label>
                    )}
                  </div>
                </div>

                <div className="pt-2 space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-white/80">Lien Billetterie</label>
                    <input
                      type="url"
                      value={form.ticket_url || ""}
                      onChange={(e) => setForm({ ...form, ticket_url: e.target.value })}
                      className="w-full rounded-lg border border-red-500/30 bg-black/40 px-4 py-3 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                      placeholder="https://..."
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2 text-white/80">Réservation par téléphone</label>
                      <input
                        type="tel"
                        value={form.reservation_phone || ""}
                        onChange={(e) => setForm({ ...form, reservation_phone: e.target.value })}
                        className="w-full rounded-lg border border-red-500/30 bg-black/40 px-4 py-3 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                        placeholder="06 12 34 56 78"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-3 pt-2 bg-primary/5 p-3 rounded-lg border border-primary/10">
                    <button
                      type="button"
                      onClick={() => setForm({ ...form, reservation_required: form.reservation_required ? 0 : 1 })}
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${form.reservation_required ? 'bg-primary' : 'bg-white/10'}`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${form.reservation_required ? 'translate-x-5' : 'translate-x-0'}`}
                      />
                    </button>
                    <span className="text-sm font-medium text-white/90">Afficher "Réservation Obligatoire"</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium mb-2 text-white/80">Description</label>
              <textarea
                value={form.description || ""}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full rounded-lg border border-red-500/30 bg-black/40 px-4 py-3 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                rows={4}
                placeholder="Description du concert..."
              />
            </div>

            <div className="mt-8">
              <button
                onClick={handleSave}
                className="flex items-center gap-2 rounded-full bg-primary px-8 py-3 font-semibold text-black hover:bg-primary-dark transition-all active:scale-95"
              >
                <Save className="h-5 w-5" />
                {editing !== null ? "Mettre à jour" : "Enregistrer le concert"}
              </button>
            </div>
          </div>
        )}

        <div className="space-y-12">
          {/* Upcoming Section */}
          <div>
            <h2 className="mb-4 sm:mb-6 flex items-center gap-3 font-display text-xl sm:text-2xl font-bold">
              <Calendar className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
              Concerts <span className="text-primary">à venir</span>
            </h2>
            <div className="space-y-4">
              {concerts.filter(c => (c as any)._timestamp >= nowTime).length === 0 ? (
                <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-8 text-center backdrop-blur-sm">
                  <p className="text-white/40 italic">Aucun concert à venir.</p>
                </div>
              ) : (
                concerts.filter(c => (c as any)._timestamp >= nowTime).map((concert) => (
                  <ConcertRow key={concert.id} concert={concert} onEdit={handleEdit} onDelete={handleDelete} />
                ))
              )}
            </div>
          </div>

          {/* Past Section */}
          <div className="pt-8 border-t border-white/5">
            <h2 className="mb-4 sm:mb-6 flex items-center gap-3 font-display text-xl sm:text-2xl font-bold opacity-50">
              <ChevronLeft className="h-6 w-6 text-white/40 rotate-180" />
              Archives <span className="text-white/40">passées</span>
            </h2>
            <div className="space-y-4">
              {concerts.filter(c => (c as any)._timestamp < nowTime).map((concert) => (
                <ConcertRow key={concert.id} concert={concert} onEdit={handleEdit} onDelete={handleDelete} isPast />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
