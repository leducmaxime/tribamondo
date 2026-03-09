"use client";
import { Calendar, Video, Music, History, ImageIcon, MessageCircle, Users } from "lucide-react";
import { useRequireAuth } from "@/app/hooks/useRequireAuth";

export function AdminDashboard() {
  const { ready, username } = useRequireAuth();

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-xl">Chargement...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-20">
      <div className="container max-w-6xl">
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold mb-2 sm:text-4xl">
            Administration <span className="text-primary">TriBa MonDo</span>
          </h1>
          <p className="text-white/60 text-lg">
            Bonjour, {username}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:gap-6 md:grid-cols-3">
          {[
            { href: "/admin/concerts", icon: Calendar, label: "Gestion des Concerts", desc: "Ajouter, modifier ou supprimer les dates de concerts à venir." },
            { href: "/admin/videos", icon: Video, label: "Gestion des Vidéos", desc: "Gérer les vidéos YouTube affichées sur la page Musique." },
            { href: "/admin/ytmusic", icon: Music, label: "Gestion YouTube Music", desc: "Ajouter ou modifier les morceaux YouTube Music de la page Musique." },
            { href: "/admin/photos", icon: ImageIcon, label: "Gestion Photos", desc: "Ajouter ou modifier les photos de la galerie \"Le Groupe\"." },
            { href: "/admin/interviews", icon: MessageCircle, label: "Gestion Interviews", desc: "Ajouter ou modifier les questions/réponses de l'accordéon \"Le Groupe\"." },
            { href: "/admin/membres", icon: Users, label: "Gestion du groupe", desc: "Modifier les photos, descriptions des musiciens et le texte Notre histoire." },
            { href: "/admin/audit", icon: History, label: "Historique", desc: "Consulter l'historique des actions effectuées par les administrateurs." },
          ].map(({ href, icon: Icon, label, desc }) => (
            <a
              key={href}
              href={href}
              className="group rounded-2xl border border-red-500/30 bg-black/50 p-3 sm:p-8 backdrop-blur-sm transition-all hover:border-primary hover:bg-red-950/40 hover:shadow-2xl hover:shadow-primary/20"
            >
              <div className="mb-2 sm:mb-4 inline-flex h-11 w-11 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-red-950/50">
                <Icon className="h-5 w-5 sm:h-8 sm:w-8 text-primary" />
              </div>
              <h2 className="font-display text-base sm:text-2xl font-bold sm:mb-2 group-hover:text-primary transition-colors leading-tight">
                {label}
              </h2>
              <p className="hidden sm:block text-white/60">{desc}</p>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
