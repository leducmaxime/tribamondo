"use client";
import { useState, useEffect } from "react";
import type { YouTubeMusicTrack } from "@/types/database";
import { useRequireAuth } from "@/app/hooks/useRequireAuth";
import { Toast } from "@/app/components/admin/Toast";
import { ConfirmModal } from "@/app/components/admin/ConfirmModal";
import { Trash2, Edit, Plus, X, Save, ChevronLeft, GripVertical } from "lucide-react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

function extractYouTubeId(url: string): string {
  if (!url) return "";
  try {
    const u = new URL(url);
    if (u.pathname.includes("/watch")) return u.searchParams.get("v") || "";
    if (u.hostname === "youtu.be") return u.pathname.slice(1);
    return url;
  } catch {
    return url;
  }
}

interface SortableTrackProps {
  track: YouTubeMusicTrack;
  onEdit: (track: YouTubeMusicTrack) => void;
  onDelete: (id: number) => void;
}

function SortableTrack({ track, onEdit, onDelete }: SortableTrackProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: track.id! });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 1,
  };

  const videoId = extractYouTubeId(track.url);

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group flex flex-col overflow-hidden rounded-2xl border border-red-500/30 bg-black/50 backdrop-blur-sm transition-all hover:border-primary hover:bg-red-950/40 ${
        isDragging ? "opacity-50 scale-[1.02] shadow-2xl shadow-primary/20" : ""
      }`}
    >
      <div className="flex flex-col md:flex-row p-4 sm:p-6 gap-4 sm:gap-6">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-2">
            <button
              {...attributes}
              {...listeners}
              className="cursor-grab active:cursor-grabbing p-1 rounded hover:bg-white/10"
              style={{ touchAction: "none" }}
              title="Glisser pour réordonner"
            >
              <GripVertical className="h-5 w-5 text-white/40" />
            </button>
            <span className="text-xs text-white/40">#{track.order_index}</span>
          </div>
          <h3 className="font-display text-lg sm:text-xl font-semibold mb-2">{track.title}</h3>
          {track.description && (
            <p className="text-sm text-white/50 mb-4">{track.description}</p>
          )}
          <div className="flex gap-2">
            <button
              onClick={() => onEdit(track)}
              className="rounded-full border border-red-500/30 bg-black/40 px-4 py-2 hover:bg-red-950/40 transition-colors flex items-center gap-2 text-sm"
            >
              <Edit className="h-4 w-4" />
              Modifier
            </button>
            <button
              onClick={() => onDelete(track.id!)}
              className="rounded-full border border-red-500/30 bg-black/40 px-4 py-2 hover:bg-red-950/40 transition-colors flex items-center gap-2 text-sm"
            >
              <Trash2 className="h-4 w-4" />
              Supprimer
            </button>
          </div>
        </div>
        {videoId && (
          <div className="w-full md:w-1/2 aspect-video rounded-lg overflow-hidden">
            <iframe
              width="100%"
              height="100%"
              src={`https://www.youtube.com/embed/${videoId}`}
              title={track.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="h-full w-full"
            />
          </div>
        )}
      </div>
    </div>
  );
}

