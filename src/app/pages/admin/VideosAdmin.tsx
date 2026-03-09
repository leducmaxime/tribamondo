"use client";
import { useState, useEffect } from "react";
import type { YouTubeVideo } from "@/types/database";
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
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface SortableVideoProps {
  video: YouTubeVideo;
  onEdit: (video: YouTubeVideo) => void;
  onDelete: (id: number) => void;
}

function SortableVideo({ video, onEdit, onDelete }: SortableVideoProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: video.id! });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group overflow-hidden rounded-xl border border-red-500/30 bg-black/50 backdrop-blur-sm transition-all hover:border-primary ${
        isDragging ? "opacity-50 scale-[1.02] shadow-2xl shadow-primary/20" : ""
      }`}
    >
      <div className="relative aspect-video bg-black">
        <img
          src={`https://img.youtube.com/vi/${video.youtube_id}/hqdefault.jpg`}
          alt={video.title}
          className="absolute inset-0 h-full w-full object-cover object-center"
        />
        <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity px-2 pb-2">
          <span className="text-xs text-white/90 line-clamp-1">{video.title}</span>
        </div>
      </div>

      <div className="flex items-center gap-1 p-1.5">
        <button
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing rounded p-1.5 hover:bg-white/10 transition-colors"
          style={{ touchAction: 'none' }}
          title="Réordonner"
        >
          <GripVertical className="h-4 w-4 text-white/40" />
        </button>
        <button
          onClick={() => onEdit(video)}
          className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-red-500/20 bg-black/40 py-1.5 hover:bg-red-950/40 transition-colors"
        >
          <Edit className="h-3.5 w-3.5" />
          <span className="text-xs">Modifier</span>
        </button>
        <button
          onClick={() => onDelete(video.id!)}
          className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-red-500/20 bg-black/40 py-1.5 hover:bg-red-950/40 transition-colors"
        >
          <Trash2 className="h-3.5 w-3.5" />
          <span className="text-xs">Supprimer</span>
        </button>
      </div>
    </div>
  );
}

export function VideosAdmin() {
  const { ready } = useRequireAuth();
  const [videos, setVideos] = useState<YouTubeVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<Partial<YouTubeVideo>>({});
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

    fetchVideos();
  }, [ready]);

  async function fetchVideos() {
    setLoading(true);
    try {
      const res = await fetch("/api/videos");
      const data = await res.json() as { success: boolean; data: YouTubeVideo[] };
      if (data.success) {
        setVideos(data.data.sort((a, b) => a.order_index - b.order_index));
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
        } else if (youtube_id.includes("/shorts/")) {
          const parts = urlObj.pathname.split("/");
          youtube_id = parts[parts.indexOf("shorts") + 1] || youtube_id;
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
        setToast({ message: editing !== null ? "Vidéo mise à jour ✓" : "Vidéo enregistrée ✓" });
      } else {
        setToast({ message: "Erreur lors de l'opération", type: "error" });
      }
    } catch (error) {
      console.error("Failed to save video", error);
      setToast({ message: "Erreur lors de l'opération", type: "error" });
    }
  }

  function handleDelete(id: number) {
    setConfirmId(id);
  }

  async function doDelete(id: number) {
    try {
      const res = await fetch(`/api/videos/${id}`, { method: "DELETE" });
      if (!res.ok) {
        setToast({ message: "Erreur lors de l'opération", type: "error" });
        return;
      }
      await fetchVideos();
      setToast({ message: "Vidéo supprimée ✓" });
    } catch {
      setToast({ message: "Erreur lors de l'opération", type: "error" });
    }
  }

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setVideos((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        const newItems = arrayMove(items, oldIndex, newIndex);

        const updatedVideos = newItems.map((video, index) => ({
          ...video,
          order_index: index,
        }));

        saveOrder(updatedVideos);

        return updatedVideos;
      });
    }
  }

  async function saveOrder(updatedVideos: YouTubeVideo[]) {
    try {
      await fetch("/api/videos/reorder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          order: updatedVideos.map((v) => ({ id: v.id, order_index: v.order_index })),
        }),
      });
    } catch (error) {
      console.error("Failed to save order", error);
    }
  }

  function handleEdit(video: YouTubeVideo) {
    setForm(video);
    setEditing(video.id!);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleNew() {
    setForm({ order_index: videos.length });
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
              onClick={handleNew}
              className="flex items-center gap-2 rounded-full bg-primary px-4 py-2.5 sm:px-6 sm:py-3 font-semibold hover:bg-primary-dark transition-all active:scale-95 text-sm sm:text-base"
            >
              <Plus className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="hidden xs:inline">Nouvelle Vidéo</span>
              <span className="xs:hidden">Nouvelle</span>
            </button>
          </div>
        </div>

        <p className="text-white/50 mb-6 text-sm">
          <GripVertical className="inline h-4 w-4 mr-1" />
          Saisissez et déplacez les vidéos pour changer leur ordre
        </p>

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
                  onChange={(e) => {
                    const url = e.target.value;
                    const isShort = url.includes("/shorts/");
                    setForm({ ...form, youtube_id: url, ...(isShort && !form.type ? { type: "Short" } : {}) });
                  }}
                  className="w-full rounded-lg border border-red-500/30 bg-black/40 px-4 py-3 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  placeholder="https://www.youtube.com/watch?v=... ou /shorts/..."
                  required
                />
                <p className="mt-1 text-xs text-white/40">
                  Vidéo classique ou Short YouTube. Le type sera auto-rempli pour les Shorts.
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
            items={videos.map((v) => v.id!)}
            strategy={rectSortingStrategy}
          >
            <div className="grid gap-3 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {videos.length === 0 ? (
                <div className="col-span-full rounded-2xl border border-red-500/30 bg-black/50 p-12 text-center backdrop-blur-sm">
                  <p className="text-white/50">Aucune vidéo pour le moment.</p>
                </div>
              ) : (
                videos.map((video) => (
                  <SortableVideo
                    key={video.id}
                    video={video}
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
