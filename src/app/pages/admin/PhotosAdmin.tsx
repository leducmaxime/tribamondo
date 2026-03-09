"use client";

import { useState, useEffect } from "react";
import type { GalleryPhoto } from "@/types/database";
import { Trash2, Plus, X, Save, ChevronLeft, Image as ImageIcon, GripVertical } from "lucide-react";
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
import { useRequireAuth } from "@/app/hooks/useRequireAuth";
import { Toast } from "@/app/components/admin/Toast";
import { ConfirmModal } from "@/app/components/admin/ConfirmModal";

interface SortablePhotoProps {
  photo: GalleryPhoto;
  onDelete: (id: number) => void;
}

function SortablePhoto({ photo, onDelete }: SortablePhotoProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: photo.id! });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group relative aspect-square overflow-hidden rounded-xl border border-red-500/20 bg-black/40 transition-all hover:border-primary/50 ${
        isDragging ? "opacity-50 scale-105 shadow-2xl shadow-primary/20" : ""
      }`}
    >
      <img
        src={photo.url}
        alt={photo.description || ""}
        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
      />

      <div className="absolute inset-0 bg-black/60 opacity-0 transition-opacity duration-300 group-hover:opacity-100 flex flex-col items-center justify-center gap-2">
        <div className="flex gap-2">
          <button
            {...attributes}
            {...listeners}
            className="rounded-full bg-white/20 p-2 text-white hover:bg-primary cursor-grab active:cursor-grabbing"
            style={{ touchAction: 'none' }}
            title="Glisser pour réordonner"
          >
            <GripVertical className="h-5 w-5" />
          </button>
        </div>

        <button
          onClick={() => onDelete(photo.id!)}
          className="mt-2 rounded-full bg-red-500/20 p-2 text-red-500 hover:bg-red-500 hover:text-white transition-colors"
        >
          <Trash2 className="h-5 w-5" />
        </button>
      </div>

      <button
        {...attributes}
        {...listeners}
        className="md:hidden absolute top-2 left-2 rounded-full bg-black/70 p-1.5 text-white cursor-grab active:cursor-grabbing"
        style={{ touchAction: 'none' }}
        title="Glisser pour réordonner"
      >
        <GripVertical className="h-4 w-4" />
      </button>

      <div className="absolute top-2 right-2 rounded-full bg-black/60 px-2 py-1 text-xs font-bold text-white/80">
        #{photo.order_index}
      </div>
    </div>
  );
}

export function PhotosAdmin() {
  const { ready } = useRequireAuth();
  const [photos, setPhotos] = useState<GalleryPhoto[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<Partial<GalleryPhoto> & { urls?: string[] }>({});
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
    fetchPhotos();
  }, [ready]);

  async function fetchPhotos() {
    try {
      const res = await fetch("/api/photos");
      const data = await res.json() as { success: boolean; data: GalleryPhoto[] };
      if (data.success) {
        setPhotos(data.data.sort((a, b) => a.order_index - b.order_index));
      }
    } catch (error) {
      console.error("Failed to fetch photos", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    if (!form.urls || form.urls.length === 0) return;

    try {
      await Promise.all(
        form.urls.map((url: string, index: number) =>
          fetch("/api/photos", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              url,
              description: form.description || "",
              order_index: photos.length + index + 1,
            }),
          })
        )
      );

      await fetchPhotos();
      setToast({ message: form.urls && form.urls.length > 1 ? "Photos ajoutées ✓" : "Photo ajoutée ✓" });
      setForm({});
      setShowForm(false);
    } catch (error) {
      console.error("Failed to save photos", error);
      setToast({ message: "Erreur lors de l'opération", type: "error" });
    }
  }

  async function handleDelete(id: number) {
    setConfirmId(id);
  }

  async function doDelete(id: number) {
    try {
      await fetch(`/api/photos/${id}`, { method: "DELETE" });
      await fetchPhotos();
      setToast({ message: "Photo supprimée ✓" });
    } catch (error) {
      console.error("Failed to delete photo", error);
      setToast({ message: "Erreur lors de l'opération", type: "error" });
    }
  }

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setPhotos((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        const newItems = arrayMove(items, oldIndex, newIndex);

        const updatedPhotos = newItems.map((photo, index) => ({
          ...photo,
          order_index: index + 1,
        }));

        saveOrder(updatedPhotos);

        return updatedPhotos;
      });
    }
  }

  async function saveOrder(updatedPhotos: GalleryPhoto[]) {
    try {
      await fetch("/api/photos/reorder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          order: updatedPhotos.map((p) => ({ id: p.id, order_index: p.order_index })),
        }),
      });
    } catch (error) {
      console.error("Failed to save order", error);
    }
  }

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const uploadPromises = Array.from(files).map(async (file) => {
      const formData = new FormData();
      formData.append("file", file);

      try {
        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });
        const data = await res.json() as { success: boolean; url: string; error?: string };
        if (data.success) {
          return data.url;
        } else {
          alert("Erreur lors de l'upload: " + data.error);
          return null;
        }
      } catch (error) {
        console.error("Upload failed", error);
        alert("Erreur réseau lors de l'upload");
        return null;
      }
    });

    const urls = await Promise.all(uploadPromises);
    const validUrls = urls.filter((url): url is string => url !== null);
    
    if (validUrls.length > 0) {
      setForm((prev) => ({
        ...prev,
        urls: [...(prev.urls || []), ...validUrls],
      }));
    }
  }

  function handleNew() {
    setForm({ order_index: photos.length + 1 });
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
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
          <h1 className="font-display text-3xl sm:text-4xl font-bold">
            Gestion des <span className="text-primary">Photos</span>
          </h1>
          <div className="flex items-center gap-3 sm:gap-4">
            <button
              onClick={handleNew}
              className="flex items-center gap-2 rounded-full bg-primary px-4 py-2.5 sm:px-6 sm:py-3 font-semibold hover:bg-primary-dark transition-all active:scale-95 text-sm sm:text-base"
            >
              <Plus className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="hidden xs:inline">Nouvelles Photos</span>
              <span className="xs:hidden">Nouvelles</span>
            </button>
          </div>
        </div>

        <p className="text-white/50 mb-6 text-sm">
          <GripVertical className="inline h-4 w-4 mr-1" />
          Saisissez et déplacez les photos pour changer leur ordre
        </p>

        {showForm && (
          <div className="mb-8 rounded-2xl border border-red-500/30 bg-black/50 p-4 sm:p-6 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-xl sm:text-2xl font-bold">
                Ajouter des Photos
              </h2>
              <button
                onClick={() => {
                  setShowForm(false);
                  setForm({});
                }}
                className="text-white/50 hover:text-white"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-white/80">Images</label>
                  <div className="flex flex-col gap-4 p-4 rounded-xl border border-dashed border-red-500/30 bg-black/20">
                    {(form.urls && form.urls.length > 0) ? (
                      <>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                          {form.urls.map((url: string, idx: number) => (
                            <div key={idx} className="relative aspect-square overflow-hidden rounded-lg border border-primary/30 group">
                              <img src={url} alt="" className="h-full w-full object-cover" />
                              <button
                                onClick={() =>
                                  setForm({
                                    ...form,
                                    urls: form.urls?.filter((_: string, i: number) => i !== idx),
                                  })
                                }
                                className="absolute right-2 top-2 rounded-full bg-black/80 p-1.5 text-white hover:bg-primary transition-colors"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            </div>
                          ))}
                        </div>

                        <label className="flex h-32 w-full cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-red-500/30 hover:bg-red-950/10 transition-all">
                          <div className="rounded-full bg-primary/10 p-3 mb-2">
                            <Plus className="h-6 w-6 text-primary" />
                          </div>
                          <span className="text-sm font-medium text-white/60">Ajouter d'autres images</span>
                          <span className="text-xs text-white/30 mt-1">JPG, PNG (Max 5Mo chaque)</span>
                          <input type="file" className="hidden" accept="image/*" multiple onChange={handleFileUpload} />
                        </label>
                      </>
                    ) : (
                      <label className="flex h-48 w-full cursor-pointer flex-col items-center justify-center rounded-lg hover:bg-red-950/10 transition-all">
                        <div className="rounded-full bg-primary/10 p-3 mb-2">
                          <ImageIcon className="h-6 w-6 text-primary" />
                        </div>
                        <span className="text-sm font-medium text-white/60">Ajouter des images</span>
                        <span className="text-xs text-white/30 mt-1">Sélectionnez plusieurs fichiers (JPG, PNG, Max 5Mo)</span>
                        <input type="file" className="hidden" accept="image/*" multiple onChange={handleFileUpload} />
                      </label>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-white/80">Description (Optionnel)</label>
                  <textarea
                    value={form.description || ""}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    className="w-full rounded-lg border border-red-500/30 bg-black/40 px-4 py-3 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                    rows={3}
                    placeholder="Description de la photo..."
                  />
                </div>

                <div className="pt-4">
                  <button
                    onClick={handleSave}
                    disabled={!form.urls || form.urls.length === 0}
                    className="flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 font-semibold text-black hover:bg-primary-dark transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Save className="h-5 w-5" />
                    Enregistrer {form.urls && form.urls.length > 0 && (`(${form.urls.length} photo${form.urls.length > 1 ? 's' : ''})`)}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={photos.map((p) => p.id!)}
            strategy={rectSortingStrategy}
          >
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {photos.length === 0 ? (
                <div className="col-span-full rounded-2xl border border-red-500/30 bg-black/50 p-12 text-center backdrop-blur-sm">
                  <p className="text-white/50">Aucune photo dans la galerie.</p>
                </div>
              ) : (
                photos.map((photo) => (
                  <SortablePhoto
                    key={photo.id}
                    photo={photo}
                    onDelete={handleDelete}
                  />
                ))
              )}
            </div>
          </SortableContext>
        </DndContext>
      </div>
      {confirmId !== null && (
        <ConfirmModal
          message="Supprimer cet élément ?"
          onConfirm={() => {
            doDelete(confirmId);
            setConfirmId(null);
          }}
          onCancel={() => setConfirmId(null)}
        />
      )}
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}
    </div>
  );
}