export function YouTubeMusicAdmin() {
  const { ready } = useRequireAuth();
  const [tracks, setTracks] = useState<YouTubeMusicTrack[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<Partial<YouTubeMusicTrack>>({});
  const [toast, setToast] = useState<{ message: string; type?: "success" | "error" } | null>(null);
  const [confirmId, setConfirmId] = useState<number | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 250,
        tolerance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    if (!ready) return;

    fetchTracks();
  }, [ready]);

  async function fetchTracks() {
    setLoading(true);
    try {
      const res = await fetch("/api/soundcloud");
      const data = await res.json() as { success: boolean; data: YouTubeMusicTrack[] };
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
        setToast({ message: editing !== null ? "Morceau mis à jour ✓" : "Morceau enregistré ✓" });
      } else {
        setToast({ message: "Erreur lors de l'opération", type: "error" });
      }
    } catch (error) {
      console.error("Failed to save track", error);
      setToast({ message: "Erreur lors de l'opération", type: "error" });
    }
  }

  function handleDelete(id: number) {
    setConfirmId(id);
  }

  async function doDelete(id: number) {
    try {
      const res = await fetch(`/api/soundcloud/${id}`, { method: "DELETE" });
      if (!res.ok) {
        setToast({ message: "Erreur lors de l'opération", type: "error" });
        return;
      }
      await fetchTracks();
      setToast({ message: "Morceau supprimé ✓" });
    } catch {
      setToast({ message: "Erreur lors de l'opération", type: "error" });
    }
  }

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setTracks((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        const newItems = arrayMove(items, oldIndex, newIndex);

        const updatedTracks = newItems.map((track, index) => ({
          ...track,
          order_index: index + 1,
        }));

        saveOrder(updatedTracks);

        return updatedTracks;
      });
    }
  }

  async function saveOrder(updatedTracks: YouTubeMusicTrack[]) {
    try {
      await fetch("/api/soundcloud/reorder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          order: updatedTracks.map((t) => ({ id: t.id, order_index: t.order_index })),
        }),
      });
    } catch (error) {
      console.error("Failed to save order", error);
    }
  }

  function handleEdit(track: YouTubeMusicTrack) {
    setForm(track);
    setEditing(track.id!);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleNew() {
    setForm({ order_index: tracks.length + 1 });
    setEditing(null);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
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
            Gestion <span className="text-primary">YouTube Music</span>
          </h1>
          <div className="flex items-center gap-3 sm:gap-4">
            <button
              onClick={handleNew}
              className="flex items-center gap-2 rounded-full bg-primary px-4 py-2.5 sm:px-6 sm:py-3 font-semibold hover:bg-primary-dark transition-all active:scale-95 text-sm sm:text-base"
            >
              <Plus className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="hidden xs:inline">Ajouter un morceau</span>
              <span className="xs:hidden">Ajouter</span>
            </button>
          </div>
        </div>

        <p className="text-white/50 mb-6 text-sm">
          <GripVertical className="inline h-4 w-4 mr-1" />
          Saisissez et déplacez les morceaux pour changer leur ordre
        </p>

        {showForm && (
          <div className="mb-8 rounded-2xl border border-red-500/30 bg-black/50 p-4 sm:p-6 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-xl sm:text-2xl font-bold">
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
                <label className="block text-sm font-medium mb-2">Lien YouTube Music</label>
                <input
                  type="text"
                  value={form.url || ""}
                  onChange={(e) => setForm({ ...form, url: e.target.value })}
                  className="w-full rounded-lg border border-red-500/30 bg-black/40 px-4 py-3 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  placeholder="https://music.youtube.com/watch?v=... ou https://youtube.com/watch?v=..."
                  required
                />
                <p className="mt-1 text-xs text-white/40">
                  Lien YouTube Music ou YouTube classique accepté.
                </p>
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

        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={tracks.map((t) => t.id!)}
            strategy={verticalListSortingStrategy}
          >
            <div className="grid gap-6">
              {tracks.length === 0 ? (
                <div className="rounded-2xl border border-red-500/30 bg-black/50 p-12 text-center backdrop-blur-sm">
                  <p className="text-white/50">Aucun morceau pour le moment.</p>
                </div>
              ) : (
                tracks.map((track) => (
                  <SortableTrack
                    key={track.id}
                    track={track}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
                ))
              )}
            </div>
          </SortableContext>
        </DndContext>

        {toast && <Toast {...toast} onClose={() => setToast(null)} />}
        {confirmId !== null && (
          <ConfirmModal
            message="Supprimer cet élément ?"
            onConfirm={() => {
              if (confirmId !== null) {
                void doDelete(confirmId);
              }
              setConfirmId(null);
            }}
            onCancel={() => setConfirmId(null)}
          />
        )}
      </div>
    </div>
  );
}
