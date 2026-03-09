"use client";
import { useState, useEffect } from "react";
import type { Interview, InterviewAnswer } from "@/types/database";
import { Trash2, Edit, Plus, X, Save, ChevronLeft, GripVertical, ChevronDown } from "lucide-react";
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
import { useRequireAuth } from "@/app/hooks/useRequireAuth";
import { Toast } from "@/app/components/admin/Toast";
import { ConfirmModal } from "@/app/components/admin/ConfirmModal";

const MEMBERS = ["Marcel", "Emmanuelle", "Fred", "TriBa MonDo"];

interface SortableInterviewProps {
  interview: Interview;
  onEdit: (interview: Interview) => void;
  onDelete: (id: number) => void;
}

function SortableInterview({ interview, onEdit, onDelete }: SortableInterviewProps) {
  const [expanded, setExpanded] = useState(false);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: interview.id! });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`rounded-2xl border border-red-500/30 bg-black/50 backdrop-blur-sm transition-all ${
        isDragging ? "opacity-50 scale-[1.02] shadow-2xl shadow-primary/20" : ""
      }`}
    >
      <div className="flex items-center gap-3 px-4 py-4 sm:px-6">
        <button
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing p-1 rounded hover:bg-white/10 shrink-0"
          style={{ touchAction: 'none' }}
          title="Glisser pour réordonner"
        >
          <GripVertical className="h-5 w-5 text-white/40" />
        </button>

        <span className="text-xs text-white/40 shrink-0">#{interview.order_index}</span>

        <button
          onClick={() => setExpanded((v) => !v)}
          className="flex-1 text-left text-xs sm:text-sm font-medium text-white hover:text-primary transition-colors min-w-0"
        >
          {interview.question}
        </button>

        <button
          onClick={() => setExpanded((v) => !v)}
          className="shrink-0 p-1 rounded hover:bg-white/10 transition-colors"
          title={expanded ? "Replier" : "Déplier"}
        >
          <ChevronDown
            className={`h-5 w-5 text-white/50 transition-transform duration-200 ${expanded ? "rotate-180" : ""}`}
          />
        </button>
      </div>

      {expanded && (
        <div className="px-4 pb-4 sm:px-6 sm:pb-6 border-t border-red-500/20 pt-4">
          <div className="space-y-3 mb-4">
            {interview.answers.map((answer, idx) => (
              <div key={idx} className="bg-black/30 rounded-lg p-3">
                <span className="text-sm font-semibold text-white/80">{answer.name}:</span>
                <p className="text-sm text-white/60 mt-1">{answer.text}</p>
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => onEdit(interview)}
              className="rounded-full border border-red-500/30 bg-black/40 px-4 py-2 hover:bg-red-950/40 transition-colors flex items-center gap-2 text-sm"
            >
              <Edit className="h-4 w-4" />
              Modifier
            </button>
            <button
              onClick={() => onDelete(interview.id!)}
              className="rounded-full border border-red-500/30 bg-black/40 px-4 py-2 hover:bg-red-950/40 transition-colors flex items-center gap-2 text-sm"
            >
              <Trash2 className="h-4 w-4" />
              Supprimer
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export function InterviewsAdmin() {
  const { ready } = useRequireAuth();
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<Partial<Interview>>({ answers: [] });
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
    fetchInterviews();
  }, [ready]);

  async function fetchInterviews() {
    try {
      const res = await fetch("/api/interviews");
      const data = await res.json() as { success: boolean; data: Interview[] };
      if (data.success) {
        const sorted = data.data.sort((a, b) => a.order_index - b.order_index);
        const renumbered = sorted.map((interview, index) => ({ ...interview, order_index: index + 1 }));
        const needsUpdate = renumbered.some((item, i) => item.order_index !== sorted[i].order_index);
        setInterviews(renumbered);
        if (needsUpdate) await saveOrder(renumbered);
      }
    } catch (error) {
      console.error("Failed to fetch interviews", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    const method = editing !== null ? "PUT" : "POST";
    const url = editing !== null ? `/api/interviews/${editing}` : "/api/interviews";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, order_index: form.order_index || interviews.length + 1 }),
      });

      if (res.ok) {
        await fetchInterviews();
        setForm({ answers: [] });
        setEditing(null);
        setShowForm(false);
        setToast({ message: editing !== null ? "Interview mise à jour ✓" : "Interview enregistrée ✓" });
      }
    } catch (error) {
      console.error("Failed to save interview", error);
      setToast({ message: "Erreur lors de l'opération", type: "error" });
    }
  }

  async function handleDelete(id: number) {
    setConfirmId(id);
  }

  async function doDelete(id: number) {
    try {
      await fetch(`/api/interviews/${id}`, { method: "DELETE" });
      await fetchInterviews();
      setToast({ message: "Interview supprimée ✓" });
    } catch (error) {
      console.error("Failed to delete interview", error);
      setToast({ message: "Erreur lors de l'opération", type: "error" });
    }
  }

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setInterviews((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        const newItems = arrayMove(items, oldIndex, newIndex);

        const updatedInterviews = newItems.map((interview, index) => ({
          ...interview,
          order_index: index + 1,
        }));

        saveOrder(updatedInterviews);

        return updatedInterviews;
      });
    }
  }

  async function saveOrder(updatedInterviews: Interview[]) {
    try {
      await Promise.all(
        updatedInterviews.map((interview) =>
          fetch(`/api/interviews/${interview.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(interview),
          })
        )
      );
    } catch (error) {
      console.error("Failed to save order", error);
    }
  }

  function handleEdit(interview: Interview) {
    setForm(interview);
    setEditing(interview.id!);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function handleNew() {
    setForm({ 
      question: "", 
      answers: MEMBERS.map(name => ({ name, text: "" })).filter(a => a.name !== "TriBa MonDo"),
      order_index: interviews.length + 1 
    });
    setEditing(null);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function addAnswer() {
    const currentAnswers = form.answers || [];
    setForm({
      ...form,
      answers: [...currentAnswers, { name: "TriBa MonDo", text: "" }],
    });
  }

  function removeAnswer(index: number) {
    const currentAnswers = form.answers || [];
    setForm({
      ...form,
      answers: currentAnswers.filter((_, i) => i !== index),
    });
  }

  function updateAnswer(index: number, field: keyof InterviewAnswer, value: string) {
    const currentAnswers = form.answers || [];
    const updatedAnswers = [...currentAnswers];
    updatedAnswers[index] = { ...updatedAnswers[index], [field]: value };
    setForm({ ...form, answers: updatedAnswers });
  }

  const isFormValid = form.question && form.answers && form.answers.length > 0 && form.answers.every(a => a.name && a.text);

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
            Gestion des <span className="text-primary">Interviews</span>
          </h1>
          <div className="flex items-center gap-3 sm:gap-4">
            <button
              onClick={handleNew}
              className="flex items-center gap-2 rounded-full bg-primary px-4 py-2.5 sm:px-6 sm:py-3 font-semibold hover:bg-primary-dark transition-all active:scale-95 text-sm sm:text-base"
            >
              <Plus className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="hidden xs:inline">Nouvelle Question</span>
              <span className="xs:hidden">Nouvelle</span>
            </button>
          </div>
        </div>

        <p className="text-white/50 mb-6 text-sm">
          <GripVertical className="inline h-4 w-4 mr-1" />
          Saisissez et déplacez les questions pour changer leur ordre dans l'accordéon
        </p>

        {showForm && (
          <div className="mb-8 rounded-2xl border border-red-500/30 bg-black/50 p-4 sm:p-6 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-xl sm:text-2xl font-bold">
                {editing !== null ? "Modifier" : "Nouvelle"} Question
              </h2>
              <button
                onClick={() => {
                  setShowForm(false);
                  setForm({ answers: [] });
                  setEditing(null);
                }}
                className="text-white/50 hover:text-white"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-white/80">Question *</label>
                <input
                  type="text"
                  value={form.question || ""}
                  onChange={(e) => setForm({ ...form, question: e.target.value })}
                  className="w-full rounded-lg border border-red-500/30 bg-black/40 px-4 py-3 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  placeholder="Qu'est-ce qui vous inspire dans les musiques du monde ?"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-white/80">Réponses *</label>
                <div className="space-y-3">
                  {(form.answers || []).map((answer, index) => (
                    <div key={index} className="bg-black/30 rounded-lg p-4 border border-red-500/20">
                      <div className="flex items-center gap-2 mb-2">
                        <select
                          value={answer.name}
                          onChange={(e) => updateAnswer(index, "name", e.target.value)}
                          className="bg-black/40 border border-red-500/30 rounded px-3 py-1.5 text-sm focus:border-primary focus:outline-none"
                        >
                          {MEMBERS.map((member) => (
                            <option key={member} value={member}>{member}</option>
                          ))}
                        </select>
                        <button
                          onClick={() => removeAnswer(index)}
                          className="ml-auto text-red-500 hover:text-red-400 p-1"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                      <textarea
                        value={answer.text}
                        onChange={(e) => updateAnswer(index, "text", e.target.value)}
                        className="w-full rounded-lg border border-red-500/30 bg-black/40 px-4 py-3 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                        rows={3}
                        placeholder="Réponse..."
                        required
                      />
                    </div>
                  ))}
                </div>
                <button
                  onClick={addAnswer}
                  className="mt-3 flex items-center gap-2 text-sm text-primary hover:text-primary-dark"
                >
                  <Plus className="h-4 w-4" />
                  Ajouter une réponse
                </button>
              </div>

              <div className="pt-4">
                <button
                  onClick={handleSave}
                  disabled={!isFormValid}
                  className="flex items-center gap-2 rounded-full bg-primary px-6 py-3 font-semibold text-black hover:bg-primary-dark transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Save className="h-5 w-5" />
                  Enregistrer
                </button>
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
            items={interviews.map((i) => i.id!)}
            strategy={verticalListSortingStrategy}
          >
            <div className="grid gap-6">
              {interviews.length === 0 ? (
                <div className="rounded-2xl border border-red-500/30 bg-black/50 p-12 text-center backdrop-blur-sm">
                  <p className="text-white/50">Aucune interview pour le moment.</p>
                </div>
              ) : (
                interviews.map((interview) => (
                  <SortableInterview
                    key={interview.id}
                    interview={interview}
                    onEdit={handleEdit}
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
